// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {RaynStable} from "../src/RaynStable.sol";

/**
 * @title DeployRaynStable
 * @author Rayn Team
 * @notice Foundry script to deploy the RaynStable test token
 * @dev Run with: forge script script/DeployRaynStable.s.sol:DeployRaynStable --rpc-url <RPC_URL> --broadcast
 *
 * WARNING: This is a TEST TOKEN only! Do NOT deploy to mainnet.
 * For production, integrate with real stablecoins like USDC, USDT, or DAI.
 *
 * USAGE EXAMPLES:
 *
 * 1. Dry run (simulation only):
 *    forge script script/DeployRaynStable.s.sol:DeployRaynStable --rpc-url $RPC_URL
 *
 * 2. Deploy to testnet:
 *    forge script script/DeployRaynStable.s.sol:DeployRaynStable --rpc-url $RPC_URL --broadcast
 *
 * 3. Deploy locally (Anvil):
 *    forge script script/DeployRaynStable.s.sol:DeployRaynStable --rpc-url http://localhost:8545 --broadcast
 *
 * 4. Deploy with initial minting:
 *    INITIAL_MINT_AMOUNT=1000000000000 forge script script/DeployRaynStable.s.sol:DeployRaynStable --rpc-url $RPC_URL --broadcast
 *
 * ENVIRONMENT VARIABLES:
 * - PRIVATE_KEY: Deployer's private key
 * - RPC_URL: Network RPC endpoint
 * - INITIAL_MINT_AMOUNT: (Optional) Amount to mint to deployer on deployment (in smallest units)
 */
contract DeployRaynStable is Script {
    /// @notice Main deployment function
    /// @return stable The deployed RaynStable contract
    function run() external returns (RaynStable stable) {
        // Get deployer's private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy RaynStable
        stable = new RaynStable();

        console.log("========================================");
        console.log("RaynStable Deployed! (TESTNET ONLY)");
        console.log("========================================");
        console.log("Contract Address:", address(stable));
        console.log("Token Name:", stable.name());
        console.log("Token Symbol:", stable.symbol());
        console.log("Decimals:", stable.decimals());
        console.log("Owner:", msg.sender);
        console.log("========================================");

        // Optional: Mint initial supply if specified
        uint256 initialMint = vm.envOr("INITIAL_MINT_AMOUNT", uint256(0));
        if (initialMint > 0) {
            stable.mint(msg.sender, initialMint);
            console.log("\nInitial Mint:");
            console.log("Amount (raw):", initialMint);
            console.log(
                "Amount (human):",
                initialMint / 10 ** stable.decimals()
            );
            console.log("Recipient:", msg.sender);
        }

        // Stop broadcasting
        vm.stopBroadcast();

        // Log deployment details for frontend integration
        console.log("\nFrontend Integration:");
        console.log("Add this to your .env file:");
        console.log("VITE_RAYN_STABLE_ADDRESS=%s", address(stable));

        console.log("\nWARNING: This is a TEST TOKEN!");
        console.log("For production, use real stablecoins (USDC/USDT/DAI)");

        return stable;
    }
}
