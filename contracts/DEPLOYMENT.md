# Rayn Deployment Guide

Complete guide for deploying Rayn smart contracts to any EVM-compatible network.

---

## 📋 Prerequisites

1. **Foundry installed**

   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. **Environment variables configured**
   Create a `.env` file in the `contracts/` directory:

   ```bash
   # Required
   PRIVATE_KEY=your_private_key_here
   RPC_URL=https://your-rpc-endpoint

   # Optional
   ETHERSCAN_API_KEY=your_etherscan_api_key
   INITIAL_MINT_AMOUNT=1000000000000  # 1,000,000 tokens (with 6 decimals)
   ```

3. **Load environment variables**
   ```bash
   source .env
   ```

---

## 🚀 Deployment Options

### Option 1: Deploy All Contracts (Recommended)

Deploys all three contracts in one transaction batch:

```bash
forge script script/DeployAll.s.sol:DeployAll \
    --rpc-url $RPC_URL \
    --broadcast \
    --verify
```

**What gets deployed:**

- ✅ RaynStable (test stablecoin)
- ✅ UsernameRegistry
- ✅ GiveawayDistributor

---

### Option 2: Deploy Individual Contracts

#### Deploy RaynStable Only

```bash
forge script script/DeployRaynStable.s.sol:DeployRaynStable \
    --rpc-url $RPC_URL \
    --broadcast
```

#### Deploy UsernameRegistry Only

```bash
forge script script/DeployUsernameRegistry.s.sol:DeployUsernameRegistry \
    --rpc-url $RPC_URL \
    --broadcast \
    --verify
```

#### Deploy GiveawayDistributor Only

```bash
forge script script/DeployGiveawayDistributor.s.sol:DeployGiveawayDistributor \
    --rpc-url $RPC_URL \
    --broadcast \
    --verify
```

---

## 🧪 Dry Run (Simulation)

Test deployment without broadcasting transactions:

```bash
# Simulate full deployment
forge script script/DeployAll.s.sol:DeployAll --rpc-url $RPC_URL

# Simulate individual contract
forge script script/DeployRaynStable.s.sol:DeployRaynStable --rpc-url $RPC_URL
```

---

## 🌐 Network-Specific Deployments

### Lisk Sepolia Testnet

```bash
RPC_URL=https://rpc.sepolia-api.lisk.com \
forge script script/DeployAll.s.sol:DeployAll \
    --rpc-url $RPC_URL \
    --broadcast \
    --verify
```

### Ethereum Sepolia

```bash
RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY \
forge script script/DeployAll.s.sol:DeployAll \
    --rpc-url $RPC_URL \
    --broadcast \
    --verify
```

### Local Development (Anvil)

```bash
# Terminal 1: Start Anvil
anvil

# Terminal 2: Deploy
forge script script/DeployAll.s.sol:DeployAll \
    --rpc-url http://localhost:8545 \
    --broadcast
```

### Polygon Amoy Testnet

```bash
RPC_URL=https://rpc-amoy.polygon.technology \
forge script script/DeployAll.s.sol:DeployAll \
    --rpc-url $RPC_URL \
    --broadcast \
    --verify
```

---

## 🔐 Security Best Practices

### 1. Never Commit Private Keys

```bash
# Add to .gitignore
echo ".env" >> .gitignore
echo "broadcast/" >> .gitignore
echo "cache/" >> .gitignore
```

### 2. Use Hardware Wallets (Production)

```bash
forge script script/DeployAll.s.sol:DeployAll \
    --rpc-url $RPC_URL \
    --ledger \
    --broadcast
```

### 3. Verify Source Code

Always verify contracts on block explorers:

```bash
forge verify-contract \
    --chain-id 1135 \
    --compiler-version v0.8.30 \
    CONTRACT_ADDRESS \
    src/ContractName.sol:ContractName
```

---

## 📝 Post-Deployment Checklist

### 1. Save Contract Addresses

After deployment, save the output addresses:

```
RaynStable:           0x...
UsernameRegistry:     0x...
GiveawayDistributor:  0x...
```

### 2. Update Frontend Environment

Copy addresses to `frontend/rayn/.env`:

```bash
VITE_RAYN_STABLE_ADDRESS=0x...
VITE_USERNAME_REGISTRY_ADDRESS=0x...
VITE_GIVEAWAY_DISTRIBUTOR_ADDRESS=0x...
```

### 3. Verify Contracts

Check on block explorer:

- Source code verified ✅
- Contract owner correct ✅
- No compilation warnings ✅

