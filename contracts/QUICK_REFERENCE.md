# Rayn Smart Contracts - Quick Reference

## 🏗️ Build Status

✅ **All contracts compile successfully with Foundry**

```bash
cd contracts
forge build
```

---

## 📝 Contracts Summary

| Contract                | Location                      | Purpose          | Key Features                     |
| ----------------------- | ----------------------------- | ---------------- | -------------------------------- |
| **RaynStable**          | `src/RaynStable.sol`          | Test stablecoin  | 6 decimals, owner-only minting   |
| **UsernameRegistry**    | `src/UsernameRegistry.sol`    | Username mapping | Register/update/delete usernames |
| **GiveawayDistributor** | `src/GiveawayDistributor.sol` | Token giveaways  | Time-limited, fair distribution  |

---

## 🚀 Quick Start Examples

### 1. Deploy RaynStable (Testnet Faucet)

```solidity
RaynStable stable = new RaynStable();
stable.mint(userAddress, 100_000000); // Mint 100 RAYNS
```

### 2. Register Username

```solidity
UsernameRegistry registry = new UsernameRegistry();
registry.registerUsername("alice_crypto");
address alice = registry.resolveUsername("alice_crypto");
```

### 3. Create Giveaway

```solidity
GiveawayDistributor distributor = new GiveawayDistributor();

// Approve tokens first
IERC20(token).approve(address(distributor), 1000_000000);

// Create giveaway: 1000 USDC, 10 winners, 7 days
uint256 id = distributor.createGiveaway(
    tokenAddress,
    1000_000000,
    10,
    block.timestamp + 7 days,
    false
);
```

### 4. Claim from Giveaway

```solidity
distributor.claimReward(giveawayId);
// Automatically receives: totalAmount / winnersCount
```

---

## 🔑 Key Functions

### RaynStable

```solidity
mint(address to, uint256 amount)           // Owner only
mintToSelf(uint256 amount)                // Owner only
decimals() → uint8                        // Returns 6
```

### UsernameRegistry

```solidity
registerUsername(string username)
updateUsername(string newUsername)
deleteUsername()
resolveUsername(string username) → address
getUsernameOf(address user) → string
isUsernameAvailable(string username) → bool
```

### GiveawayDistributor

```solidity
createGiveaway(...) → uint256 giveawayId
claimReward(uint256 giveawayId)
endGiveaway(uint256 giveawayId)           // Creator/owner only
disposeGiveaway(uint256 giveawayId)       // Creator only, after end
announceWinners(uint256 id, address[] participants)  // Random selection
getRewardPerWinner(uint256 id) → uint256
isGiveawayExpired(uint256 id) → bool
```

---

## 📊 Giveaway Math

```
Reward Per Winner = Total Amount ÷ Winners Count

Example:
- Total Pool: 1000 USDC
- Winners: 10
- Each Winner Gets: 100 USDC
```

---

## ⚡ Common Patterns

### Send tokens to username

```solidity
address recipient = registry.resolveUsername("alice_crypto");
require(recipient != address(0), "Username not found");
token.transfer(recipient, amount);
```

### Check giveaway status

```solidity
Giveaway memory g = distributor.giveaways(giveawayId);
bool canClaim = g.active &&
                block.timestamp <= g.endTime &&
                !distributor.hasClaimed(giveawayId, msg.sender);
```

### Dispose unclaimed tokens

```solidity
// After giveaway ends
distributor.endGiveaway(giveawayId);
distributor.disposeGiveaway(giveawayId); // Returns leftover to creator
```

---

## 🛡️ Security Checklist

- ✅ ReentrancyGuard on state-changing functions
- ✅ SafeERC20 for all token transfers
- ✅ Ownable for admin functions
- ✅ Input validation on all parameters
- ✅ No integer overflow (Solidity 0.8+)
- ✅ Events for all critical actions

---

## ⚠️ Important Notes

1. **RaynStable is TESTNET ONLY** - Use real stablecoins in production
2. **Pseudo-randomness in GiveawayDistributor** - Integrate VRF for mainnet
3. **Username validation** - 3-20 chars, lowercase alphanumeric + underscores
4. **One claim per address** - Each user can claim once per giveaway
5. **Disposal after expiry** - Creator can only reclaim after giveaway ends

---

## 🧪 Testing Commands

```bash
# Run all tests
forge test

# Run with verbosity
forge test -vvv

# Run specific test file
forge test --match-path test/GiveawayDistributor.t.sol

# Gas report
forge test --gas-report
```

---

## 📦 Dependencies

```toml
# foundry.toml
remappings = [
    "@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/"
]
```

Installed libraries:

- OpenZeppelin Contracts v5.x
- Forge Standard Library

---

## 🎯 Next Steps

1. Write comprehensive test suites
2. Deploy to Lisk Sepolia testnet
3. Build frontend integration
4. Plan VRF integration for mainnet
5. Schedule security audit

---

**Built for Rayn 🚀**
