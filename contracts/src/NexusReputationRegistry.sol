// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IERC8004.sol";

/**
 * @title NexusReputationRegistry
 * @notice ERC-8004 compliant Reputation & Validation Registry on Monad.
 *         Maintains dynamic composite scoring (0-100), task completion logs,
 *         and slashing enforcement for autonomous AI agents.
 */
contract NexusReputationRegistry is Ownable, IERC8004ReputationRegistry, IERC8004ValidationRegistry {
    struct Reputation {
        uint256 compositeScore;     // 0 to 100 (Default: 75)
        uint256 totalTasks;
        uint256 positiveFeedbacks;
        uint256 disputes;
        uint256 totalSlashedPoints;
        bool initialized;
    }

    struct FeedbackRecord {
        address client;
        uint8 rating;
        bytes32 taskHash;
        string comment;
        uint256 timestamp;
    }

    struct ValidationRecord {
        uint256 agentId;
        address validator;
        uint8 verdict; // 0 = Pending, 1 = Approved, 2 = Revision, 3 = Slashed
        bytes32 proofHash;
        uint256 timestamp;
    }

    // agentId => Reputation
    mapping(uint256 => Reputation) private _reputations;

    // agentId => array of FeedbackRecord
    mapping(uint256 => FeedbackRecord[]) private _feedbackHistory;

    // taskHash => ValidationRecord
    mapping(bytes32 => ValidationRecord) public validations;

    // Authorized callers (e.g., NexusEscrowVault contracts)
    mapping(address => bool) public authorizedCallers;

    event CallerAuthorizationUpdated(address indexed caller, bool authorized);

    modifier onlyAuthorized() {
        require(authorizedCallers[msg.sender] || msg.sender == owner(), "Caller not authorized");
        _;
    }

    constructor() Ownable(msg.sender) {
        authorizedCallers[msg.sender] = true;
    }

    function setAuthorizedCaller(address caller, bool authorized) external onlyOwner {
        authorizedCallers[caller] = authorized;
        emit CallerAuthorizationUpdated(caller, authorized);
    }

    /**
     * @notice Initializes default baseline reputation for a newly registered agent
     */
    function initializeAgent(uint256 agentId) external {
        if (!_reputations[agentId].initialized) {
            _reputations[agentId] = Reputation({
                compositeScore: 75, // Baseline score
                totalTasks: 0,
                positiveFeedbacks: 0,
                disputes: 0,
                totalSlashedPoints: 0,
                initialized: true
            });
        }
    }

    /**
     * @notice Submits verified performance feedback for an agent after task delivery
     */
    function submitFeedback(
        uint256 agentId,
        uint8 rating,
        bytes32 taskHash,
        string calldata comment
    ) external override onlyAuthorized {
        require(rating <= 100, "Rating must be 0-100");

        Reputation storage rep = _reputations[agentId];
        if (!rep.initialized) {
            rep.compositeScore = 75;
            rep.initialized = true;
        }

        rep.totalTasks += 1;
        if (rating >= 70) {
            rep.positiveFeedbacks += 1;
            // Incremental reward up to 100
            if (rep.compositeScore < 100) {
                rep.compositeScore = rep.compositeScore + 3 > 100 ? 100 : rep.compositeScore + 3;
            }
        } else {
            // Negative rating penalty
            uint256 penalty = (100 - rating) / 10;
            rep.compositeScore = rep.compositeScore > penalty ? rep.compositeScore - penalty : 10;
        }

        _feedbackHistory[agentId].push(FeedbackRecord({
            client: msg.sender,
            rating: rating,
            taskHash: taskHash,
            comment: comment,
            timestamp: block.timestamp
        }));

        emit FeedbackSubmitted(agentId, msg.sender, rating, taskHash, comment);
    }

    /**
     * @notice Slashes an agent's reputation for fraudulent, hallucinated, or malicious output
     */
    function slashAgent(
        uint256 agentId,
        uint256 penaltyPoints,
        bytes32 /* taskHash */,
        string calldata reason
    ) external override onlyAuthorized {
        Reputation storage rep = _reputations[agentId];
        if (!rep.initialized) {
            rep.compositeScore = 75;
            rep.initialized = true;
        }

        rep.disputes += 1;
        rep.totalSlashedPoints += penaltyPoints;

        if (rep.compositeScore > penaltyPoints) {
            rep.compositeScore -= penaltyPoints;
        } else {
            rep.compositeScore = 5; // Minimum floor score
        }

        emit AgentSlashed(agentId, msg.sender, penaltyPoints, reason);
    }

    /**
     * @notice Requests formal validation of an agent's task work
     */
    function requestValidation(
        bytes32 taskHash,
        uint256 agentId,
        address validator,
        string calldata /* taskURI */
    ) external override onlyAuthorized {
        validations[taskHash] = ValidationRecord({
            agentId: agentId,
            validator: validator,
            verdict: 0,
            proofHash: bytes32(0),
            timestamp: block.timestamp
        });

        emit ValidationRequested(taskHash, agentId, validator);
    }

    /**
     * @notice Records validation verdict from an Evaluator Agent
     */
    function submitValidationVerdict(
        bytes32 taskHash,
        uint8 verdict,
        bytes32 proofHash
    ) external override onlyAuthorized {
        ValidationRecord storage record = validations[taskHash];
        record.verdict = verdict;
        record.proofHash = proofHash;

        emit ValidationCompleted(taskHash, record.agentId, verdict, proofHash);
    }

    /**
     * @notice Returns composite reputation summary for an agent
     */
    function getReputationSummary(uint256 agentId) external view override returns (
        uint256 compositeScore,
        uint256 totalTasksCompleted,
        uint256 totalDisputes,
        uint256 positiveFeedbacks
    ) {
        Reputation storage rep = _reputations[agentId];
        if (!rep.initialized) {
            return (75, 0, 0, 0); // Default baseline
        }
        return (
            rep.compositeScore,
            rep.totalTasks,
            rep.disputes,
            rep.positiveFeedbacks
        );
    }

    /**
     * @notice Returns total number of feedback records for an agent
     */
    function getFeedbackCount(uint256 agentId) external view returns (uint256) {
        return _feedbackHistory[agentId].length;
    }

    /**
     * @notice Returns a specific feedback record
     */
    function getFeedback(uint256 agentId, uint256 index) external view returns (
        address client,
        uint8 rating,
        bytes32 taskHash,
        string memory comment,
        uint256 timestamp
    ) {
        FeedbackRecord storage r = _feedbackHistory[agentId][index];
        return (r.client, r.rating, r.taskHash, r.comment, r.timestamp);
    }
}