### 4. Test Basic Functionality

#### Test RaynStable

```bash
cast call $RAYN_STABLE "name()(string)"
cast call $RAYN_STABLE "symbol()(string)"
cast call $RAYN_STABLE "decimals()(uint8)"
```

#### Test UsernameRegistry

```bash
cast call $USERNAME_REGISTRY "MIN_USERNAME_LENGTH()(uint256)"
cast call $USERNAME_REGISTRY "MAX_USERNAME_LENGTH()(uint256)"
```

#### Test GiveawayDistributor

```bash
cast call $GIVEAWAY_DISTRIBUTOR "getTotalGiveaways()(uint256)"
```

---

## 🛠️ Common Commands

### Build Contracts

```bash
forge build
```

### Run Tests

```bash
forge test
forge test -vvv  # Verbose output
```

### Check Gas Usage

```bash
forge test --gas-report
```

### Format Code

```bash
forge fmt
```

### Generate ABI

```bash
forge inspect RaynStable abi > abi/RaynStable.json
forge inspect UsernameRegistry abi > abi/UsernameRegistry.json
forge inspect GiveawayDistributor abi > abi/GiveawayDistributor.json
```

---

## 🔄 Upgrading Contracts

Since these contracts are **not upgradeable**, new deployments are required for changes:

1. Deploy new version with deployment script
2. Migrate data if necessary
3. Update frontend to point to new addresses
4. Communicate changes to users

---

## 🚨 Troubleshooting

### "Invalid sender" error

**Solution:** Check that `PRIVATE_KEY` is set correctly

```bash
echo $PRIVATE_KEY  # Should show your key
```

### "Insufficient funds" error

**Solution:** Fund your deployer address with native tokens (ETH, MATIC, etc.)

```bash
cast balance $DEPLOYER_ADDRESS --rpc-url $RPC_URL
```

### Verification failed

**Solution:** Manually verify with constructor args

```bash
forge verify-contract \
    --chain-id CHAIN_ID \
    --constructor-args $(cast abi-encode "constructor()") \
    CONTRACT_ADDRESS \
    src/ContractName.sol:ContractName
```

### Nonce too low/high

**Solution:** Reset nonce or wait for previous tx to confirm

```bash
cast nonce $DEPLOYER_ADDRESS --rpc-url $RPC_URL
```

---

## 📊 Deployment Costs (Estimated Gas)

| Contract            | Deployment Gas | Cost @ 50 gwei |
| ------------------- | -------------- | -------------- |
| RaynStable          | ~800,000       | ~0.04 ETH      |
| UsernameRegistry    | ~600,000       | ~0.03 ETH      |
| GiveawayDistributor | ~1,500,000     | ~0.075 ETH     |
| **Total**           | **~2,900,000** | **~0.145 ETH** |

_Gas costs vary by network and gas price_

---

## 🌟 Quick Start Examples

### Example 1: Full Testnet Deployment

```bash
# 1. Set environment
export PRIVATE_KEY="0x..."
export RPC_URL="https://rpc.sepolia-api.lisk.com"

# 2. Deploy all contracts
forge script script/DeployAll.s.sol:DeployAll \
    --rpc-url $RPC_URL \
    --broadcast \
    --verify

# 3. Mint test tokens
cast send $RAYN_STABLE \
    "mint(address,uint256)" \
    $YOUR_ADDRESS \
    1000000000 \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY
```

### Example 2: Local Development

```bash
# Terminal 1: Start local node
anvil

# Terminal 2: Deploy
forge script script/DeployAll.s.sol:DeployAll \
    --rpc-url http://localhost:8545 \
    --broadcast

# Terminal 3: Interact
cast call $CONTRACT_ADDRESS "function_name()"
```

---

## 📚 Additional Resources

- [Foundry Book](https://book.getfoundry.sh/)
- [Forge Script Documentation](https://book.getfoundry.sh/tutorials/solidity-scripting)
- [Contract Verification Guide](https://book.getfoundry.sh/reference/forge/forge-verify-contract)
- [Rayn Documentation](../README.md)

---

## 💡 Pro Tips

1. **Always dry run first** - Test with `--rpc-url` without `--broadcast`
2. **Save deployment receipts** - Foundry saves them in `broadcast/`
3. **Use environment files** - Different `.env` files for different networks
4. **Monitor gas prices** - Deploy during low-traffic times
5. **Keep deployment logs** - Save console output for reference

---

**Need help? Check the [troubleshooting section](#-troubleshooting) or open an issue.**
