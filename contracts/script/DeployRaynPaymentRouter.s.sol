// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {RaynPaymentRouter} from "../src/RaynPaymentRouter.sol";
import {UsernameRegistry} from "../src/UsernameRegistry.sol";

/**
 * @title DeployRaynPaymentRouter
 * @author Rayn Team
 * @notice Foundry script to deploy the RaynPaymentRouter contract
 * @dev Run with: forge script script/DeployRaynPaymentRouter.s.sol:DeployRaynPaymentRouter --rpc-url <RPC_URL> --broadcast --verify
 *
 * PREREQUISITES:
 * - UsernameRegistry must be deployed first
 * - Set USERNAME_REGISTRY_ADDRESS in .env
 *
 * USAGE EXAMPLES:
 *
 * 1. Dry run (simulation only):
 *    forge script script/DeployRaynPaymentRouter.s.sol:DeployRaynPaymentRouter --rpc-url $RPC_URL
 *
 * 2. Deploy to testnet:
 *    USERNAME_REGISTRY_ADDRESS=0x... forge script script/DeployRaynPaymentRouter.s.sol:DeployRaynPaymentRouter --rpc-url $RPC_URL --broadcast --verify
 *
 * 3. Deploy locally (Anvil):
 *    forge script script/DeployRaynPaymentRouter.s.sol:DeployRaynPaymentRouter --rpc-url http://localhost:8545 --broadcast
 *
 * ENVIRONMENT VARIABLES:
 * - PRIVATE_KEY: Deployer's private key (required)
 * - RPC_URL: Network RPC endpoint (required)
 * - USERNAME_REGISTRY_ADDRESS: Address of deployed UsernameRegistry (required)
 * - ETHERSCAN_API_KEY: For contract verification (optional)
 */
contract DeployRaynPaymentRouter is Script {
    /// @notice Main deployment function
    /// @return router The deployed RaynPaymentRouter contract
    function run() external returns (RaynPaymentRouter router) {
        // Get deployer's private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Get UsernameRegistry address (required)
        address usernameRegistryAddress = vm.envAddress(
            "USERNAME_REGISTRY_ADDRESS"
        );

        console.log("========================================");
        console.log("RaynPaymentRouter Deployment");
        console.log("========================================");
        console.log("Deployer:", msg.sender);
        console.log("UsernameRegistry:", usernameRegistryAddress);
        console.log("========================================");

        // Validate UsernameRegistry address
        require(
            usernameRegistryAddress != address(0),
            "USERNAME_REGISTRY_ADDRESS not set in .env"
        );

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy RaynPaymentRouter
        router = new RaynPaymentRouter(usernameRegistryAddress);

        console.log("\n========================================");
        console.log("RaynPaymentRouter Deployed!");
        console.log("========================================");
        console.log("Contract Address:", address(router));
        console.log("UsernameRegistry:", address(router.usernameRegistry()));
        console.log("========================================");

        // Stop broadcasting
        vm.stopBroadcast();

        // Log deployment details for frontend integration
        console.log("\nFrontend Integration:");
        console.log("Add this to your .env file:");
        console.log("VITE_PAYMENT_ROUTER_ADDRESS=%s", address(router));

        console.log("\nNext Steps:");
        console.log("1. Users can now send tokens using usernames");
        console.log(
            "2. Approve the router before sending: token.approve(router, amount)"
        );
        console.log(
            "3. Send tokens: router.sendToUsername(token, username, amount)"
        );

        return router;
    }
}
