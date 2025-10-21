# Rayn - PocketApp On-Chain

> Empowering African users with seamless, decentralized stablecoin transactions

## 🌍 Overview

Rayn is a mobile-first decentralized application (DApp) that enables African users to send, receive, and manage stablecoins with the simplicity of mobile money. Built on the Lisk blockchain, Rayn addresses the high costs and limited access of traditional banking by offering low-cost, borderless financial transactions with fees under 1%.

### Key Highlights

- **Effortless P2P Transfers**: Send money using simple @usernames instead of complex wallet addresses
- **Community-Driven**: Giveaway system and referral rewards to boost viral adoption
- **Mobile-First**: Optimized for low-bandwidth environments and basic smartphones
- **Ultra-Low Fees**: Transaction costs under 1% compared to 5-7% for traditional remittances
- **Targeting the $80B African remittance market**

## ✨ Features

### Core Functionality

- **Username-Based Addressing**: Transfer funds using intuitive @handles instead of wallet addresses
- **Send & Receive Stablecoins**: Fast, affordable P2P transfers with real-time notifications
- **Giveaway/Airdrop System**: Any user can create public or private stablecoin giveaways to promote adoption
- **Payment Requests**: Generate shareable QR codes or links for collecting payments
- **Transaction History**: View all transactions with local currency conversions (NGN, GHS, ZAR, etc.)
- **Referral Rewards**: Earn stablecoins by inviting friends to join the platform

## 🛠️ Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Blockchain** | Lisk L2 | SDK 2.0.0 |
| **Smart Contracts** | Solidity | 0.8.31 |
| **Frontend** | React | 19.2.0 |
| **Web3 Library** | viem | 2.37.11 |
| **Wallet Integration** | wagmi | 2.18.0 |
| **Runtime** | Node.js | 24.10.0 |
| **Price Oracle** | Gelato Network | Latest |

## 🏗️ Architecture

### Smart Contracts

1. **AfroStable.sol**: Custom ERC20 stablecoin token for transactions
2. **UsernameRegistry.sol**: Maps @usernames to wallet addresses
3. **GiveawayDistributor.sol**: Manages token distributions for giveaways and referrals

### Key Design Principles

- **Security**: Built with OpenZeppelin audited contracts
- **Gas Optimization**: Efficient operations for low-cost transactions
- **EVM Compatibility**: Leverages Lisk's EVM layer
- **Decentralized**: No backend servers, fully on-chain

## 🚀 Getting Started

### Prerequisites

- Node.js 24.10.0 or higher
- npm or yarn package manager
- MetaMask or compatible Web3 wallet
- Lisk Sepolia testnet tokens (from [faucet](https://sepolia-faucet.lisk.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/detayotella/Rayn.git
cd Rayn

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Lisk RPC URL and private keys
```

### Smart Contract Deployment

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Lisk Sepolia testnet
npx hardhat run scripts/deploy.js --network lisk-sepolia

# Verify contracts
npx hardhat verify --network lisk-sepolia <CONTRACT_ADDRESS>
```

### Frontend Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 User Workflows

### Onboarding
1. Create non-custodial wallet with secure seed phrase
2. Register unique @username
3. Complete verification (optional)
4. Claim welcome giveaway
5. Start transacting!

### Sending Money
1. Select "Send" from home screen
2. Enter recipient's @username and amount
3. Add optional note
4. Confirm with PIN/biometrics
5. Receive instant confirmation

### Creating a Giveaway
1. Navigate to Giveaways section
2. Set total amount and participant limit
3. Choose public or private (with PIN)
4. Share link with community
5. Track claims in real-time

## 💰 Business Model

### Transaction Fees
- **Gas Fees**: ~$0.01-$0.03 per transaction (paid in LSK)
- **Platform Fee**: 0% for MVP, 0.1%-0.2% post-MVP
- **Total Cost**: Under 1% for most transactions

### Revenue Streams (Post-MVP)
- Nominal platform transaction fees
- Premium features (analytics, priority support)
- Merchant partnerships and sponsored giveaways

## 🌐 Supported Environments

- **Mobile**: Android 8.0+, iOS 14+
- **Web**: Progressive Web App (PWA) for Chrome/Firefox
- **Network**: Functional on 2G/3G networks with offline mode
- **Hardware**: Minimum 2GB RAM, 1.5GHz processor

## 🔒 Security

- Non-custodial wallets (users control private keys)
- ReentrancyGuard protection on smart contracts
- Biometric authentication support
- Transparent gas fee estimation
- No browser storage APIs (uses React state for Claude.ai compatibility)

## 🗺️ Roadmap

### MVP (Week 1) ✅
- Core P2P transfers
- Username registry
- Giveaway system
- Transaction history
- Referral rewards

### Phase 2 (Post-MVP)
- Governance token introduction
- Merchant integrations
- Advanced analytics
- Multi-currency support
- Mobile app (iOS/Android)

### Phase 3 (Long-term)
- Bill payment integrations
- Savings/lending features
- Cross-chain bridges
- Regional expansion beyond Africa

## 🤝 Contributing

We welcome contributions from the community! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website**: [Coming Soon]
- **Documentation**: [Lisk Documentation](https://lisk.com/documentation/)
- **Twitter**: [@RaynApp]
- **Discord**: [Join Community]
- **Lisk Explorer**: [View Contracts](https://sepolia-blockscout.lisk.com/)

## 📞 Support

- **Email**: support@rayn.app
- **GitHub Issues**: [Report Bug](https://github.com/detayotella/Rayn/issues)
- **Community Chat**: [Discord Server]

## 🙏 Acknowledgments

- Lisk Foundation for blockchain infrastructure
- OpenZeppelin for secure smart contract libraries
- African crypto communities for inspiration and feedback
- All contributors and early adopters

## 📊 Project Status

**Current Version**: MVP (v0.1.0)  
**Status**: Active Development 🚀  
**Network**: Lisk Sepolia Testnet  
**Target Launch**: Q4 2025

---

**Built by the Rayn Team**
- Tella Adetayo
- Iyanuoluwa Owoseni
- Nwajei Valerie
- Ifeoluwa Sanni
- Marvellous Nwaokobia
- Mintoumba Caleb


*Making crypto as simple as mobile money*
