// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {RaynStable} from "../src/RaynStable.sol";
import {UsernameRegistry} from "../src/UsernameRegistry.sol";
import {GiveawayDistributor} from "../src/GiveawayDistributor.sol";
import {RaynPaymentRouter} from "../src/RaynPaymentRouter.sol";

/**
 * @title DeployAll
 * @author Rayn Team
 * @notice Comprehensive deployment script for all Rayn contracts
 * @dev Deploys RaynStable, UsernameRegistry, and GiveawayDistributor in one transaction batch
 *
 * USAGE EXAMPLES:
 *
 * 1. Dry run (simulation only):
 *    forge script script/DeployAll.s.sol:DeployAll --rpc-url $RPC_URL
 *
 * 2. Deploy to testnet with verification:
 *    forge script script/DeployAll.s.sol:DeployAll --rpc-url $RPC_URL --broadcast --verify
 *
 * 3. Deploy locally (Anvil):
 *    forge script script/DeployAll.s.sol:DeployAll --rpc-url http://localhost:8545 --broadcast
 *
 * 4. Deploy with initial token minting:
 *    INITIAL_MINT_AMOUNT=1000000000000 forge script script/DeployAll.s.sol:DeployAll --rpc-url $RPC_URL --broadcast
 *
 * ENVIRONMENT VARIABLES:
 * - PRIVATE_KEY: Deployer's private key (required)
 * - RPC_URL: Network RPC endpoint (required)
 * - INITIAL_MINT_AMOUNT: (Optional) Amount of test tokens to mint on deployment
 * - ETHERSCAN_API_KEY: For contract verification (optional)
 *
 * DEPLOYMENT ORDER:
 * 1. RaynStable (test stablecoin)
 * 2. UsernameRegistry (username → address mapping)
 * 3. GiveawayDistributor (token distribution system)
 * 4. RaynPaymentRouter (username-based payments)
 */
contract DeployAll is Script {
    // Deployment addresses (populated after deployment)
    RaynStable public raynStable;
    UsernameRegistry public usernameRegistry;
    GiveawayDistributor public giveawayDistributor;
    RaynPaymentRouter public paymentRouter;

    /// @notice Main deployment function - deploys all contracts
    function run() external {
        // Get deployer's private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("\n========================================");
        console.log("RAYN PROTOCOL DEPLOYMENT");
        console.log("========================================");
        console.log("Deployer Address:", deployer);
        console.log("Chain ID:", block.chainid);
        console.log("========================================\n");

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy RaynStable (Test Stablecoin)
        console.log("1/3 Deploying RaynStable...");
        raynStable = new RaynStable();
        console.log("   [OK] RaynStable deployed at:", address(raynStable));

        // Optional: Mint initial test tokens
        uint256 initialMint = vm.envOr("INITIAL_MINT_AMOUNT", uint256(0));
        if (initialMint > 0) {
            raynStable.mint(deployer, initialMint);
            console.log(
                "   [OK] Minted",
                initialMint / 10 ** raynStable.decimals(),
                "RAYNS to deployer"
            );
        }

        // 2. Deploy UsernameRegistry
        console.log("\n2/3 Deploying UsernameRegistry...");
        usernameRegistry = new UsernameRegistry();
        console.log(
            "   [OK] UsernameRegistry deployed at:",
            address(usernameRegistry)
        );

        // 3. Deploy GiveawayDistributor
        console.log("\n3/4 Deploying GiveawayDistributor...");
        giveawayDistributor = new GiveawayDistributor();
        console.log(
            "   [OK] GiveawayDistributor deployed at:",
            address(giveawayDistributor)
        );

        // 4. Deploy RaynPaymentRouter
        console.log("\n4/4 Deploying RaynPaymentRouter...");
        paymentRouter = new RaynPaymentRouter(address(usernameRegistry));
        console.log(
            "   [OK] RaynPaymentRouter deployed at:",
            address(paymentRouter)
        );

        // Stop broadcasting
        vm.stopBroadcast();

        // Print deployment summary
        _printDeploymentSummary(deployer);
    }

    /// @notice Prints a comprehensive deployment summary
    /// @param deployer The address that deployed the contracts
    function _printDeploymentSummary(address deployer) internal view {
        console.log("\n========================================");
        console.log("DEPLOYMENT SUCCESSFUL!");
        console.log("========================================");
        console.log("\nContract Addresses:");
        console.log("-------------------");
        console.log("RaynStable:          ", address(raynStable));
        console.log("UsernameRegistry:    ", address(usernameRegistry));
        console.log("GiveawayDistributor: ", address(giveawayDistributor));
        console.log("RaynPaymentRouter:   ", address(paymentRouter));

        console.log("\nContract Owners:");
        console.log("----------------");
        console.log("All contracts owned by:", deployer);

        console.log("\n========================================");
        console.log("FRONTEND INTEGRATION");
        console.log("========================================");
        console.log("Add these to your frontend .env file:\n");
        console.log("VITE_RAYN_STABLE_ADDRESS=%s", address(raynStable));
        console.log(
            "VITE_USERNAME_REGISTRY_ADDRESS=%s",
            address(usernameRegistry)
        );
        console.log(
            "VITE_GIVEAWAY_DISTRIBUTOR_ADDRESS=%s",
            address(giveawayDistributor)
        );
        console.log("VITE_PAYMENT_ROUTER_ADDRESS=%s", address(paymentRouter));

        console.log("\n========================================");
        console.log("NEXT STEPS");
        console.log("========================================");
        console.log("1. Save the contract addresses above");
        console.log("2. Update your frontend .env file");
        console.log(
            "3. Verify contracts on block explorer (if not auto-verified)"
        );
        console.log("4. Test each contract's functionality");
        console.log("5. For testnet: Mint test tokens using RaynStable.mint()");
        console.log("\nWARNING: RaynStable is for TESTING only!");
        console.log("   Use real stablecoins (USDC/USDT/DAI) in production");
        console.log("========================================\n");
    }

    /// @notice Helper function to get all deployed addresses
    /// @return stable Address of RaynStable
    /// @return registry Address of UsernameRegistry
    /// @return distributor Address of GiveawayDistributor
    /// @return router Address of RaynPaymentRouter
    function getDeployedAddresses()
        external
        view
        returns (
            address stable,
            address registry,
            address distributor,
            address router
        )
    {
        return (
            address(raynStable),
            address(usernameRegistry),
            address(giveawayDistributor),
            address(paymentRouter)
        );
    }
}
