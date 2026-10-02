// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockAUSD
 * @notice Mock Agora USD (AUSD) stablecoin on Monad Testnet for agent escrow settlements.
 *         Includes a public testnet faucet for 1-click test token minting.
 */
contract MockAUSD is ERC20, Ownable {
    uint8 private constant _DECIMALS = 18;
    uint256 public constant FAUCET_LIMIT = 5000 * 10**_DECIMALS; // 5,000 AUSD per faucet call

    event FaucetMinted(address indexed recipient, uint256 amount);

    constructor() ERC20("Agora USD", "AUSD") Ownable(msg.sender) {
        // Mint initial 1,000,000 AUSD to deployer for liquidity & swarm funding
        _mint(msg.sender, 1_000_000 * 10**_DECIMALS);
    }

    /**
     * @notice Public testnet faucet enabling judges and builders to mint test AUSD
     */
    function faucetMint(address to, uint256 amount) external {
        require(amount <= FAUCET_LIMIT, "Exceeds max faucet limit of 5,000 AUSD");
        _mint(to, amount);
        emit FaucetMinted(to, amount);
    }

    /**
     * @notice Admin mint for custom protocol setup
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
