// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/IERC8004.sol";
import "../src/NexusIdentityRegistry.sol";
import "../src/NexusReputationRegistry.sol";
import "../src/MockAUSD.sol";
import "../src/NexusEscrowVault.sol";

contract DeployNexus is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envOr(
            "PRIVATE_KEY",
            uint256(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80) // Anvil default key fallback
        );

        address deployer = vm.addr(deployerPrivateKey);
        console.log("Deploying Nexus Ecosystem from:", deployer);

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy Agora AUSD Mock
        MockAUSD ausd = new MockAUSD();
        console.log("MockAUSD deployed at:", address(ausd));

        // 2. Deploy ERC-8004 Registries
        NexusIdentityRegistry identityRegistry = new NexusIdentityRegistry();
        console.log("NexusIdentityRegistry deployed at:", address(identityRegistry));

        NexusReputationRegistry reputationRegistry = new NexusReputationRegistry();
        console.log("NexusReputationRegistry deployed at:", address(reputationRegistry));

        // 3. Deploy Escrow Vault
        NexusEscrowVault escrowVault = new NexusEscrowVault(
            address(ausd),
            address(identityRegistry),
            address(reputationRegistry)
        );
        console.log("NexusEscrowVault deployed at:", address(escrowVault));

        // 4. Authorize Escrow Vault on Reputation Registry
        reputationRegistry.setAuthorizedCaller(address(escrowVault), true);

        // 5. Register Default Specialist Agents under ERC-8004
        string[] memory nansenCaps = new string[](2);
        nansenCaps[0] = "nansen_query";
        nansenCaps[1] = "wallet_profiling";
        uint256 nansenAgentId = identityRegistry.register(
            "https://raw.githubusercontent.com/monad-nexus/metadata/main/agents/nansen-alpha.json",
            deployer,
            nansenCaps
        );
        console.log("Registered Nansen Alpha Agent with ID:", nansenAgentId);

        string[] memory auditorCaps = new string[](2);
        auditorCaps[0] = "bytecode_audit";
        auditorCaps[1] = "reentrancy_scan";
        uint256 auditorAgentId = identityRegistry.register(
            "https://raw.githubusercontent.com/monad-nexus/metadata/main/agents/security-auditor.json",
            deployer,
            auditorCaps
        );
        console.log("Registered Security Auditor Agent with ID:", auditorAgentId);

        string[] memory evalCaps = new string[](2);
        evalCaps[0] = "evaluator_critic";
        evalCaps[1] = "evidence_validator";
        uint256 evalAgentId = identityRegistry.register(
            "https://raw.githubusercontent.com/monad-nexus/metadata/main/agents/evaluator-gatekeeper.json",
            deployer,
            evalCaps
        );
        console.log("Registered Evaluator Gatekeeper Agent with ID:", evalAgentId);

        vm.stopBroadcast();

        console.log("\n========================================================");
        console.log("NEXUS DEPLOYMENT COMPLETE ON MONAD TESTNET");
        console.log("========================================================");
    }
}
