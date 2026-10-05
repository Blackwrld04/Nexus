// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./NexusIdentityRegistry.sol";
import "./NexusReputationRegistry.sol";

/**
 * @title NexusEscrowVault
 * @notice Machine-to-machine micro-escrow vault on Monad settled in Agora AUSD.
 *         Implements the Planner ↔ Worker ↔ Evaluator closed-loop with onchain
 *         evidence gating, revision requests, timeout refunds, and reputation slashing.
 */
contract NexusEscrowVault is ReentrancyGuard, Pausable, Ownable {
    using SafeERC20 for IERC20;

    enum TaskStatus {
        Created,            // Bounty locked, awaiting worker output
        Submitted,          // Worker submitted draft output hash
        RevisionRequested,  // Evaluator rejected draft, revision needed
        Completed,          // Evaluator approved, bounty released, reputation boosted
        DisputedAndSlashed, // Fraudulent/hallucinated, refunded to client, worker slashed
        RefundedTimeout     // Worker timed out, client refunded
    }

    struct TaskEscrow {
        address client;
        uint256 workerAgentId;
        uint256 evaluatorAgentId;
        uint256 bountyAUSD;
        uint256 deadline;
        uint8 revisionCount;
        TaskStatus status;
        bytes32 outputHash;
        string proofURI;
        uint256 createdAt;
    }

    IERC20 public immutable ausdToken;
    NexusIdentityRegistry public immutable identityRegistry;
    NexusReputationRegistry public immutable reputationRegistry;

    uint8 public constant MAX_REVISIONS = 2;

    // Protocol Fee Configuration (max 2.5% = 250 bps)
    address public treasury;
    uint256 public protocolFeeBps = 0; // configurable fee, default 0
    uint256 public constant MAX_FEE_BPS = 250;

    // taskHash => TaskEscrow
    mapping(bytes32 => TaskEscrow) public tasks;

    event TaskCreated(bytes32 indexed taskHash, address indexed client, uint256 workerAgentId, uint256 evaluatorAgentId, uint256 bounty);
    event WorkSubmitted(bytes32 indexed taskHash, bytes32 outputHash, string proofURI);
    event RevisionRequested(bytes32 indexed taskHash, uint8 revisionCount, string reason);
    event TaskCompleted(bytes32 indexed taskHash, address indexed workerOperator, uint256 payout);
    event TaskDisputedAndSlashed(bytes32 indexed taskHash, uint256 indexed workerAgentId, string reason);
    event TaskRefunded(bytes32 indexed taskHash, address indexed client, uint256 refundAmount);
    event ProtocolFeeUpdated(uint256 newFeeBps, address newTreasury);

    constructor(
        address _ausdToken,
        address _identityRegistry,
        address _reputationRegistry
    ) Ownable(msg.sender) {
        require(_ausdToken != address(0) && _identityRegistry != address(0) && _reputationRegistry != address(0), "Invalid address");
        ausdToken = IERC20(_ausdToken);
        identityRegistry = NexusIdentityRegistry(_identityRegistry);
        reputationRegistry = NexusReputationRegistry(_reputationRegistry);
        treasury = msg.sender;
    }

    /**
     * @notice Locks Agora AUSD bounty into escrow for a specialized worker task
     */
    function createTaskEscrow(
        bytes32 taskHash,
        uint256 workerAgentId,
        uint256 evaluatorAgentId,
        uint256 bountyAUSD,
        uint256 durationSeconds
    ) external nonReentrant whenNotPaused {
        require(tasks[taskHash].createdAt == 0, "Task already exists");
        require(bountyAUSD > 0, "Bounty must be > 0");

        (, address workerOperator, , bool workerActive) = identityRegistry.getAgent(workerAgentId);
        (, address evaluatorOperator, , bool evalActive) = identityRegistry.getAgent(evaluatorAgentId);
        require(workerActive && evalActive, "Agents must be active");
        require(workerOperator != address(0) && evaluatorOperator != address(0), "Invalid agent operator");

        // Pull AUSD from client
        ausdToken.safeTransferFrom(msg.sender, address(this), bountyAUSD);

        tasks[taskHash] = TaskEscrow({
            client: msg.sender,
            workerAgentId: workerAgentId,
            evaluatorAgentId: evaluatorAgentId,
            bountyAUSD: bountyAUSD,
            deadline: block.timestamp + durationSeconds,
            revisionCount: 0,
            status: TaskStatus.Created,
            outputHash: bytes32(0),
            proofURI: "",
            createdAt: block.timestamp
        });

        emit TaskCreated(taskHash, msg.sender, workerAgentId, evaluatorAgentId, bountyAUSD);

        // Request validation hook in ERC-8004 registry
        reputationRegistry.requestValidation(taskHash, workerAgentId, evaluatorOperator, "");
    }

    /**
     * @notice Worker Agent submits task execution output and cryptographic evidence
     */
    function submitWork(
        bytes32 taskHash,
        bytes32 outputHash,
        string calldata proofURI
    ) external nonReentrant {
        TaskEscrow storage task = tasks[taskHash];
        require(task.status == TaskStatus.Created || task.status == TaskStatus.RevisionRequested, "Invalid task status");
        require(block.timestamp <= task.deadline, "Task deadline expired");

        (, address workerOperator, , ) = identityRegistry.getAgent(task.workerAgentId);
        require(msg.sender == workerOperator, "Caller is not worker operator");

        task.outputHash = outputHash;
        task.proofURI = proofURI;
        task.status = TaskStatus.Submitted;

        emit WorkSubmitted(taskHash, outputHash, proofURI);
    }

    /**
     * @notice Evaluator Agent flags gaps, inaccuracies, or missing evidence and demands revision
     */
    function requestRevision(
        bytes32 taskHash,
        string calldata critiqueReason
    ) external nonReentrant {
        TaskEscrow storage task = tasks[taskHash];
        require(task.status == TaskStatus.Submitted, "Task must be in Submitted state");

        (, address evaluatorOperator, , ) = identityRegistry.getAgent(task.evaluatorAgentId);
        require(msg.sender == evaluatorOperator || msg.sender == task.client, "Caller is not evaluator");

        require(task.revisionCount < MAX_REVISIONS, "Max revisions exceeded, must dispute or complete");
        task.revisionCount += 1;
        task.status = TaskStatus.RevisionRequested;

        emit RevisionRequested(taskHash, task.revisionCount, critiqueReason);
    }

    /**
     * @notice Evaluator Agent approves verified output; releases AUSD and boosts reputation
     */
    function completeAndRelease(
        bytes32 taskHash,
        uint8 rating,
        string calldata feedbackComment
    ) external nonReentrant {
        TaskEscrow storage task = tasks[taskHash];
        require(task.status == TaskStatus.Submitted, "Task must be in Submitted state");

        (, address evaluatorOperator, , ) = identityRegistry.getAgent(task.evaluatorAgentId);
        require(msg.sender == evaluatorOperator || msg.sender == task.client, "Caller is not evaluator");
        require(rating >= 70, "Approval requires rating >= 70");

        task.status = TaskStatus.Completed;

        (, address workerOperator, , ) = identityRegistry.getAgent(task.workerAgentId);

        uint256 fee = (task.bountyAUSD * protocolFeeBps) / 10000;
        uint256 workerPayout = task.bountyAUSD - fee;

        emit TaskCompleted(taskHash, workerOperator, workerPayout);

        // Distribute protocol fee to treasury and payout to worker
        if (fee > 0 && treasury != address(0)) {
            ausdToken.safeTransfer(treasury, fee);
        }
        ausdToken.safeTransfer(workerOperator, workerPayout);

        // Record positive feedback & validation in ERC-8004 registry
        reputationRegistry.submitFeedback(task.workerAgentId, rating, taskHash, feedbackComment);
        reputationRegistry.submitValidationVerdict(taskHash, 1, task.outputHash);
    }

    /**
     * @notice Evaluator or Client disputes fraudulent task, refunds AUSD, and slashes agent
     */
    function disputeAndSlash(
        bytes32 taskHash,
        string calldata slashReason
    ) external nonReentrant {
        TaskEscrow storage task = tasks[taskHash];
        require(
            task.status == TaskStatus.Submitted || 
            task.status == TaskStatus.RevisionRequested ||
            (task.status == TaskStatus.Created && block.timestamp > task.deadline),
            "Cannot dispute in current state"
        );

        (, address evaluatorOperator, , ) = identityRegistry.getAgent(task.evaluatorAgentId);
        require(msg.sender == evaluatorOperator || msg.sender == task.client, "Caller is not evaluator/client");

        task.status = TaskStatus.DisputedAndSlashed;

        emit TaskDisputedAndSlashed(taskHash, task.workerAgentId, slashReason);

        // Refund AUSD to client
        ausdToken.safeTransfer(task.client, task.bountyAUSD);

        // Slash worker reputation
        reputationRegistry.slashAgent(task.workerAgentId, 25, taskHash, slashReason);
        reputationRegistry.submitValidationVerdict(taskHash, 3, task.outputHash);
    }

    /**
     * @notice Client can reclaim locked funds if worker fails to submit anything by deadline
     */
    function claimTimeoutRefund(bytes32 taskHash) external nonReentrant {
        TaskEscrow storage task = tasks[taskHash];
        require(task.status == TaskStatus.Created || task.status == TaskStatus.RevisionRequested, "Cannot refund");
        require(block.timestamp > task.deadline, "Deadline has not expired");
        require(msg.sender == task.client, "Only client can claim timeout refund");

        task.status = TaskStatus.RefundedTimeout;
        ausdToken.safeTransfer(task.client, task.bountyAUSD);

        emit TaskRefunded(taskHash, task.client, task.bountyAUSD);
    }

    /**
     * @notice Read task details
     */
    function getTask(bytes32 taskHash) external view returns (TaskEscrow memory) {
        return tasks[taskHash];
    }

    /**
     * @notice Updates the protocol fee and treasury destination
     */
    function setProtocolFee(uint256 _feeBps, address _treasury) external onlyOwner {
        require(_feeBps <= MAX_FEE_BPS, "Fee exceeds maximum");
        if (_feeBps > 0) {
            require(_treasury != address(0), "Invalid treasury address");
        }
        protocolFeeBps = _feeBps;
        treasury = _treasury;
        emit ProtocolFeeUpdated(_feeBps, _treasury);
    }

    /**
     * @notice Emergency circuit breaker pause
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause protocol execution
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Rescues tokens mistakenly sent to this contract
     */
    function emergencyRescueTokens(address token, address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Cannot send to zero address");
        IERC20(token).safeTransfer(to, amount);
    }
}
