// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IERC8004 - Trustless Agents Standard Interfaces
 * @notice Formalizes the EIP-8004 specification for onchain AI agent discovery,
 *         reputation tracking, and validation hooks.
 */

interface IERC8004IdentityRegistry {
    event AgentRegistered(uint256 indexed agentId, address indexed owner, string agentURI);
    event AgentURIUpdated(uint256 indexed agentId, string newURI);
    event AgentOperatorUpdated(uint256 indexed agentId, address indexed operator);

    function register(string calldata agentURI, address operator, string[] calldata capabilities) external returns (uint256 agentId);
    function getAgent(uint256 agentId) external view returns (address owner, address operator, string memory agentURI, bool active);
    function setAgentURI(uint256 agentId, string calldata agentURI) external;
    function setAgentOperator(uint256 agentId, address operator) external;
    function getCapabilities(uint256 agentId) external view returns (string[] memory);
}

interface IERC8004ReputationRegistry {
    event FeedbackSubmitted(
        uint256 indexed agentId,
        address indexed client,
        uint8 rating, // 0 to 100
        bytes32 indexed taskHash,
        string comment
    );
    event AgentSlashed(uint256 indexed agentId, address indexed slasher, uint256 penaltyPoints, string reason);

    function submitFeedback(
        uint256 agentId,
        uint8 rating,
        bytes32 taskHash,
        string calldata comment
    ) external;

    function slashAgent(
        uint256 agentId,
        uint256 penaltyPoints,
        bytes32 taskHash,
        string calldata reason
    ) external;

    function getReputationSummary(uint256 agentId) external view returns (
        uint256 compositeScore,
        uint256 totalTasksCompleted,
        uint256 totalDisputes,
        uint256 positiveFeedbacks
    );
}

interface IERC8004ValidationRegistry {
    event ValidationRequested(bytes32 indexed taskHash, uint256 indexed agentId, address indexed validator);
    event ValidationCompleted(bytes32 indexed taskHash, uint256 indexed agentId, uint8 verdict, bytes32 proofHash);

    function requestValidation(
        bytes32 taskHash,
        uint256 agentId,
        address validator,
        string calldata taskURI
    ) external;

    function submitValidationVerdict(
        bytes32 taskHash,
        uint8 verdict, // 1 = Approved, 2 = Rejected / Needs Revision, 3 = Fraudulent / Slash
        bytes32 proofHash
    ) external;
}
