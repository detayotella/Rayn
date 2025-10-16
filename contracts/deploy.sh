#!/bin/bash

# Rayn Deployment Helper Script
# Makes deploying contracts easier with interactive prompts

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}"
echo "╔═══════════════════════════════════════╗"
echo "║   RAYN SMART CONTRACT DEPLOYER       ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${NC}"

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  No .env file found!${NC}"
    echo "Creating .env template..."
    cat > .env << 'EOF'
# Deployer Private Key (DO NOT COMMIT!)
PRIVATE_KEY=your_private_key_here

# RPC URL for the network
RPC_URL=https://rpc.sepolia-api.lisk.com

# Optional: Block explorer API key for verification
ETHERSCAN_API_KEY=your_api_key_here

# Optional: Initial token mint amount (with decimals)
INITIAL_MINT_AMOUNT=1000000000000
EOF
    echo -e "${GREEN}✓ Created .env template${NC}"
    echo -e "${YELLOW}Please edit .env with your credentials and run this script again${NC}"
    exit 1
fi

# Load environment variables
source .env

# Validate required variables
if [ -z "$PRIVATE_KEY" ] || [ "$PRIVATE_KEY" = "your_private_key_here" ]; then
    echo -e "${RED}❌ PRIVATE_KEY not set in .env${NC}"
    exit 1
fi

if [ -z "$RPC_URL" ]; then
    echo -e "${RED}❌ RPC_URL not set in .env${NC}"
    exit 1
fi

# Get deployer address
DEPLOYER=$(cast wallet address $PRIVATE_KEY 2>/dev/null || echo "Unknown")

echo -e "${BLUE}Deployment Configuration:${NC}"
echo "  Deployer: $DEPLOYER"
echo "  RPC URL: $RPC_URL"
echo ""

# Menu
echo -e "${YELLOW}What would you like to deploy?${NC}"
echo "  1) All contracts (RaynStable + UsernameRegistry + GiveawayDistributor)"
echo "  2) RaynStable only (test token)"
echo "  3) UsernameRegistry only"
echo "  4) GiveawayDistributor only"
echo "  5) Dry run (simulate without broadcasting)"
echo "  6) Exit"
echo ""

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo -e "${GREEN}Deploying all contracts...${NC}"
        SCRIPT="script/DeployAll.s.sol:DeployAll"
        VERIFY="--verify"
        ;;
    2)
        echo -e "${GREEN}Deploying RaynStable...${NC}"
        SCRIPT="script/DeployRaynStable.s.sol:DeployRaynStable"
        VERIFY=""
        ;;
    3)
        echo -e "${GREEN}Deploying UsernameRegistry...${NC}"
        SCRIPT="script/DeployUsernameRegistry.s.sol:DeployUsernameRegistry"
        VERIFY="--verify"
        ;;
    4)
        echo -e "${GREEN}Deploying GiveawayDistributor...${NC}"
        SCRIPT="script/DeployGiveawayDistributor.s.sol:DeployGiveawayDistributor"
        VERIFY="--verify"
        ;;
    5)
        echo -e "${YELLOW}Running dry run simulation...${NC}"
        SCRIPT="script/DeployAll.s.sol:DeployAll"
        VERIFY=""
        
        forge script $SCRIPT --rpc-url $RPC_URL
        
        echo -e "${GREEN}✓ Simulation complete!${NC}"
        echo -e "${YELLOW}No transactions were broadcast${NC}"
        exit 0
        ;;
    6)
        echo -e "${BLUE}Goodbye!${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

# Confirmation
echo ""
read -p "$(echo -e ${YELLOW}Are you sure you want to deploy? [y/N]: ${NC})" confirm

if [[ ! $confirm =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Deployment cancelled${NC}"
    exit 0
fi

# Check balance
echo ""
echo -e "${BLUE}Checking deployer balance...${NC}"
BALANCE=$(cast balance $DEPLOYER --rpc-url $RPC_URL 2>/dev/null || echo "0")
BALANCE_ETH=$(cast --to-unit $BALANCE ether 2>/dev/null || echo "0")

if [ "$BALANCE" = "0" ]; then
    echo -e "${RED}❌ Deployer has no balance!${NC}"
    echo "Please fund $DEPLOYER with native tokens"
    exit 1
fi

echo -e "${GREEN}Balance: $BALANCE_ETH ETH${NC}"

# Deploy
echo ""
echo -e "${BLUE}Starting deployment...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Build the forge command
FORGE_CMD="forge script $SCRIPT --rpc-url $RPC_URL --broadcast"

if [ ! -z "$VERIFY" ] && [ ! -z "$ETHERSCAN_API_KEY" ]; then
    FORGE_CMD="$FORGE_CMD $VERIFY"
fi

# Execute deployment
if eval $FORGE_CMD; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "  1. Check broadcast/ folder for deployment receipts"
    echo "  2. Copy contract addresses to your frontend .env"
    echo "  3. Verify contracts on block explorer (if not auto-verified)"
    echo "  4. Test the deployed contracts"
    echo ""
else
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${RED}❌ Deployment failed!${NC}"
    echo "Check the error messages above"
    exit 1
fi
