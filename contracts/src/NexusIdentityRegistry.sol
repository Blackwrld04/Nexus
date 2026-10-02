// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IERC8004.sol";

/**
 * @title NexusIdentityRegistry
 * @notice ERC-8004 compliant Identity Registry for autonomous AI agents on Monad.
 *         Mints an ERC-721 token per registered agent, storing capability tags,
 *         runtime operator addresses, and Agent Card URIs.
 */
contract NexusIdentityRegistry is ERC721URIStorage, Ownable, IERC8004IdentityRegistry {
    uint256 private _nextAgentId = 1;

    struct AgentProfile {
        address operator;
        string[] capabilities;
        bool active;
        uint256 registeredAt;
    }

    // agentId => AgentProfile
    mapping(uint256 => AgentProfile) private _agents;
    
    // operator address => agentId
    mapping(address => uint256) public operatorToAgentId;

    // capability tag hash => array of matching agentIds
    mapping(bytes32 => uint256[]) private _agentsByCapability;

    constructor() ERC721("Nexus AI Agent Passport", "NEXUS-AGENT") Ownable(msg.sender) {}

    /**
     * @notice Registers a new autonomous agent under ERC-8004 standard
     * @param agentURI Offchain IPFS or HTTPS metadata pointing to the Agent Card JSON
     * @param operator The wallet address used by the agent runtime for signing and transactions
     * @param capabilities Array of capability tags (e.g., ["nansen_query", "bytecode_audit"])
     */
    function register(
        string calldata agentURI,
        address operator,
        string[] calldata capabilities
    ) external override returns (uint256 agentId) {
        require(operator != address(0), "Invalid operator address");

        agentId = _nextAgentId++;
        _safeMint(msg.sender, agentId);
        _setTokenURI(agentId, agentURI);

        AgentProfile storage profile = _agents[agentId];
        profile.operator = operator;
        profile.active = true;
        profile.registeredAt = block.timestamp;

        for (uint256 i = 0; i < capabilities.length; i++) {
            profile.capabilities.push(capabilities[i]);
            bytes32 capHash = keccak256(abi.encodePacked(capabilities[i]));
            _agentsByCapability[capHash].push(agentId);
        }

        operatorToAgentId[operator] = agentId;

        emit AgentRegistered(agentId, msg.sender, agentURI);
        emit AgentOperatorUpdated(agentId, operator);
    }

    /**
     * @notice Returns core agent identity details
     */
    function getAgent(uint256 agentId) external view override returns (
        address owner,
        address operator,
        string memory agentURI,
        bool active
    ) {
        owner = ownerOf(agentId);
        AgentProfile storage profile = _agents[agentId];
        return (owner, profile.operator, tokenURI(agentId), profile.active);
    }

    /**
     * @notice Updates the metadata URI for an existing agent
     */
    function setAgentURI(uint256 agentId, string calldata agentURI) external override {
        require(ownerOf(agentId) == msg.sender, "Caller is not agent owner");
        _setTokenURI(agentId, agentURI);
        emit AgentURIUpdated(agentId, agentURI);
    }

    /**
     * @notice Updates the runtime operator address for an agent
     */
    function setAgentOperator(uint256 agentId, address operator) external override {
        require(ownerOf(agentId) == msg.sender, "Caller is not agent owner");
        require(operator != address(0), "Invalid operator address");

        address oldOperator = _agents[agentId].operator;
        delete operatorToAgentId[oldOperator];

        _agents[agentId].operator = operator;
        operatorToAgentId[operator] = agentId;

        emit AgentOperatorUpdated(agentId, operator);
    }

    /**
     * @notice Sets the active status of an agent
     */
    function setActive(uint256 agentId, bool active) external {
        require(ownerOf(agentId) == msg.sender || msg.sender == owner(), "Unauthorized");
        _agents[agentId].active = active;
    }

    /**
     * @notice Returns all capability tags registered for an agent
     */
    function getCapabilities(uint256 agentId) external view override returns (string[] memory) {
        return _agents[agentId].capabilities;
    }

    /**
     * @notice Discover agent IDs matching a specific capability tag
     */
    function getAgentsByCapability(string calldata capability) external view returns (uint256[] memory) {
        bytes32 capHash = keccak256(abi.encodePacked(capability));
        return _agentsByCapability[capHash];
    }

    /**
     * @notice Returns the total number of registered agents
     */
    function totalAgents() external view returns (uint256) {
        return _nextAgentId - 1;
    }
}
