import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { X, Link2, CheckCircle, User, AlertCircle } from "lucide-react";
import Logo from "../assets/Logo.png";
import { useApp } from "../context/AppContext";
import { useWallet } from "../context/WalletContext";
import AppLayout from "../components/layout/AppLayout";

interface UsernameValidation {
  isValid: boolean;
  isValidating: boolean;
  resolvedAddress: string | null;
  error: string | null;
}

export default function Receive(): React.JSX.Element {
  const navigate = useNavigate();
  const { user, addNotification } = useApp();
  const { usernameRegContract, isWalletConnected } = useWallet();
  const [username, setUsername] = useState<string>(user?.username || "");
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [validation, setValidation] = useState<UsernameValidation>({
    isValid: false,
    isValidating: false,
    resolvedAddress: null,
    error: null,
  });

  // Auto-validate current user's username on load
  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  // Reset validation when username changes
  useEffect(() => {
    setValidation({
      isValid: false,
      isValidating: false,
      resolvedAddress: null,
      error: null,
    });
  }, [username]);

  // Validate username
  useEffect(() => {
    const validateUsername = async () => {
      if (!username.trim() || !usernameRegContract) {
        return;
      }

      const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, "");

      if (cleanUsername.length < 3) {
        setValidation({
          isValid: false,
          isValidating: false,
          resolvedAddress: null,
          error: "Username must be at least 3 characters long",
        });
        return;
      }

      setValidation((prev) => ({ ...prev, isValidating: true, error: null }));

      try {
        console.log(`🔍 Validating username for receive: ${cleanUsername}`);

        // Check if contract is initialized
        if (!usernameRegContract) {
          throw new Error("Username registry contract not initialized. Please ensure your wallet is connected.");
        }

        const resolvedAddress = await usernameRegContract.resolveUsername(
          cleanUsername
        );
        const usernameExists =
          resolvedAddress !== "0x0000000000000000000000000000000000000000";

        console.log(
          `📝 Username validation result: ${usernameExists ? "Found" : "Not found"
          }`
        );
        console.log(`   Username: ${cleanUsername}`);
        console.log(`   Resolved: ${resolvedAddress}`);

        if (!usernameExists) {
          setValidation({
            isValid: false,
            isValidating: false,
            resolvedAddress: null,
            error: `Username @${cleanUsername} not found. Please check the username.`,
          });
          return;
        }

        // Success
        setValidation({
          isValid: true,
          isValidating: false,
          resolvedAddress: resolvedAddress,
          error: null,
        });
      } catch (error) {
        console.error("❌ Username validation error:", error);
        setValidation({
          isValid: false,
          isValidating: false,
          resolvedAddress: null,
          error: "Unable to validate username. Please try again.",
        });
      }
    };

    // Debounce validation
    const timeoutId = setTimeout(validateUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [username, usernameRegContract]);

  const handleUsernameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setUsername(value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNote(e.target.value);
  };

  const handleCloseNotification = (): void => {
    setShowNotification(false);
  };

  const handleShareLink = (): void => {
    if (!validation.isValid) {
      addNotification({
        type: "error",
        title: "Invalid Username",
        message: "Please enter a valid username before generating payment link",
      });
      return;
    }

    const paymentLink = `https://rayn.app/pay/${username}${amount ? `?amount=${amount}` : ""
      }${note ? `${amount ? "&" : "?"}note=${encodeURIComponent(note)}` : ""}`;

    // Copy to clipboard
    navigator.clipboard
      .writeText(paymentLink)
      .then(() => {
        addNotification({
          type: "success",
          title: "Payment Link Generated!",
          message: "Payment link copied to clipboard",
        });

        console.log(`💸 Payment link generated for @${username}:`);
        console.log(`   Link: ${paymentLink}`);
        console.log(`   Amount: ${amount || "Not specified"}`);
        console.log(`   Note: ${note || "None"}`);
        console.log(`   Resolved Address: ${validation.resolvedAddress}`);
      })
      .catch(() => {
        addNotification({
          type: "error",
          title: "Copy Failed",
          message: "Could not copy link to clipboard",
        });
      });
  };

  const getUsernameValidationMessage = () => {
    if (validation.error) {
      return (
        <div className="text-red-400 text-xs mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {validation.error}
        </div>
      );
    }

    if (validation.isValidating) {
      return (
        <div className="text-blue-400 text-xs mt-1 flex items-center gap-1">
          <span className="animate-spin">⏳</span>
          Validating username...
        </div>
      );
    }

    if (validation.isValid && validation.resolvedAddress) {
      return (
        <div className="text-green-400 text-xs mt-1">
          ✅ Username found: {validation.resolvedAddress.slice(0, 8)}...
          {validation.resolvedAddress.slice(-6)}
        </div>
      );
    }

    return null;
  };

  const canGenerateLink =
    validation.isValid && !validation.isValidating && isWalletConnected;

  return (
    <AppLayout>
      {/* Page Header */}
      <header className="border-b border-purple-900/30 bg-[#261540]/50 backdrop-blur-sm sticky top-0 z-30">
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
                Receive Money
              </h1>
            </div>

            {/* Close Button - Desktop */}
            <button
              onClick={() => navigate("/dashboard")}
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-purple-900/30 transition-colors"
            >
              <X className="w-5 h-5" />
              <span>Close</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-120px)] px-4 sm:px-6 md:px-8">
        <div className="w-full max-w-2xl">
          {/* Title Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              Receive Payment
            </h1>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg">
              Generate a payment link to request funds from others.
            </p>
          </div>

          {/* Content Grid */}
          <div className="relative">
            {/* Payment Request Form */}
            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-purple-700/30 max-w-md mx-auto">
              {/* Form Fields */}
              <div className="space-y-4 sm:space-y-5">
                {/* Username Field */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Username
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={handleUsernameChange}
                      placeholder="username"
                      className={`w-full bg-[#1e1533] border rounded-xl py-3 sm:py-4 pl-12 pr-4 text-base text-white placeholder-gray-400 focus:outline-none transition-colors ${validation.error
                          ? "border-red-500/50 focus:border-red-500"
                          : validation.isValid
                            ? "border-green-500/50 focus:border-green-500"
                            : "border-purple-900/30 focus:border-purple-600/50"
                        }`}
                    />
                  </div>
                  {getUsernameValidationMessage()}
                </div>

                {/* Amount Field */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Amount (Optional)
                  </label>
                  <input
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="$ 0.00"
                    className="w-full bg-[#1e1533] border border-purple-900/30 rounded-xl py-3 sm:py-4 px-4 text-base text-white placeholder-gray-400 focus:outline-none focus:border-purple-600/50 transition-colors"
                  />
                </div>

                {/* Note Field */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={handleNoteChange}
                    placeholder="For coffee"
                    className="w-full bg-[#1e1533] border border-purple-900/30 rounded-xl py-3 sm:py-4 px-4 text-base text-white placeholder-gray-400 focus:outline-none focus:border-purple-600/50 transition-colors"
                  />
                </div>

                {/* Generate Link Button */}
                <button
                  onClick={handleShareLink}
                  disabled={!canGenerateLink}
                  className={`w-full font-semibold py-3 sm:py-4 px-6 rounded-xl sm:rounded-2xl text-base sm:text-lg transition-all duration-300 transform shadow-lg flex items-center justify-center gap-2 ${canGenerateLink
                      ? "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white hover:scale-[1.02] shadow-purple-500/30"
                      : "bg-gray-700/40 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  <Link2 className="w-5 h-5" />
                  {validation.isValidating
                    ? "Validating..."
                    : "Generate Payment Link"}
                </button>
              </div>

              {/* Helper Text */}
              <div className="mt-6 space-y-2">
                <p className="text-center text-gray-300 text-sm">
                  Share this link with the sender to receive funds.
                </p>
                {!isWalletConnected && (
                  <p className="text-center text-orange-400 text-xs">
                    ⚠️ Connect your wallet to generate payment links
                  </p>
                )}
              </div>

              {/* Preview Section */}
              {validation.isValid && (
                <div className="mt-6 p-4 rounded-xl bg-purple-600/20 border border-purple-500/30">
                  <h3 className="text-sm font-medium text-purple-300 mb-2">
                    Payment Request Preview
                  </h3>
                  <div className="space-y-1 text-xs text-gray-300">
                    <div>To: @{username}</div>
                    <div>
                      Address: {validation.resolvedAddress?.slice(0, 8)}...
                      {validation.resolvedAddress?.slice(-6)}
                    </div>
                    {amount && <div>Amount: ${amount}</div>}
                    {note && <div>Note: {note}</div>}
                  </div>
                </div>
              )}
            </div>

            {/* Notification Toast */}
            {showNotification && (
              <div className="absolute top-0 right-0 w-full max-w-xs">
                <div className="bg-gradient-to-br from-teal-900/40 to-teal-800/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-teal-700/30 relative">
                  <button
                    onClick={handleCloseNotification}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-base sm:text-lg mb-1">
                        Received $50.00
                      </p>
                      <p className="text-gray-300 text-sm">From @john.doe</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
