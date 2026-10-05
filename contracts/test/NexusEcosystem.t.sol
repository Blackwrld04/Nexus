// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/IERC8004.sol";
import "../src/NexusIdentityRegistry.sol";
import "../src/NexusReputationRegistry.sol";
import "../src/MockAUSD.sol";
import "../src/NexusEscrowVault.sol";

contract NexusEcosystemTest is Test {
    NexusIdentityRegistry public identityRegistry;
    NexusReputationRegistry public reputationRegistry;
    MockAUSD public ausdToken;
    NexusEscrowVault public escrowVault;

    address public deployer = address(0x1);
    address public clientUser = address(0x2);
    address public workerOperator = address(0x3);
    address public evaluatorOperator = address(0x4);

    uint256 public workerAgentId;
    uint256 public evaluatorAgentId;

    bytes32 public sampleTaskHash = keccak256("TASK_MONAD_DEX_AUDIT_001");
    bytes32 public sampleOutputHash = keccak256("OUTPUT_ANALYSIS_DATA_V1");
    bytes32 public sampleRevisedOutputHash = keccak256("OUTPUT_ANALYSIS_DATA_V2");

    function setUp() public {
        vm.startPrank(deployer);

        // 1. Deploy core registries and stablecoin
        identityRegistry = new NexusIdentityRegistry();
        reputationRegistry = new NexusReputationRegistry();
        ausdToken = new MockAUSD();

        // 2. Deploy Escrow Vault
        escrowVault = new NexusEscrowVault(
            address(ausdToken),
            address(identityRegistry),
            address(reputationRegistry)
        );

        // 3. Authorize Escrow Vault on Reputation Registry
        reputationRegistry.setAuthorizedCaller(address(escrowVault), true);

        // 4. Register Worker Agent (Nansen Intel & Audit)
        string[] memory workerCaps = new string[](2);
        workerCaps[0] = "nansen_query";
        workerCaps[1] = "bytecode_audit";
        workerAgentId = identityRegistry.register(
            "ipfs://QmWorkerAgentCardHash",
            workerOperator,
            workerCaps
        );

        // 5. Register Evaluator Agent
        string[] memory evalCaps = new string[](1);
        evalCaps[0] = "evaluator_critic";
        evaluatorAgentId = identityRegistry.register(
            "ipfs://QmEvaluatorAgentCardHash",
            evaluatorOperator,
            evalCaps
        );

        // 6. Fund Client with Agora AUSD for tasks
        ausdToken.mint(clientUser, 10_000 * 10**18);

        vm.stopPrank();
    }

    function test_AgentRegistrationAndDiscovery() public view {
        // Verify Worker
        (address owner, address operator, string memory uri, bool active) = identityRegistry.getAgent(workerAgentId);
        assertEq(owner, deployer);
        assertEq(operator, workerOperator);
        assertEq(uri, "ipfs://QmWorkerAgentCardHash");
        assertTrue(active);

        // Verify Capability lookup
        uint256[] memory nansenAgents = identityRegistry.getAgentsByCapability("nansen_query");
        assertEq(nansenAgents.length, 1);
        assertEq(nansenAgents[0], workerAgentId);

        // Verify Default Baseline Reputation
        (uint256 score, uint256 totalTasks, , ) = reputationRegistry.getReputationSummary(workerAgentId);
        assertEq(score, 75); // Standard baseline
        assertEq(totalTasks, 0);
    }

    function test_EndToEndClosedLoopWorkflow() public {
        uint256 bounty = 50 * 10**18; // 50 AUSD

        // Step 1: Client deposits AUSD into Escrow
        vm.startPrank(clientUser);
        ausdToken.approve(address(escrowVault), bounty);
        escrowVault.createTaskEscrow(
            sampleTaskHash,
            workerAgentId,
            evaluatorAgentId,
            bounty,
            3600 // 1 hour deadline
        );
        vm.stopPrank();

        // Verify escrow locked
        assertEq(ausdToken.balanceOf(address(escrowVault)), bounty);

        // Step 2: Worker submits preliminary draft
        vm.startPrank(workerOperator);
        escrowVault.submitWork(sampleTaskHash, sampleOutputHash, "ipfs://QmProofV1");
        vm.stopPrank();

        // Step 3: Evaluator critiques and rejects preliminary draft (The Open Agent Revision Loop!)
        vm.startPrank(evaluatorOperator);
        escrowVault.requestRevision(sampleTaskHash, "Missing tick-depth liquidity evidence; recalculate slippage");
        vm.stopPrank();

        // Verify task state is RevisionRequested
        (, , , , , uint8 revCount, NexusEscrowVault.TaskStatus status, , , ) = escrowVault.tasks(sampleTaskHash);
        assertEq(uint8(status), uint8(NexusEscrowVault.TaskStatus.RevisionRequested));
        assertEq(revCount, 1);

        // Step 4: Worker Agent reruns with deeper parameters and resubmits
        vm.startPrank(workerOperator);
        escrowVault.submitWork(sampleTaskHash, sampleRevisedOutputHash, "ipfs://QmProofV2WithTickDepth");
        vm.stopPrank();

        // Step 5: Evaluator Agent reviews revised draft and approves
        vm.startPrank(evaluatorOperator);
        escrowVault.completeAndRelease(sampleTaskHash, 95, "Comprehensive evidence provided with verified Monad tick hashes");
        vm.stopPrank();

        // Verify worker received AUSD bounty
        assertEq(ausdToken.balanceOf(workerOperator), bounty);
        assertEq(ausdToken.balanceOf(address(escrowVault)), 0);

        // Verify Worker reputation increased
        (uint256 newScore, uint256 tasksCompleted, uint256 disputes, uint256 positives) = reputationRegistry.getReputationSummary(workerAgentId);
        assertEq(newScore, 78); // Baseline 75 + 3 points
        assertEq(tasksCompleted, 1);
        assertEq(positives, 1);
        assertEq(disputes, 0);
    }

    function test_DisputeAndSlashWorkflow() public {
        bytes32 fraudTaskHash = keccak256("TASK_FRAUDULENT_001");
        uint256 bounty = 100 * 10**18;

        // 1. Client creates escrow
        vm.startPrank(clientUser);
        ausdToken.approve(address(escrowVault), bounty);
        escrowVault.createTaskEscrow(
            fraudTaskHash,
            workerAgentId,
            evaluatorAgentId,
            bounty,
            3600
        );
        vm.stopPrank();

        // 2. Worker submits hallucinated/fake work
        vm.startPrank(workerOperator);
        escrowVault.submitWork(fraudTaskHash, keccak256("FAKE_DATA"), "ipfs://QmFake");
        vm.stopPrank();

        // 3. Evaluator catches fraud and triggers dispute & slash
        vm.startPrank(evaluatorOperator);
        escrowVault.disputeAndSlash(fraudTaskHash, "Demonstrably fabricated onchain balance numbers");
        vm.stopPrank();

        // 4. Verify client received full refund
        assertEq(ausdToken.balanceOf(clientUser), 10_000 * 10**18);
        assertEq(ausdToken.balanceOf(workerOperator), 0);

        // 5. Verify worker reputation slashed
        (uint256 slashedScore, , uint256 disputes, ) = reputationRegistry.getReputationSummary(workerAgentId);
        assertEq(slashedScore, 50); // Baseline 75 - 25 points penalty
        assertEq(disputes, 1);
    }

    function test_ProtocolFeeDeduction() public {
        bytes32 feeTaskHash = keccak256("TASK_FEE_TEST");
        uint256 bounty = 100 * 10**18;
        address treasuryAddr = address(0x99);

        // Deployer enables 100 bps (1%) protocol fee
        vm.startPrank(deployer);
        escrowVault.setProtocolFee(100, treasuryAddr);
        vm.stopPrank();

        // Client creates escrow
        vm.startPrank(clientUser);
        ausdToken.approve(address(escrowVault), bounty);
        escrowVault.createTaskEscrow(feeTaskHash, workerAgentId, evaluatorAgentId, bounty, 3600);
        vm.stopPrank();

        // Worker submits
        vm.startPrank(workerOperator);
        escrowVault.submitWork(feeTaskHash, sampleOutputHash, "ipfs://QmProof");
        vm.stopPrank();

        // Evaluator approves
        vm.startPrank(evaluatorOperator);
        escrowVault.completeAndRelease(feeTaskHash, 90, "Good work");
        vm.stopPrank();

        // 1% of 100 AUSD is 1 AUSD to treasury, 99 AUSD to worker
        assertEq(ausdToken.balanceOf(treasuryAddr), 1 * 10**18);
        assertEq(ausdToken.balanceOf(workerOperator), 99 * 10**18);
    }

    function test_EmergencyPauseWorkflow() public {
        bytes32 pauseTaskHash = keccak256("TASK_PAUSE_TEST");

        vm.startPrank(deployer);
        escrowVault.pause();
        vm.stopPrank();

        vm.startPrank(clientUser);
        ausdToken.approve(address(escrowVault), 50 * 10**18);
        vm.expectRevert();
        escrowVault.createTaskEscrow(pauseTaskHash, workerAgentId, evaluatorAgentId, 50 * 10**18, 3600);
        vm.stopPrank();

        // Unpause and verify success
        vm.startPrank(deployer);
        escrowVault.unpause();
        vm.stopPrank();

        vm.startPrank(clientUser);
        escrowVault.createTaskEscrow(pauseTaskHash, workerAgentId, evaluatorAgentId, 50 * 10**18, 3600);
        vm.stopPrank();
    }
}
