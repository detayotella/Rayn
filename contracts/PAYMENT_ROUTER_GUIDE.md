# RaynPaymentRouter - Complete Usage Guide

## 🎯 Overview

**RaynPaymentRouter** enables username-based token transfers that match your frontend design exactly:

✅ **@username or wallet address** - Flexible recipient input  
✅ **Amount** - Token amount to send  
✅ **Note (Optional)** - Attach messages to transfers  
✅ **Gas efficient** - Optimized for low fees  
✅ **Multi-token support** - Works with any ERC-20

---

## 📦 Contract Features

### 1. **Flexible Recipient Input**

Users can send to:

- **Usernames**: `"alice_crypto"` or `"@alice_crypto"`
- **Wallet addresses**: `"0x1234..."`
- **Auto-detection**: Contract automatically determines input type

### 2. **Optional Notes/Memos**

Every transfer can include a note:

- `"Coffee ☕"`
- `"Thanks for lunch!"`
- `"Birthday gift 🎂"`
- Empty string `""` for no note

### 3. **Batch Payments**

Send to multiple recipients in one transaction with individual notes

---

## 🚀 Frontend Integration

### Function Signature (Matches Your UI)

```solidity
function sendToUsername(
    address token,              // Token contract address (e.g., RaynStable, USDC)
    string memory recipientIdentifier,  // "@username" or "0x..." or "username"
    uint256 amount,             // Amount in smallest units (e.g., 100000000 for 100 tokens with 6 decimals)
    string memory note          // Optional note: "What's this for?"
) external
```

---

## 💻 Frontend Implementation Example

### Complete React/TypeScript Integration

```typescript
import { ethers } from "ethers";

// Contract ABIs (simplified for example)
const PAYMENT_ROUTER_ABI = [
  "function sendToUsername(address token, string recipientIdentifier, uint256 amount, string note) external",
  "function validateRecipient(string username) external view returns (bool isValid, address recipientAddress, string recipientUsername)",
];

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function decimals() external view returns (uint8)",
  "function balanceOf(address account) external view returns (uint256)",
];

// Contract addresses (from deployment)
const PAYMENT_ROUTER_ADDRESS = "0x..."; // Your deployed RaynPaymentRouter
const RAYN_STABLE_ADDRESS = "0x..."; // Your deployed RaynStable (or any ERC-20)

// Connect to contracts
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const paymentRouter = new ethers.Contract(
  PAYMENT_ROUTER_ADDRESS,
  PAYMENT_ROUTER_ABI,
  signer
);
const raynStable = new ethers.Contract(RAYN_STABLE_ADDRESS, ERC20_ABI, signer);

// Send function that matches your UI
async function sendTokens(recipientInput, amountUSD, note) {
  try {
    // Step 1: Get token decimals
    const decimals = await raynStable.decimals();

    // Step 2: Convert USD amount to token amount with decimals
    // e.g., 100 USD => 100000000 (for 6 decimals)
    const amountWithDecimals = ethers.parseUnits(amountUSD, decimals);

    // Step 3: Validate recipient (optional but recommended)
    const [isValid, recipientAddress, recipientUsername] =
      await paymentRouter.validateRecipient(recipientInput);

    if (!isValid) {
      throw new Error(
        "Invalid recipient: Username not found or invalid address"
      );
    }

    console.log(`Sending to: ${recipientUsername || recipientAddress}`);

    // Step 4: Approve payment router to spend tokens
    console.log("Requesting approval...");
    const approveTx = await raynStable.approve(
      PAYMENT_ROUTER_ADDRESS,
      amountWithDecimals
    );
    await approveTx.wait();
    console.log("✅ Approval confirmed");

    // Step 5: Send tokens with note
    console.log("Sending tokens...");
    const sendTx = await paymentRouter.sendToUsername(
      RAYN_STABLE_ADDRESS,
      recipientInput,
      amountWithDecimals,
      note || "" // Empty string if no note
    );

    const receipt = await sendTx.wait();
    console.log("✅ Transfer successful!", receipt.hash);

    return {
      success: true,
      txHash: receipt.hash,
      recipient: recipientAddress,
      amount: amountUSD,
      note: note,
    };
  } catch (error) {
    console.error("Transfer failed:", error);
    throw error;
  }
}

// Example usage in your Send component
export default function Send() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      const result = await sendTokens(recipient, amount, note);
      alert(`✅ Sent ${amount} to ${recipient}\nTx: ${result.txHash}`);

      // Reset form
      setRecipient("");
      setAmount("");
      setNote("");
    } catch (error) {
      alert(`❌ Transfer failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Your existing UI
    <button onClick={handleSend} disabled={loading}>
      {loading ? "Sending..." : "Send"}
    </button>
  );
}
```

---

## 📝 Usage Examples

### Example 1: Send to Username with Note

```javascript
// Send 100 RAYNS to @alice_crypto with a note
await paymentRouter.sendToUsername(
  raynStableAddress,
  "@alice_crypto", // or just "alice_crypto"
  100_000000, // 100 RAYNS (6 decimals)
  "Coffee money ☕"
);
```

### Example 2: Send to Address without Note

```javascript
// Send 50 RAYNS to wallet address
await paymentRouter.sendToUsername(
  raynStableAddress,
  "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
  50_000000,
  "" // No note
);
```

### Example 3: Validate Before Sending

```javascript
// Check if recipient is valid before sending
const [isValid, address, username] = await paymentRouter.validateRecipient(
  "alice_crypto"
);

