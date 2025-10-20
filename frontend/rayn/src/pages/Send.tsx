import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { X, User, AlertCircle } from "lucide-react";
import { useWallet } from "../context/WalletContext";
import Logo from "../assets/Logo.png";
import { useApp } from "../context/AppContext";
import { ethers } from "ethers";
import AppLayout from "../components/layout/AppLayout";

interface RecipientValidation {
  isValid: boolean;
  isValidating: boolean;
  resolvedAddress: string | null;
  error: string | null;
  type: "username" | "address" | null;
}

interface TokenApproval {
  isApproved: boolean;
  isApproving: boolean;
  approvalAmount: string;
  error: string | null;
}

const Send: React.FC = () => {
  const navigate = useNavigate();
  const { addTransaction, addNotification, isLoading, setIsLoading, user } =
    useApp();
  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [recipientValidation, setRecipientValidation] =
    useState<RecipientValidation>({
      isValid: false,
      isValidating: false,
      resolvedAddress: null,
      error: null,
      type: null,
    });
  const [tokenApproval, setTokenApproval] = useState<TokenApproval>({
    isApproved: false,
    isApproving: false,
    approvalAmount: "0",
    error: null,
  });

  const {
    isWalletConnected,
    raynPaymentContract,
    raynStableContract,
    usernameRegContract,
    initializeContracts,
    account,
  } = useWallet();

  // Reset validation when recipient changes
  useEffect(() => {
    setRecipientValidation({
      isValid: false,
      isValidating: false,
      resolvedAddress: null,
      error: null,
      type: null,
    });
    setError("");
  }, [recipient]);

  // Reset approval when amount changes
  useEffect(() => {
    setTokenApproval((prev) => ({
      ...prev,
      isApproved: false,
      error: null,
    }));
  }, [amount]);

  // Validate recipient (username or address)
  useEffect(() => {
    const validateRecipient = async () => {
      if (!recipient.trim() || !usernameRegContract) {
        return;
      }

      const cleanRecipient = recipient.trim();
      setRecipientValidation((prev) => ({
        ...prev,
        isValidating: true,
        error: null,
      }));

      try {
        console.log(`🔍 Validating recipient: ${cleanRecipient}`);

        // Check if it's an Ethereum address format
        if (cleanRecipient.startsWith("0x") && cleanRecipient.length === 42) {
          try {
            const checksumAddress = ethers.getAddress(cleanRecipient);
            console.log(`✅ Valid Ethereum address: ${checksumAddress}`);

            setRecipientValidation({
              isValid: true,
              isValidating: false,
              resolvedAddress: checksumAddress,
              error: null,
              type: "address",
            });
            return;
          } catch (addressError) {
            console.log(`❌ Invalid Ethereum address format`);
            setRecipientValidation({
              isValid: false,
              isValidating: false,
              resolvedAddress: null,
              error: "Invalid Ethereum address format",
              type: null,
            });
            return;
          }
        }

        // Clean username (remove @ if present)
        const cleanUsername = cleanRecipient.startsWith("@")
          ? cleanRecipient
            .slice(1)
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, "")
          : cleanRecipient.toLowerCase().replace(/[^a-z0-9_]/g, "");

        if (cleanUsername.length < 3) {
          setRecipientValidation({
            isValid: false,
            isValidating: false,
            resolvedAddress: null,
            error: "Username must be at least 3 characters long",
            type: null,
          });
          return;
        }

        // Check if contract is initialized
        if (!usernameRegContract) {
          setRecipientValidation({
            isValid: false,
            isValidating: false,
            resolvedAddress: null,
            error: "Username registry not initialized. Please ensure your wallet is connected.",
            type: null,
          });
          return;
        }

        // Check if username exists in registry
        const resolvedAddress = await usernameRegContract.resolveUsername(
          cleanUsername
        );
        const usernameExists =
          resolvedAddress !== "0x0000000000000000000000000000000000000000";

        console.log(
          `📝 Username check result: ${usernameExists ? "Found" : "Not found"}`
        );
        console.log(`   Username: ${cleanUsername}`);
        console.log(`   Resolved: ${resolvedAddress}`);

        if (!usernameExists) {
          setRecipientValidation({
            isValid: false,
            isValidating: false,
            resolvedAddress: null,
            error: `Username @${cleanUsername} not found. Please check the username or use a wallet address.`,
            type: null,
          });
          return;
        }

        // Check if sending to self
        if (resolvedAddress.toLowerCase() === account?.toLowerCase()) {
          setRecipientValidation({
            isValid: false,
            isValidating: false,
            resolvedAddress: null,
            error: "You cannot send tokens to yourself",
            type: null,
          });
          return;
        }

        // Success
        setRecipientValidation({
          isValid: true,
          isValidating: false,
          resolvedAddress: resolvedAddress,
          error: null,
          type: "username",
        });
      } catch (error) {
        console.error("❌ Recipient validation error:", error);
        setRecipientValidation({
          isValid: false,
          isValidating: false,
          resolvedAddress: null,
          error: "Unable to validate recipient. Please try again.",
          type: null,
        });
      }
    };

    // Debounce validation
    const timeoutId = setTimeout(validateRecipient, 800);
    return () => clearTimeout(timeoutId);
  }, [recipient, usernameRegContract, account]);

  // Check token approval
  const checkApproval = async () => {
    if (!raynStableContract || !raynPaymentContract || !account || !amount) {
      return;
    }

    try {
      const amountInWei = ethers.parseUnits(amount, 6);
      const paymentRouterAddress = await raynPaymentContract.getAddress();
      const currentAllowance = await raynStableContract.allowance(
        account,
        paymentRouterAddress
      );

      console.log(`💳 Checking approval:`);
      console.log(`   Amount needed: ${amountInWei.toString()}`);
      console.log(`   Current allowance: ${currentAllowance.toString()}`);

      const isApproved = currentAllowance >= amountInWei;

      setTokenApproval((prev) => ({
        ...prev,
        isApproved,
        approvalAmount: currentAllowance.toString(),
      }));
    } catch (error) {
      console.error("❌ Error checking approval:", error);
      setTokenApproval((prev) => ({
        ...prev,
        error: "Unable to check token approval",
      }));
    }
  };

  // Approve tokens
  const handleApprove = async () => {
    if (!raynStableContract || !raynPaymentContract || !amount) {
      return;
    }

    setTokenApproval((prev) => ({ ...prev, isApproving: true, error: null }));

    try {
      const amountInWei = ethers.parseUnits(amount, 6);
      const paymentRouterAddress = await raynPaymentContract.getAddress();

      console.log(`🔐 Requesting token approval for ${amount} RAYNS`);

      addNotification({
        type: "info",
        title: "Approval Required",
        message: "Please approve the token spending in your wallet...",
      });

      const approveTx = await raynStableContract.approve(
        paymentRouterAddress,
        amountInWei
      );

      addNotification({
        type: "info",
        title: "Approval Pending",
        message:
          "Token approval transaction submitted. Waiting for confirmation...",
      });

      await approveTx.wait();

      console.log(`✅ Token approval successful`);

      setTokenApproval((prev) => ({
        ...prev,
        isApproved: true,
        isApproving: false,
        approvalAmount: amountInWei.toString(),
      }));

      addNotification({
        type: "success",
        title: "Approval Successful",
        message: "Tokens approved! You can now send the payment.",
      });
    } catch (error: any) {
      console.error("❌ Approval failed:", error);

      let errorMessage = "Token approval failed. Please try again.";
      if (error.code === 4001) {
        errorMessage = "Token approval was cancelled by user.";
      }

      setTokenApproval((prev) => ({
        ...prev,
        isApproving: false,
        error: errorMessage,
      }));

      addNotification({
        type: "error",
        title: "Approval Failed",
        message: errorMessage,
      });
    }
  };

  const handleRecipientChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setRecipient(e.target.value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleNoteChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setNote(e.target.value);
  };

  const handleSend = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");

    // Validation
    if (!recipientValidation.isValid) {
      setError("Please enter a valid recipient");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    const numAmount = parseFloat(amount);
    if (user && numAmount > user.balance) {
      setError("Insufficient balance");
      return;
    }

    if (!isWalletConnected || !raynPaymentContract || !raynStableContract) {
      await initializeContracts();
      setError("Please ensure your wallet is connected and try again");
      return;
    }

    // Check approval first
    await checkApproval();

    if (!tokenApproval.isApproved) {
      addNotification({
        type: "warning",
        title: "Approval Required",
        message:
          'You need to approve token spending before sending. Click the "Approve Tokens" button below.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const amountInWei = ethers.parseUnits(amount, 6);
      const finalRecipient =
        recipientValidation.type === "username"
          ? recipient.startsWith("@")
            ? recipient.slice(1)
            : recipient
          : recipient;
      const finalNote = note || "";

      console.log(`🚀 Sending payment:`);
      console.log(
        `   To: ${finalRecipient} (${recipientValidation.resolvedAddress})`
      );
      console.log(`   Amount: ${amount} RAYNS (${amountInWei.toString()} wei)`);
      console.log(`   Note: ${finalNote}`);

      addNotification({
        type: "info",
        title: "Sending Payment",
        message: "Please confirm the transaction in your wallet...",
      });

      const tokenAddress = await raynStableContract.getAddress();
      const sendTx = await raynPaymentContract.sendToUsername(
        tokenAddress,
        finalRecipient,
        amountInWei,
        finalNote
      );

      addNotification({
        type: "info",
        title: "Transaction Submitted",
        message: "Your payment is being processed on the blockchain...",
      });

      console.log(`⏳ Transaction submitted. Hash: ${sendTx.hash}`);

      const receipt = await sendTx.wait();

      console.log(`✅ Payment successful! Block: ${receipt.blockNumber}`);

      // Add transaction to history
      addTransaction({
        amount: numAmount,
        description: `Sent to ${recipientValidation.type === "username"
            ? "@" + finalRecipient
            : finalRecipient
          }`,
        time: "Just now",
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
        type: "sent",
        recipient: finalRecipient,
      });

      // Show success notification
      addNotification({
        type: "success",
        title: "Payment Sent!",
        message: `Successfully sent ${amount} RAYNS to ${recipientValidation.type === "username"
            ? "@" + finalRecipient
            : finalRecipient
          }`,
      });

      // Navigate back to dashboard
      navigate("/dashboard");
    } catch (error: any) {
      console.error("❌ Send transaction failed:", error);

      let errorMessage = "Payment failed. Please try again.";

      if (error.code === 4001) {
        errorMessage = "Transaction was cancelled by user.";
      } else if (error.code === "CALL_EXCEPTION") {
        if (error.reason?.includes("invalid recipient")) {
          errorMessage =
            "Invalid recipient. Please check the username or address.";
        } else if (error.reason?.includes("insufficient allowance")) {
          errorMessage =
            "Insufficient token allowance. Please approve tokens again.";
        } else if (error.reason?.includes("transfer amount exceeds balance")) {
          errorMessage = "Insufficient balance to complete this transaction.";
        } else {
          errorMessage = `Transaction failed: ${error.reason || error.message}`;
        }
      }

      addNotification({
        type: "error",
        title: "Payment Failed",
        message: errorMessage,
      });

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getRecipientValidationMessage = () => {
    if (recipientValidation.error) {
      return (
        <div className="text-red-400 text-xs mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {recipientValidation.error}
        </div>
      );
    }

    if (recipientValidation.isValidating) {
      return (
        <div className="text-blue-400 text-xs mt-1 flex items-center gap-1">
          <span className="animate-spin">⏳</span>
          Validating recipient...
        </div>
      );
    }

    if (recipientValidation.isValid && recipientValidation.resolvedAddress) {
      return (
        <div className="text-green-400 text-xs mt-1">
          ✅{" "}
          {recipientValidation.type === "username"
            ? "Username found"
            : "Valid address"}
          : {recipientValidation.resolvedAddress.slice(0, 8)}...
          {recipientValidation.resolvedAddress.slice(-6)}
        </div>
      );
    }

    return null;
  };

  const canProceed =
    recipientValidation.isValid &&
    amount &&
    parseFloat(amount) > 0 &&
    !recipientValidation.isValidating;

  return (
    <AppLayout>
      {/* Page Header */}
      <header className="border-b border-purple-900/30 bg-[#1a0b2e]/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Page Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="lg:hidden p-2 hover:bg-purple-900/30 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate("/")}
                className="lg:hidden flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <img
                  src={Logo}
                  alt="Rayn logo"
                  className="w-8 h-8 object-contain"
                />
                <span className="text-xl font-bold">Rayn</span>
              </button>
              <h1 className="hidden lg:block text-2xl font-bold text-white">
                Send Money
              </h1>
            </div>

            {/* Close Button - Desktop */}
            <button
              onClick={() => navigate("/dashboard")}
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-purple-900/30 transition-colors"
            >
              <X className="w-5 h-5" />
              <span>Close</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12">
        {/* Title Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            Send
          </h1>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg">
            Send stablecoins to anyone instantly.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSend} className="space-y-6 sm:space-y-8">
          {/* Error Message */}
          {error && (
            <div className="bg-red-900/40 border border-red-700/30 rounded-xl p-4 text-red-200 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* To Field */}
          <div>
            <label className="block text-sm sm:text-base font-medium mb-3">
              To
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={recipient}
                onChange={handleRecipientChange}
                placeholder="@username or wallet address"
                className={`w-full bg-[#1e1533] border rounded-xl sm:rounded-2xl py-4 sm:py-5 pl-12 pr-4 text-base sm:text-lg text-white placeholder-gray-500 focus:outline-none transition-colors ${recipientValidation.error
                    ? "border-red-500/50 focus:border-red-500"
                    : recipientValidation.isValid
                      ? "border-green-500/50 focus:border-green-500"
                      : "border-purple-900/30 focus:border-purple-600/50"
                  }`}
              />
            </div>
            {getRecipientValidationMessage()}
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-sm sm:text-base font-medium mb-3">
              Amount
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg sm:text-xl">
                $
              </div>
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="w-full bg-[#1e1533] border border-purple-900/30 rounded-xl sm:rounded-2xl py-4 sm:py-5 pl-12 pr-4 text-base sm:text-lg text-white placeholder-gray-500 text-right focus:outline-none focus:border-purple-600/50 transition-colors"
              />
            </div>
          </div>

          {/* Note Field */}
          <div>
            <label className="block text-sm sm:text-base font-medium mb-3">
              Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={handleNoteChange}
              placeholder="What's this for?"
              rows={4}
              className="w-full bg-[#1e1533] border border-purple-900/30 rounded-xl sm:rounded-2xl py-4 px-4 text-base sm:text-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-600/50 transition-colors resize-none"
            />
          </div>

          {/* Approval Section */}
          {canProceed && amount && (
            <div className="bg-purple-900/20 border border-purple-700/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Token Approval</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${tokenApproval.isApproved
                      ? "bg-green-900/40 text-green-300"
                      : "bg-orange-900/40 text-orange-300"
                    }`}
                >
                  {tokenApproval.isApproved ? "Approved" : "Required"}
                </span>
              </div>

              {!tokenApproval.isApproved && (
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={tokenApproval.isApproving}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-medium py-3 px-4 rounded-lg transition-colors text-sm"
                >
                  {tokenApproval.isApproving
                    ? "Approving..."
                    : "Approve Tokens"}
                </button>
              )}

              {tokenApproval.error && (
                <div className="text-red-400 text-xs mt-2">
                  {tokenApproval.error}
                </div>
              )}
            </div>
          )}

          {/* Send Button */}
          <button
            type="submit"
            disabled={!canProceed || isLoading || !tokenApproval.isApproved}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 sm:py-5 px-6 rounded-xl sm:rounded-2xl text-base sm:text-lg md:text-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-purple-500/30"
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </form>
      </main>
    </AppLayout>
  );
};

export default Send;
