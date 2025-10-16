// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {GiveawayDistributor} from "../src/GiveawayDistributor.sol";

/**
 * @title DeployGiveawayDistributor
 * @author Rayn Team
 * @notice Foundry script to deploy the GiveawayDistributor contract
 * @dev Run with: forge script script/DeployGiveawayDistributor.s.sol:DeployGiveawayDistributor --rpc-url <RPC_URL> --broadcast --verify
 *
 * USAGE EXAMPLES:
 *
 * 1. Dry run (simulation only):
 *    forge script script/DeployGiveawayDistributor.s.sol:DeployGiveawayDistributor --rpc-url $RPC_URL
 *
 * 2. Deploy to testnet:
 *    forge script script/DeployGiveawayDistributor.s.sol:DeployGiveawayDistributor --rpc-url $RPC_URL --broadcast --verify
 *
 * 3. Deploy locally (Anvil):
 *    forge script script/DeployGiveawayDistributor.s.sol:DeployGiveawayDistributor --rpc-url http://localhost:8545 --broadcast
 *
 * ENVIRONMENT VARIABLES:
 * - PRIVATE_KEY: Deployer's private key
 * - RPC_URL: Network RPC endpoint
 * - ETHERSCAN_API_KEY: For contract verification (optional)
 */
contract DeployGiveawayDistributor is Script {
    /// @notice Main deployment function
    /// @return distributor The deployed GiveawayDistributor contract
    function run() external returns (GiveawayDistributor distributor) {
        // Get deployer's private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy GiveawayDistributor
        distributor = new GiveawayDistributor();

        console.log("========================================");
        console.log("GiveawayDistributor Deployed!");
        console.log("========================================");
        console.log("Contract Address:", address(distributor));
        console.log("Deployer (Owner):", msg.sender);
        console.log("========================================");

        // Stop broadcasting
        vm.stopBroadcast();

        // Log deployment details for frontend integration
        console.log("\nFrontend Integration:");
        console.log("Add this to your .env file:");
        console.log("VITE_GIVEAWAY_DISTRIBUTOR_ADDRESS=%s", address(distributor));

        return distributor;
    }
}
