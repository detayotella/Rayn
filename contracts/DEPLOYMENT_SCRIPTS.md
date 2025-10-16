# Rayn Deployment Scripts - Summary

## ✅ Deployment Scripts Status

All deployment scripts have been successfully created and tested. They compile without errors using Foundry.

---

## 📁 Created Files

### Deployment Scripts

```
contracts/script/
├── DeployAll.s.sol                    # Deploy all contracts at once
├── DeployRaynStable.s.sol            # Deploy test stablecoin
├── DeployUsernameRegistry.s.sol      # Deploy username registry
└── DeployGiveawayDistributor.s.sol   # Deploy giveaway system
```

### Helper Files

```
contracts/
├── deploy.sh           # Interactive deployment helper (bash)
├── Makefile           # Common commands (make build, make deploy, etc.)
├── .env.example       # Environment variables template
└── DEPLOYMENT.md      # Comprehensive deployment guide
```

---

## 🚀 Quick Start

### 1. Setup Environment

```bash
cd contracts
cp .env.example .env
# Edit .env with your PRIVATE_KEY and RPC_URL
```

### 2. Deploy All Contracts (Easiest Method)

```bash
# Interactive deployment
./deploy.sh

# Or using make
make deploy-all

# Or directly with forge
forge script script/DeployAll.s.sol:DeployAll \
    --rpc-url $RPC_URL \
    --broadcast \
    --verify
```

### 3. Deploy Individual Contracts

```bash
# Deploy only RaynStable
make deploy-stable

# Deploy only UsernameRegistry
make deploy-registry

# Deploy only GiveawayDistributor
make deploy-giveaway
```

---

## 📋 Deployment Script Features

### DeployAll.s.sol ⭐ (Recommended)

**What it does:**

- Deploys all three contracts in one transaction batch
- Optionally mints initial test tokens
- Provides comprehensive deployment summary
- Outputs contract addresses for frontend integration

**Key Features:**

- ✅ Single-command deployment
- ✅ Automatic address logging
- ✅ Frontend .env integration guide
- ✅ Post-deployment checklist
- ✅ Error handling and validation

**Usage:**

```bash
forge script script/DeployAll.s.sol:DeployAll \
    --rpc-url $RPC_URL \
    --broadcast
```

**Output Example:**

```
========================================
RAYN PROTOCOL DEPLOYMENT
========================================
Deployer Address: 0x...
Chain ID: 1135

1/3 Deploying RaynStable...
   [OK] RaynStable deployed at: 0x...

2/3 Deploying UsernameRegistry...
   [OK] UsernameRegistry deployed at: 0x...

3/3 Deploying GiveawayDistributor...
   [OK] GiveawayDistributor deployed at: 0x...

========================================
DEPLOYMENT SUCCESSFUL!
========================================
```

---

### DeployRaynStable.s.sol

**What it does:**

- Deploys the RaynStable test token (6 decimals)
- Optionally mints initial supply to deployer
- Displays token information

**Environment Variables:**

- `PRIVATE_KEY` - Required
- `RPC_URL` - Required
- `INITIAL_MINT_AMOUNT` - Optional (e.g., 1000000000000)

**Usage:**

```bash
INITIAL_MINT_AMOUNT=1000000000000 \
forge script script/DeployRaynStable.s.sol:DeployRaynStable \
    --rpc-url $RPC_URL \
    --broadcast
```

---

### DeployUsernameRegistry.s.sol

**What it does:**

- Deploys the UsernameRegistry contract
- Sets deployer as owner
- Ready for immediate use

**Usage:**

```bash
forge script script/DeployUsernameRegistry.s.sol:DeployUsernameRegistry \
    --rpc-url $RPC_URL \
    --broadcast \
    --verify
```

---

### DeployGiveawayDistributor.s.sol

**What it does:**

- Deploys the GiveawayDistributor contract
- Sets deployer as owner
- Ready to create giveaways

**Usage:**

```bash
forge script script/DeployGiveawayDistributor.s.sol:DeployGiveawayDistributor \
    --rpc-url $RPC_URL \
    --broadcast \
    --verify
```

---

## 🛠️ Helper Tools

### deploy.sh (Interactive Deployment)

Bash script with interactive menu for easy deployment.

**Features:**

- ✅ Interactive menu selection
- ✅ Automatic .env validation
- ✅ Balance checking before deployment
- ✅ Deployment confirmation prompts
- ✅ Colored output for better UX
- ✅ Dry run simulation option

**Usage:**

```bash
./deploy.sh
```

**Menu Options:**

1. Deploy all contracts
2. Deploy RaynStable only
3. Deploy UsernameRegistry only
4. Deploy GiveawayDistributor only
5. Dry run (simulation)
6. Exit

---

### Makefile (Command Shortcuts)

Provides convenient shortcuts for common operations.

**Build & Test:**

```bash
make build          # Compile contracts
make test           # Run tests
make test-v         # Verbose tests
make test-gas       # Gas report
make coverage       # Coverage report
make clean          # Clean artifacts
make format         # Format code
```

**Deployment:**

