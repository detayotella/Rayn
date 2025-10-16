# Rayn Smart Contracts - Makefile
# Common commands for building, testing, and deploying

# Load environment variables
-include .env
export

# Default target
.PHONY: help
help:
	@echo "Rayn Smart Contracts - Available Commands"
	@echo "=========================================="
	@echo ""
	@echo "Build & Test:"
	@echo "  make build           - Compile all contracts"
	@echo "  make test            - Run all tests"
	@echo "  make test-v          - Run tests with verbose output"
	@echo "  make test-gas        - Run tests with gas report"
	@echo "  make coverage        - Generate test coverage report"
	@echo "  make clean           - Clean build artifacts"
	@echo ""
	@echo "Deployment:"
	@echo "  make deploy-all      - Deploy all contracts (interactive)"
	@echo "  make deploy-stable   - Deploy RaynStable only"
	@echo "  make deploy-registry - Deploy UsernameRegistry only"
	@echo "  make deploy-giveaway - Deploy GiveawayDistributor only"
	@echo "  make dry-run         - Simulate deployment without broadcasting"
	@echo ""
	@echo "Local Development:"
	@echo "  make anvil           - Start local Anvil node"
	@echo "  make deploy-local    - Deploy to local Anvil"
	@echo ""
	@echo "Utilities:"
	@echo "  make format          - Format Solidity code"
	@echo "  make snapshot        - Create gas snapshot"
	@echo "  make abi             - Generate ABI files"
	@echo "  make verify          - Verify contracts on explorer"
	@echo ""

# ============================================
# Build & Compilation
# ============================================

.PHONY: build
build:
	@echo "Building contracts..."
	@forge build

.PHONY: clean
clean:
	@echo "Cleaning build artifacts..."
	@forge clean
	@rm -rf broadcast/ cache/ out/

.PHONY: format
format:
	@echo "Formatting Solidity files..."
	@forge fmt

# ============================================
# Testing
# ============================================

.PHONY: test
test:
	@echo "Running tests..."
	@forge test

.PHONY: test-v
test-v:
	@echo "Running tests (verbose)..."
	@forge test -vvv

.PHONY: test-gas
test-gas:
	@echo "Running tests with gas report..."
	@forge test --gas-report

.PHONY: coverage
coverage:
	@echo "Generating coverage report..."
	@forge coverage

.PHONY: snapshot
snapshot:
	@echo "Creating gas snapshot..."
	@forge snapshot

# ============================================
# Deployment - All Networks
# ============================================

.PHONY: deploy-all
deploy-all:
	@./deploy.sh

.PHONY: dry-run
dry-run:
	@echo "Running deployment simulation..."
	@forge script script/DeployAll.s.sol:DeployAll --rpc-url $(RPC_URL)

# ============================================
# Deployment - Individual Contracts
# ============================================

.PHONY: deploy-stable
deploy-stable:
	@echo "Deploying RaynStable..."
	@forge script script/DeployRaynStable.s.sol:DeployRaynStable \
		--rpc-url $(RPC_URL) \
		--broadcast

.PHONY: deploy-registry
deploy-registry:
	@echo "Deploying UsernameRegistry..."
	@forge script script/DeployUsernameRegistry.s.sol:DeployUsernameRegistry \
		--rpc-url $(RPC_URL) \
		--broadcast \
		--verify

.PHONY: deploy-giveaway
deploy-giveaway:
	@echo "Deploying GiveawayDistributor..."
	@forge script script/DeployGiveawayDistributor.s.sol:DeployGiveawayDistributor \
		--rpc-url $(RPC_URL) \
		--broadcast \
		--verify

# ============================================
# Local Development (Anvil)
# ============================================

.PHONY: anvil
anvil:
	@echo "Starting Anvil local node..."
	@anvil

.PHONY: deploy-local
deploy-local:
	@echo "Deploying to local Anvil..."
	@forge script script/DeployAll.s.sol:DeployAll \
		--rpc-url http://localhost:8545 \
		--broadcast

# ============================================
# Network-Specific Deployments
# ============================================

.PHONY: deploy-lisk-sepolia
deploy-lisk-sepolia:
	@echo "Deploying to Lisk Sepolia..."
	@forge script script/DeployAll.s.sol:DeployAll \
		--rpc-url https://rpc.sepolia-api.lisk.com \
		--broadcast \
		--verify

.PHONY: deploy-eth-sepolia
deploy-eth-sepolia:
	@echo "Deploying to Ethereum Sepolia..."
	@forge script script/DeployAll.s.sol:DeployAll \
		--rpc-url https://eth-sepolia.g.alchemy.com/v2/$(ALCHEMY_KEY) \
		--broadcast \
		--verify

# ============================================
# Utilities
# ============================================

.PHONY: abi
abi:
	@echo "Generating ABI files..."
	@mkdir -p abi
	@forge inspect RaynStable abi > abi/RaynStable.json
	@forge inspect UsernameRegistry abi > abi/UsernameRegistry.json
	@forge inspect GiveawayDistributor abi > abi/GiveawayDistributor.json
	@echo "✓ ABI files created in abi/ directory"

.PHONY: verify
verify:
	@echo "Verify contracts manually with:"
	@echo "forge verify-contract --chain-id CHAIN_ID CONTRACT_ADDRESS src/ContractName.sol:ContractName"

# ============================================
# Contract Interaction (Examples)
# ============================================

.PHONY: call-example
call-example:
	@echo "Example: Get RaynStable name"
	@cast call $(RAYN_STABLE_ADDRESS) "name()(string)" --rpc-url $(RPC_URL)

.PHONY: mint-tokens
mint-tokens:
	@echo "Minting test tokens..."
	@cast send $(RAYN_STABLE_ADDRESS) \
		"mint(address,uint256)" \
		$(RECIPIENT_ADDRESS) \
		$(AMOUNT) \
		--rpc-url $(RPC_URL) \
		--private-key $(PRIVATE_KEY)

# ============================================
# Setup & Installation
# ============================================

.PHONY: install
install:
	@echo "Installing dependencies..."
	@forge install

.PHONY: update
update:
	@echo "Updating dependencies..."
	@forge update

.PHONY: setup
setup:
	@echo "Setting up Rayn contracts environment..."
	@forge install
	@cp .env.example .env 2>/dev/null || echo "PRIVATE_KEY=\nRPC_URL=" > .env
	@echo "✓ Setup complete! Edit .env with your credentials"