if (isValid) {
  console.log(`Will send to: ${username} (${address})`);
  // Proceed with transfer
} else {
  console.error("Invalid recipient!");
}
```

### Example 4: Batch Payment with Notes

```javascript
const recipients = ["alice_crypto", "bob_wallet", "@charlie_xyz"];
const amounts = [100_000000, 200_000000, 150_000000];
const notes = ["Coffee", "Lunch", "Dinner"];

await paymentRouter.batchSendToUsernames(
  raynStableAddress,
  recipients,
  amounts,
  notes
);
```

---

## 🎨 Frontend UI States

### 1. **Initial State** (Empty)

```
To: @username or wallet address
Amount: 0.00
Note: What's this for?
[Send Button - Disabled]
```

### 2. **Typing Username** (Validation)

```
To: @alice_cryp... (validating...)
Amount: 100.00
Note: Coffee
[Send Button - Disabled]
```

### 3. **Valid Recipient** (Ready)

```
To: @alice_crypto ✓ (0x1234...)
Amount: 100.00
Note: Coffee ☕
[Send Button - Enabled]
```

### 4. **Sending** (Transaction)

```
To: @alice_crypto ✓
Amount: 100.00
Note: Coffee ☕
[Sending... 🔄]
```

### 5. **Success**

```
✅ Sent 100 RAYNS to @alice_crypto
Transaction: 0xabc...def
[View Transaction]
```

---

## 🔔 Event Listening (For Transaction History)

```javascript
// Listen for transfers from your address
paymentRouter.on(
  "TokensSentToUsername",
  (token, from, toUsername, toAddress, amount, note, event) => {
    if (from === userAddress) {
      console.log(`You sent ${ethers.formatUnits(amount, 6)} to ${toUsername}`);
      console.log(`Note: ${note}`);

      // Update UI with transaction
      addToHistory({
        type: "sent",
        recipient: toUsername,
        amount: ethers.formatUnits(amount, 6),
        note: note,
        txHash: event.transactionHash,
        timestamp: Date.now(),
      });
    }
  }
);

// Listen for transfers to your address
paymentRouter.on(
  "TokensSentToUsername",
  (token, from, toUsername, toAddress, amount, note, event) => {
    if (toAddress === userAddress) {
      console.log(`You received ${ethers.formatUnits(amount, 6)} from ${from}`);
      console.log(`Note: ${note}`);

      // Update UI with transaction
      addToHistory({
        type: "received",
        sender: from,
        amount: ethers.formatUnits(amount, 6),
        note: note,
        txHash: event.transactionHash,
        timestamp: Date.now(),
      });
    }
  }
);
```

---

## ⚡ Gas Estimation

```javascript
// Estimate gas for a transfer
const gasEstimate = await paymentRouter.sendToUsername.estimateGas(
  raynStableAddress,
  "alice_crypto",
  100_000000,
  "Test note"
);

