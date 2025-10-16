// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {UsernameRegistry} from "../src/UsernameRegistry.sol";

/**
 * @title DeployUsernameRegistry
 * @author Rayn Team
 * @notice Foundry script to deploy the UsernameRegistry contract
 * @dev Run with: forge script script/DeployUsernameRegistry.s.sol:DeployUsernameRegistry --rpc-url <RPC_URL> --broadcast --verify
 *
 * USAGE EXAMPLES:
 *
 * 1. Dry run (simulation only):
 *    forge script script/DeployUsernameRegistry.s.sol:DeployUsernameRegistry --rpc-url $RPC_URL
 *
 * 2. Deploy to testnet:
 *    forge script script/DeployUsernameRegistry.s.sol:DeployUsernameRegistry --rpc-url $RPC_URL --broadcast --verify
 *
 * 3. Deploy locally (Anvil):
 *    forge script script/DeployUsernameRegistry.s.sol:DeployUsernameRegistry --rpc-url http://localhost:8545 --broadcast
 *
 * ENVIRONMENT VARIABLES:
 * - PRIVATE_KEY: Deployer's private key
 * - RPC_URL: Network RPC endpoint
 * - ETHERSCAN_API_KEY: For contract verification (optional)
 */
contract DeployUsernameRegistry is Script {
    /// @notice Main deployment function
    /// @return registry The deployed UsernameRegistry contract
    function run() external returns (UsernameRegistry registry) {
        // Get deployer's private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy UsernameRegistry
        registry = new UsernameRegistry();

        console.log("========================================");
        console.log("UsernameRegistry Deployed!");
        console.log("========================================");
        console.log("Contract Address:", address(registry));
        console.log("Deployer (Owner):", msg.sender);
        console.log("========================================");

        // Stop broadcasting
        vm.stopBroadcast();

        // Log deployment details for frontend integration
        console.log("\nFrontend Integration:");
        console.log("Add this to your .env file:");
        console.log("VITE_USERNAME_REGISTRY_ADDRESS=%s", address(registry));

        return registry;
    }
}
