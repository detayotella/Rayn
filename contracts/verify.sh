#!/bin/bash

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "❌ .env file not found"
    exit 1
fi

# Check if API key is defined
if [ -z "$ETHERSCAN_API_KEY" ]; then
    echo "❌ Error: ETHERSCAN_API_KEY not defined in .env"
    exit 1
fi

echo "🔍 Verifying contracts on Lisk Sepolia..."
echo "📡 API Key: ${ETHERSCAN_API_KEY:0:10}..."
echo ""

# RaynStable
echo "📝 Verifying RaynStable..."
forge verify-contract \
  0xDcf050285a799389dE82B02bf9283246dD781f13 \
  src/RaynStable.sol:RaynStable \
  --rpc-url https://rpc.sepolia-api.lisk.com \
  --verifier blockscout \
  --verifier-url https://sepolia-blockscout.lisk.com/api \
  --etherscan-api-key $ETHERSCAN_API_KEY

if [ $? -eq 0 ]; then
    echo "✅ RaynStable verified successfully"
else
    echo "⚠️  RaynStable: verification failed or already verified"
fi

echo ""
sleep 3

# UsernameRegistry
echo "📝 Verifying UsernameRegistry..."
forge verify-contract \
  0x6610d9AF8DA15b62edeC19E2E4faEb378A564CC0 \
  src/UsernameRegistry.sol:UsernameRegistry \
  --rpc-url https://rpc.sepolia-api.lisk.com \
  --verifier blockscout \
  --verifier-url https://sepolia-blockscout.lisk.com/api \
  --etherscan-api-key $ETHERSCAN_API_KEY

if [ $? -eq 0 ]; then
    echo "✅ UsernameRegistry verified successfully"
else
    echo "⚠️  UsernameRegistry: verification failed or already verified"
fi

echo ""
sleep 3

# GiveawayDistributor
echo "📝 Verifying GiveawayDistributor..."
forge verify-contract \
  0x3b6e2Cf8E4b4b27188BccA88FfcC5B505742a803 \
  src/GiveawayDistributor.sol:GiveawayDistributor \
  --rpc-url https://rpc.sepolia-api.lisk.com \
  --verifier blockscout \
  --verifier-url https://sepolia-blockscout.lisk.com/api \
  --etherscan-api-key $ETHERSCAN_API_KEY

if [ $? -eq 0 ]; then
    echo "✅ GiveawayDistributor verified successfully"
else
    echo "⚠️  GiveawayDistributor: verification failed or already verified"
fi

echo ""
sleep 3

# RaynPaymentRouter (with constructor args)
echo "📝 Verifying RaynPaymentRouter..."
CONSTRUCTOR_ARGS=$(cast abi-encode "constructor(address)" "0xDcf050285a799389dE82B02bf9283246dD781f13")

forge verify-contract \
  0xad3F6c7d78abD646104259c527C6092C3f8Dd52C \
  src/RaynPaymentRouter.sol:RaynPaymentRouter \
  --rpc-url https://rpc.sepolia-api.lisk.com \
  --verifier blockscout \
  --verifier-url https://sepolia-blockscout.lisk.com/api \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  --constructor-args $CONSTRUCTOR_ARGS

if [ $? -eq 0 ]; then
    echo "✅ RaynPaymentRouter verified successfully"
else
    echo "⚠️  RaynPaymentRouter: verification failed or already verified"
fi

echo ""
echo "✅ Verification process completed!"
echo ""
echo "📋 Check your contracts on Blockscout:"
echo "   🔗 RaynStable: https://sepolia-blockscout.lisk.com/address/0xDcf050285a799389dE82B02bf9283246dD781f13"
echo "   🔗 UsernameRegistry: https://sepolia-blockscout.lisk.com/address/0x6610d9AF8DA15b62edeC19E2E4faEb378A564CC0"
echo "   🔗 GiveawayDistributor: https://sepolia-blockscout.lisk.com/address/0x3b6e2Cf8E4b4b27188BccA88FfcC5B505742a803"
echo "   🔗 RaynPaymentRouter: https://sepolia-blockscout.lisk.com/address/0xad3F6c7d78abD646104259c527C6092C3f8Dd52C"