console.log(`Estimated gas: ${gasEstimate.toString()}`);

// Get gas price
const gasPrice = await provider.getFeeData();
console.log(`Gas price: ${ethers.formatUnits(gasPrice.gasPrice, "gwei")} gwei`);

// Calculate total cost
const totalCost = gasEstimate * gasPrice.gasPrice;
console.log(`Estimated cost: ${ethers.formatEther(totalCost)} ETH`);
```

---

## 🛡️ Error Handling

```javascript
try {
  await paymentRouter.sendToUsername(token, recipient, amount, note);
} catch (error) {
  if (error.message.includes("username not registered")) {
    alert("⚠️ Username not found. Please check the spelling.");
  } else if (error.message.includes("invalid recipient")) {
    alert("⚠️ Invalid recipient. Enter a valid username or address.");
  } else if (error.message.includes("cannot send to yourself")) {
    alert("⚠️ You cannot send tokens to yourself.");
  } else if (error.message.includes("insufficient allowance")) {
    alert("⚠️ Please approve the transaction first.");
  } else if (error.code === "ACTION_REJECTED") {
    alert("❌ Transaction cancelled by user.");
  } else {
    alert(`❌ Transfer failed: ${error.message}`);
  }
}
```

---

## 📊 Transaction History Query

```javascript
// Get past transactions
const filter = paymentRouter.filters.TokensSentToUsername(null, userAddress);
const events = await paymentRouter.queryFilter(filter, -10000); // Last 10k blocks

const transactions = events.map((event) => ({
  token: event.args.token,
  from: event.args.from,
  toUsername: event.args.toUsername,
  toAddress: event.args.toAddress,
  amount: ethers.formatUnits(event.args.amount, 6),
  note: event.args.note,
  txHash: event.transactionHash,
  blockNumber: event.blockNumber,
}));

console.log("Your transaction history:", transactions);
```

---

## 🔑 Key Frontend Functions Summary

| Function                | Purpose                            | Parameters                         |
| ----------------------- | ---------------------------------- | ---------------------------------- |
| `validateRecipient()`   | Check if username/address is valid | `(string recipient)`               |
| `sendToUsername()`      | Send tokens with note              | `(token, recipient, amount, note)` |
| `getUsernameOf()`       | Get username from address          | `(address user)`                   |
| `resolveUsername()`     | Get address from username          | `(string username)`                |
| `calculateBatchTotal()` | Calculate total for batch          | `(uint256[] amounts)`              |

---

## 🎯 Complete Frontend Checklist

### Before Deployment

- [ ] Deploy RaynPaymentRouter contract
- [ ] Save contract address to `.env`
- [ ] Generate contract ABI
- [ ] Test on testnet

### Frontend Integration

- [ ] Import contract ABIs
- [ ] Connect wallet (MetaMask/WalletConnect)
- [ ] Implement approval flow
- [ ] Implement send function
- [ ] Add recipient validation
- [ ] Display gas estimates
- [ ] Handle errors gracefully
- [ ] Show transaction status
- [ ] Update balance after transfer
- [ ] Store transaction history

### User Experience

- [ ] Real-time recipient validation
- [ ] Show resolved address for usernames
- [ ] Confirm before sending
- [ ] Loading states during transactions
- [ ] Success/error notifications
- [ ] Transaction receipt display
- [ ] Link to block explorer

---

## 🚀 Ready to Go!

Your contract now perfectly matches your frontend design:

```
Frontend Input → Contract Function
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
@username       → sendToUsername(token, "@username", amount, note)
0x1234...       → sendToUsername(token, "0x1234...", amount, note)
$100.00         → Convert to token units with decimals
"Coffee"        → Stored in note parameter
```

**Deploy, integrate, and you're ready to send! 🎉**
