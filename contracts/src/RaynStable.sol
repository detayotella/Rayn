// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RaynStable
 * @author Rayn Team
 * @notice A simple ERC-20 stablecoin for development and testnet environments
 * @dev This token is ONLY for testing purposes. In production, Rayn will integrate
 *      with real stablecoins like USDC, USDT, or DAI.
 *
 * HOW IT WORKS:
 * - Uses 6 decimals to simulate real stablecoins like USDC
 * - Only the owner can mint new tokens (acts as a faucet for testing)
 * - Implements standard ERC-20 functionality for transfers and approvals
 * - Can be used in local development, testnets, or staging environments
 *
 * SECURITY NOTE:
 * This is NOT suitable for production mainnet deployment. It exists solely
 * to provide a controlled testing environment for Rayn's core features.
 */
contract RaynStable is ERC20, Ownable {
    /// @notice Number of decimals for the token (matches USDC standard)
    uint8 private constant DECIMALS = 6;

    /**
     * @notice Emitted when the owner mints new tokens
     * @param to The address receiving the minted tokens
     * @param amount The amount of tokens minted (in smallest units)
     */
    event TokensMinted(address indexed to, uint256 amount);

    /**
     * @notice Initializes the RaynStable token
     * @dev Sets the token name and symbol, and transfers ownership to deployer
     */
    constructor() ERC20("Rayn Stable", "RAYNS") Ownable(msg.sender) {
        // Contract is ready to use - owner can mint tokens as needed
    }

    /**
     * @notice Returns the number of decimals used by the token
     * @dev Overrides the default 18 decimals to match USDC's 6 decimals
     * @return The number of decimals (6)
     */
    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }

    /**
     * @notice Mints new tokens to a specified address
     * @dev Only callable by the contract owner. Acts as a faucet for testing.
     * @param to The address that will receive the newly minted tokens
     * @param amount The amount of tokens to mint (in smallest units, e.g., 1000000 = 1 RAYNS)
     *
     * USAGE EXAMPLE:
     * To mint 100 RAYNS tokens, call: mint(userAddress, 100_000_000)
     * because 100 * 10^6 = 100_000_000 (accounting for 6 decimals)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "RaynStable: cannot mint to zero address");
        require(amount > 0, "RaynStable: amount must be greater than zero");

        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /**
     * @notice Allows the owner to mint tokens directly to their own address
     * @dev Convenience function for quick testing. Calls mint() internally.
     * @param amount The amount of tokens to mint to the owner's address
     */
    function mintToSelf(uint256 amount) external onlyOwner {
        _mint(msg.sender, amount);
        emit TokensMinted(msg.sender, amount);
    }
}
