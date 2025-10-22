// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;



import {Script, console} from "forge-std/Script.sol";import {Script, console} from "forge-std/Script.sol";

import {RaynStable} from "../src/RaynStable.sol";import {GiveawayDistributor} from "../src/GiveawayDistributor.sol";



/**/**

 * @title DeployRaynStable * @title DeployGiveawayDistributor

 * @author Rayn Team * @author Rayn Team

 * @notice Foundry script to deploy the RaynStable test token * @notice Foundry script to deploy the GiveawayDistributor contract

 * @dev Run with: forge script script/DeployRaynStable.s.sol:DeployRaynStable --rpc-url <RPC_URL> --broadcast * @dev Run with: forge script script/DeployGiveawayDistributor.s.sol:DeployGiveawayDistributor --rpc-url <RPC_URL> --broadcast --verify

 * *

 * ⚠️ WARNING: This is a TEST TOKEN only! Do NOT deploy to mainnet. * USAGE EXAMPLES:

 * For production, integrate with real stablecoins like USDC, USDT, or DAI. *

 * * 1. Dry run (simulation only):

 * USAGE EXAMPLES: *    forge script script/DeployGiveawayDistributor.s.sol:DeployGiveawayDistributor --rpc-url $RPC_URL

 * *

 * 1. Dry run (simulation only): * 2. Deploy to testnet:

 *    forge script script/DeployRaynStable.s.sol:DeployRaynStable --rpc-url $RPC_URL *    forge script script/DeployGiveawayDistributor.s.sol:DeployGiveawayDistributor --rpc-url $RPC_URL --broadcast --verify

 * *

 * 2. Deploy to testnet: * 3. Deploy locally (Anvil):

 *    forge script script/DeployRaynStable.s.sol:DeployRaynStable --rpc-url $RPC_URL --broadcast *    forge script script/DeployGiveawayDistributor.s.sol:DeployGiveawayDistributor --rpc-url http://localhost:8545 --broadcast

 * *

 * 3. Deploy locally (Anvil): * ENVIRONMENT VARIABLES:

 *    forge script script/DeployRaynStable.s.sol:DeployRaynStable --rpc-url http://localhost:8545 --broadcast * - PRIVATE_KEY: Deployer's private key

 * * - RPC_URL: Network RPC endpoint

 * 4. Deploy with initial minting: * - ETHERSCAN_API_KEY: For contract verification (optional)

 *    INITIAL_MINT_AMOUNT=1000000000000 forge script script/DeployRaynStable.s.sol:DeployRaynStable --rpc-url $RPC_URL --broadcast */

 *contract DeployGiveawayDistributor is Script {

 * ENVIRONMENT VARIABLES:    /// @notice Main deployment function

 * - PRIVATE_KEY: Deployer's private key    /// @return distributor The deployed GiveawayDistributor contract

 * - RPC_URL: Network RPC endpoint    function run() external returns (GiveawayDistributor distributor) {

 * - INITIAL_MINT_AMOUNT: (Optional) Amount to mint to deployer on deployment (in smallest units)        // Get deployer's private key from environment

 */        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

contract DeployRaynStable is Script {

    /// @notice Main deployment function        // Start broadcasting transactions

    /// @return stable The deployed RaynStable contract        vm.startBroadcast(deployerPrivateKey);

    function run() external returns (RaynStable stable) {

        // Get deployer's private key from environment        // Deploy GiveawayDistributor

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");        distributor = new GiveawayDistributor();



        // Start broadcasting transactions        console.log("========================================");

        vm.startBroadcast(deployerPrivateKey);        console.log("GiveawayDistributor Deployed!");

        console.log("========================================");

        // Deploy RaynStable        console.log("Contract Address:", address(distributor));

        stable = new RaynStable();        console.log("Deployer (Owner):", msg.sender);

        console.log("========================================");

        console.log("========================================");

        console.log("RaynStable Deployed! (TESTNET ONLY)");        // Stop broadcasting

        console.log("========================================");        vm.stopBroadcast();

        console.log("Contract Address:", address(stable));

        console.log("Token Name:", stable.name());        // Log deployment details for frontend integration

        console.log("Token Symbol:", stable.symbol());        console.log("\nFrontend Integration:");

        console.log("Decimals:", stable.decimals());        console.log("Add this to your .env file:");

        console.log("Owner:", msg.sender);        console.log("VITE_GIVEAWAY_DISTRIBUTOR_ADDRESS=%s", address(distributor));

        console.log("========================================");

        return distributor;

        // Optional: Mint initial supply if specified    }

        uint256 initialMint = vm.envOr("INITIAL_MINT_AMOUNT", uint256(0));}

        if (initialMint > 0) {
            stable.mint(msg.sender, initialMint);
            console.log("\nInitial Mint:");
            console.log("Amount (raw):", initialMint);
            console.log("Amount (human):", initialMint / 10**stable.decimals());
            console.log("Recipient:", msg.sender);
        }

        // Stop broadcasting
        vm.stopBroadcast();

        // Log deployment details for frontend integration
        console.log("\nFrontend Integration:");
        console.log("Add this to your .env file:");
        console.log("VITE_RAYN_STABLE_ADDRESS=%s", address(stable));
        
        console.log("\n⚠️  REMINDER: This is a TEST TOKEN!");
        console.log("For production, use real stablecoins (USDC/USDT/DAI)");

        return stable;
    }
}