```bash
make deploy-all     # Interactive deployment
make deploy-stable  # Deploy RaynStable
make deploy-registry # Deploy UsernameRegistry
make deploy-giveaway # Deploy GiveawayDistributor
make dry-run        # Simulate deployment
```

**Local Development:**

```bash
make anvil          # Start local node
make deploy-local   # Deploy to Anvil
```

**Utilities:**

```bash
make abi            # Generate ABI files
make snapshot       # Gas snapshot
```

---

## 🌐 Network Examples

### Lisk Sepolia Testnet

```bash
export RPC_URL="https://rpc.sepolia-api.lisk.com"
make deploy-all
```

### Ethereum Sepolia

```bash
export RPC_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY"
make deploy-all
```

### Local Anvil

```bash
# Terminal 1
make anvil

# Terminal 2
make deploy-local
```

---

## 📝 Environment Variables

### Required

```bash
PRIVATE_KEY=your_private_key_here
RPC_URL=https://your-rpc-endpoint
```

### Optional

```bash
ETHERSCAN_API_KEY=your_api_key          # For verification
INITIAL_MINT_AMOUNT=1000000000000       # Initial token mint
```

### Post-Deployment

```bash
RAYN_STABLE_ADDRESS=0x...
USERNAME_REGISTRY_ADDRESS=0x...
GIVEAWAY_DISTRIBUTOR_ADDRESS=0x...
```

---

## 🔒 Security Best Practices

### 1. Never Commit Secrets

```bash
# Ensure .env is in .gitignore
echo ".env" >> .gitignore
echo "broadcast/" >> .gitignore
```

### 2. Dry Run First

```bash
# Always test before broadcasting
make dry-run
```

### 3. Verify Deployed Contracts

```bash
# Automatic verification
forge script script/DeployAll.s.sol:DeployAll \
    --rpc-url $RPC_URL \
    --broadcast \
    --verify

# Manual verification
forge verify-contract \
    --chain-id 1135 \
    CONTRACT_ADDRESS \
    src/ContractName.sol:ContractName
```

---

## 📊 Deployment Checklist

### Pre-Deployment

- [ ] Compiled contracts (`make build`)
- [ ] Tests passing (`make test`)
- [ ] `.env` configured with correct values
- [ ] Deployer wallet funded with native tokens
- [ ] RPC endpoint tested and working

### During Deployment

- [ ] Review gas estimates
- [ ] Confirm transaction details
- [ ] Monitor transaction confirmation

### Post-Deployment

- [ ] Save contract addresses
- [ ] Verify contracts on block explorer
- [ ] Update frontend `.env` file
- [ ] Test basic contract functionality
- [ ] Document deployment in project records

---

## 🎯 Common Use Cases

### Testnet Development Setup

```bash
# 1. Deploy all contracts
./deploy.sh  # Select option 1

# 2. Mint test tokens
cast send $RAYN_STABLE_ADDRESS \
    "mint(address,uint256)" \
    $YOUR_ADDRESS \
    1000000000000 \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY

# 3. Register username
cast send $USERNAME_REGISTRY_ADDRESS \
    "registerUsername(string)" \
    "alice_crypto" \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY
```

### Production Deployment (Mainnet)

```bash
# 1. Deploy UsernameRegistry and GiveawayDistributor only
#    (Skip RaynStable - use real USDC/USDT instead)

make deploy-registry
make deploy-giveaway

# 2. Verify on block explorer
forge verify-contract ...

# 3. Security audit before use
```

---

## 🆘 Troubleshooting

### "Invalid sender" Error

**Problem:** Private key not set or incorrect
**Solution:**

```bash
echo $PRIVATE_KEY  # Verify it's set
# Re-export or check .env file
```

### "Insufficient Funds" Error

**Problem:** Deployer address has no balance
**Solution:**

```bash
# Check balance
cast balance $DEPLOYER_ADDRESS --rpc-url $RPC_URL

# Fund the address with native tokens
```

### "Nonce Too Low/High" Error

**Problem:** Transaction nonce mismatch
**Solution:**

```bash
# Check current nonce
cast nonce $DEPLOYER_ADDRESS --rpc-url $RPC_URL

# Wait for pending transactions to confirm
```

### Verification Failed

**Problem:** Etherscan API key issue or wrong params
**Solution:**

```bash
# Verify manually with detailed args
forge verify-contract \
    --chain-id CHAIN_ID \
    --constructor-args $(cast abi-encode "constructor()") \
    CONTRACT_ADDRESS \
    src/ContractName.sol:ContractName \
    --etherscan-api-key $ETHERSCAN_API_KEY
```

---

## 📚 Additional Resources

- **Deployment Guide:** `DEPLOYMENT.md`
- **Contract Overview:** `CONTRACTS_OVERVIEW.md`
- **Quick Reference:** `QUICK_REFERENCE.md`
- **Foundry Book:** https://book.getfoundry.sh/

---

## ✅ Build Status

```bash
$ forge build
[✓] Compiling 20 files with Solc 0.8.30
[✓] Solc 0.8.30 finished
Compiler run successful!
```

All deployment scripts compile successfully and are ready to use.

---

**Ready to deploy? Start with `./deploy.sh` or `make deploy-all`** 🚀
