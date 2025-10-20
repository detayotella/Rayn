import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import WalletConnectModal from "./WalletModal";
import { useWallet } from "../../context/WalletContext";
import { useApp } from "../../context/AppContext";
import Logo from "../../assets/Logo.png";

interface ValidationState {
  usernameAvailable: boolean;
  walletAvailable: boolean;
  isValidatingUsername: boolean;
  isValidatingWallet: boolean;
  usernameError: string | null;
  walletError: string | null;
  isUsernameValid: boolean;
}

export default function ChooseUsernamePage(): React.JSX.Element {
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [referralLink, setReferralLink] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validation, setValidation] = useState<ValidationState>({
    usernameAvailable: false,
    walletAvailable: false,
    isValidatingUsername: false,
    isValidatingWallet: false,
    usernameError: null,
    walletError: null,
    isUsernameValid: false,
  });

  const navigate = useNavigate();
  const {
    isWalletConnected,
    account,
    usernameRegContract,
    usernameRegContract_readOnly,
    isInitializingContracts,
  } = useWallet();
  const { setUser, addNotification } = useApp();

  // Reset validation when inputs change
  useEffect(() => {
    setValidation((prev) => ({
      ...prev,
      usernameAvailable: false,
      usernameError: null,
      isValidatingUsername: false,
      isUsernameValid: false,
    }));
  }, [username]);

  useEffect(() => {
    setValidation((prev) => ({
      ...prev,
      walletAvailable: false,
      walletError: null,
      isValidatingWallet: false,
    }));
  }, [account]);

  // Username validation
  const validateUsernameFormat = (
    username: string
  ): { isValid: boolean; error: string | null } => {
    const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, "");

    if (cleanUsername.length < 3) {
      return {
        isValid: false,
        error: "Username must be at least 3 characters long",
      };
    }

    if (cleanUsername.length > 20) {
      return {
        isValid: false,
        error: "Username must be no more than 20 characters long",
      };
    }

    if (cleanUsername.startsWith("_") || cleanUsername.endsWith("_")) {
      return {
        isValid: false,
        error: "Username cannot start or end with underscore",
      };
    }

    if (!/^[a-z0-9_]+$/.test(cleanUsername)) {
      return {
        isValid: false,
        error:
          "Username can only contain lowercase letters, numbers, and underscores",
      };
    }

    return { isValid: true, error: null };
  };

  // Check username availability
  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (!username.trim() || !usernameRegContract_readOnly) {
        return;
      }

      const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, "");

      // First validate format
      const formatValidation = validateUsernameFormat(cleanUsername);
      if (!formatValidation.isValid) {
        setValidation((prev) => ({
          ...prev,
          isUsernameValid: false,
          usernameError: formatValidation.error,
          usernameAvailable: false,
          isValidatingUsername: false,
        }));
        return;
      }

      setValidation((prev) => ({
        ...prev,
        isValidatingUsername: true,
        usernameError: null,
        isUsernameValid: true,
      }));

      try {
        console.log(`� Checking availability for username: ${cleanUsername}`);

        // Check if contract is initialized
        if (!usernameRegContract_readOnly) {
          throw new Error("Username registry contract not initialized. Please ensure your wallet is connected.");
        }

        const resolvedAddress = await usernameRegContract_readOnly.resolveUsername(
          cleanUsername
        );
        console.log("📝 Username resolved address:", resolvedAddress);
        console.log("📝 Username resolved address:", resolvedAddress);
        const isAvailable =
          resolvedAddress === "0x0000000000000000000000000000000000000000";

        console.log(`✅ Username check complete. Available: ${isAvailable}`);

        setValidation((prev) => ({
          ...prev,
          isValidatingUsername: false,
          usernameAvailable: isAvailable,
          usernameError: isAvailable ? null : "Username is already taken",
        }));
      } catch (error: any) {
        console.error("❌ Username availability check failed:", error);

        let errorMessage = "Unable to check username availability. Please try again.";

        // Check for specific errors
        if (error?.code === "BAD_DATA" || error?.message?.includes("could not decode result data")) {
          errorMessage = "Contract error: Please ensure you're connected to the correct network and the contract is properly deployed.";
        } else if (error?.message?.includes("not initialized")) {
          errorMessage = error.message;
        }

        setValidation((prev) => ({
          ...prev,
          isValidatingUsername: false,
          usernameError: errorMessage,
        }));
      }
    };

    // Debounce the validation
    const timeoutId = setTimeout(checkUsernameAvailability, 800);
    return () => clearTimeout(timeoutId);
  }, [username, usernameRegContract]);

  // Check wallet availability
  useEffect(() => {
    if (!isWalletConnected || !account || !usernameRegContract) {
      return;
    }

    if (isInitializingContracts) {
      console.log("⏳ Waiting for contracts to initialize...");
      return;
    }

    let isCancelled = false; // Cleanup flag

    const checkWalletAvailability = async () => {
      setValidation((prev) => ({
        ...prev,
        isValidatingWallet: true,
        walletError: null,
      }));

      try {
        console.log(`🔍 Checking wallet registration for: ${account}`);

        console.log(
          "username reg contract initialized at:" + usernameRegContract
        );
        const existingUsername = await usernameRegContract.getUsernameOf(
          account
        );

        if (isCancelled) {
          console.log("🚫 Check cancelled, ignoring result");
          return;
        }

        const isWalletAvailable = existingUsername === "";

        console.log(
          `✅ Wallet check complete. Available: ${isWalletAvailable}`
        );

        setValidation((prev) => ({
          ...prev,
          isValidatingWallet: false,
          walletAvailable: isWalletAvailable,
          walletError: isWalletAvailable
            ? null
            : `This wallet is already registered to username: @${existingUsername}`,
        }));
      } catch (error: any) {
        if (isCancelled) {
          return;
        }
        console.error("❌ Wallet availability check failed:", error);

        let errorMessage = "Unable to check wallet registration. Please try again.";

        // Check for specific errors
        if (error?.code === "BAD_DATA" || error?.message?.includes("could not decode result data")) {
          errorMessage = "Contract error: Please ensure you're connected to the correct network and the contract is properly deployed.";
        }

        setValidation((prev) => ({
          ...prev,
          isValidatingWallet: false,
          walletError: errorMessage,
        }));
      }
    };

    // Debounce the validation
    const timeoutId = setTimeout(checkWalletAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [
    isWalletConnected,
    account,
    usernameRegContract,
    isInitializingContracts,
  ]);

  const handleContinue = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, "");

    // Final validation before proceeding
    if (!cleanUsername) {
      addNotification({
        type: "error",
        title: "Username Required",
        message: "Please enter a username",
      });
      return;
    }

    if (!isWalletConnected || !account) {
      addNotification({
        type: "error",
        title: "Wallet Required",
        message: "Please connect your wallet",
      });
      return;
    }

    if (!usernameRegContract) {
      addNotification({
        type: "error",
        title: "Contract Not Available",
        message:
          "Username registry contract is not available. Please try reconnecting your wallet.",
      });
      return;
    }

    if (!validation.isUsernameValid) {
      addNotification({
        type: "error",
        title: "Invalid Username",
        message: validation.usernameError || "Please enter a valid username",
      });
      return;
    }

    if (!validation.usernameAvailable) {
      addNotification({
        type: "error",
        title: "Username Taken",
        message: "This username is already taken. Please choose another.",
      });
      return;
    }

    if (!validation.walletAvailable) {
      addNotification({
        type: "error",
        title: "Wallet Already Registered",
        message: "This wallet is already registered to another username.",
      });
      return;
    }

    if (validation.isValidatingUsername || validation.isValidatingWallet) {
      addNotification({
        type: "info",
        title: "Validating",
        message: "Please wait while we validate your information",
      });
      return;
    }

    // Proceed with registration
    setLoading(true);

    try {
      console.log(`🚀 Starting registration for username: ${cleanUsername}`);

      addNotification({
        type: "info",
        title: "Registration Starting",
        message: "Please confirm the transaction in your wallet...",
      });

      const transaction = await usernameRegContract.registerUsername(
        cleanUsername
      );

      addNotification({
        type: "info",
        title: "Transaction Submitted",
        message:
          "Your username is being registered on the blockchain. This may take a few moments...",
      });

      console.log(`⏳ Transaction submitted. Hash: ${transaction.hash}`);

      // Wait for transaction confirmation
      const receipt = await transaction.wait();

      console.log(`✅ Registration successful! Block: ${receipt.blockNumber}`);

      // Store user data
      const userData = {
        username: cleanUsername,
        walletAddress: account,
        balance: 0,
      };

      setUser(userData);

      // Store in session for immediate access
      sessionStorage.setItem("raynUsername", cleanUsername);
      sessionStorage.setItem("raynWalletAddress", account);

      if (referralLink.trim()) {
        sessionStorage.setItem("raynReferralLink", referralLink.trim());
      }

      addNotification({
        type: "success",
        title: "Welcome to Rayn!",
        message: `Successfully registered @${cleanUsername}`,
      });

      // Navigate to profile setup
      navigate("/profile", {
        state: {
          username: cleanUsername,
          walletAddress: account,
          isNewUser: true,
        },
      });
    } catch (error) {
      console.error("❌ Registration failed:", error);

      let errorMessage = "Registration failed. Please try again.";

      if (typeof error === "object" && error !== null) {
        const err = error as any;
        if (err.code === 4001) {
          errorMessage = "Transaction was cancelled by user.";
        } else if (err.code === "CALL_EXCEPTION") {
          if (err.reason?.includes("already has a username")) {
            errorMessage = "This wallet already has a username registered.";
          } else if (err.reason?.includes("username already taken")) {
            errorMessage = "Username is already taken. Please choose another.";
          } else {
            errorMessage = `Registration failed: ${err.reason || err.message}`;
          }
        } else if (err.message?.includes("user rejected")) {
          errorMessage = "Transaction was rejected by user.";
        }
      }

      addNotification({
        type: "error",
        title: "Registration Failed",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setUsername(value);
  };

  const handleReferralLinkChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setReferralLink(e.target.value);
  };

  const handleNavigateToSignIn = (): void => {
    navigate("/sign-in");
  };

  const canProceed =
    username.trim() &&
    isWalletConnected &&
    validation.isUsernameValid &&
    validation.usernameAvailable &&
    validation.walletAvailable &&
    !validation.isValidatingUsername &&
    !validation.isValidatingWallet;

  const getButtonText = () => {
    if (loading) return "Registering...";
    if (validation.isValidatingUsername || validation.isValidatingWallet)
      return "Validating...";
    if (!username.trim()) return "Enter username";
    if (!isWalletConnected) return "Connect wallet";
    if (!validation.isUsernameValid) return "Invalid username";
    if (!validation.usernameAvailable) return "Username taken";
    if (!validation.walletAvailable) return "Wallet already registered";
    return "Continue";
  };

  const getUsernameValidationMessage = () => {
    if (validation.usernameError) {
      return (
        <div className="text-red-400 text-xs mt-1 flex items-center gap-1">
          <span>❌</span>
          {validation.usernameError}
        </div>
      );
    }

    if (validation.isValidatingUsername) {
      return (
        <div className="text-blue-400 text-xs mt-1 flex items-center gap-1">
          <span className="animate-spin">⏳</span>
          Checking availability...
        </div>
      );
    }

    if (
      username.trim() &&
      validation.isUsernameValid &&
      validation.usernameAvailable
    ) {
      return (
        <div className="text-green-400 text-xs mt-1 flex items-center gap-1">
          <span>✅</span>
          Username available
        </div>
      );
    }

    return null;
  };

  const getWalletValidationMessage = () => {
    if (validation.walletError) {
      return (
        <div className="text-red-400 text-xs mt-2 text-center flex items-center justify-center gap-1">
          <span>❌</span>
          {validation.walletError}
        </div>
      );
    }

    if (validation.isValidatingWallet) {
      return (
        <div className="text-blue-400 text-xs mt-2 text-center flex items-center justify-center gap-1">
          <span className="animate-spin">⏳</span>
          Checking wallet...
        </div>
      );
    }

    if (isWalletConnected && validation.walletAvailable) {
      return (
        <div className="text-green-400 text-xs mt-2 text-center flex items-center justify-center gap-1">
          <span>✅</span>
          Wallet available
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#191022] to-[#231036] flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800/50 py-4 sm:py-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3">
          <img
            src={Logo}
            alt="Rayn logo"
            className="w-8 h-8 sm:w-7 sm:h-7 md:w-12 md:h-12 object-contain"
          />
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
            Rayn
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md text-center">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-5 md:mb-6 px-4 leading-tight">
            Sign up
          </h1>

          {/* Description */}
          <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-8 sm:mb-10 md:mb-12 px-4 leading-relaxed">
            Choose a unique @username so friends can find you on Rayn. If you
            have a referral link, add it below to connect rewards.
          </p>

          {/* Username Input */}
          <div className="mb-5 sm:mb-6 px-4">
            <div className="relative">
              <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-500 text-base sm:text-lg">
                @
              </span>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="username"
                className={`w-full bg-transparent border rounded-2xl py-3 sm:py-4 pl-9 sm:pl-10 pr-4 sm:pr-5 text-white placeholder-gray-500 focus:outline-none transition-colors text-base sm:text-lg ${validation.usernameError
                    ? "border-red-500/50 focus:border-red-500"
                    : validation.isUsernameValid && validation.usernameAvailable
                      ? "border-green-500/50 focus:border-green-500"
                      : "border-gray-700/50 focus:border-purple-600"
                  }`}
              />
            </div>
            {getUsernameValidationMessage()}
          </div>

          <div className="mb-6 sm:mb-8 px-4">
            <input
              type="text"
              value={referralLink}
              onChange={handleReferralLinkChange}
              placeholder="Referral link (optional)"
              className="w-full bg-transparent border border-gray-700/50 rounded-2xl py-3 sm:py-4 px-4 sm:px-5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-600 transition-colors text-base sm:text-lg"
            />
          </div>

          <div className="px-4 mb-4 sm:mb-5">
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={isWalletConnected}
              className={`w-full max-w-md ${isWalletConnected
                  ? "bg-green-600/30 border border-green-500/30 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                } text-white text-base sm:text-lg font-semibold py-3 sm:py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform ${isWalletConnected ? "" : "hover:scale-105"
                } mx-auto`}
            >
              {isWalletConnected ? "✅ Wallet connected" : "Connect wallet"}
            </button>
            <WalletConnectModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
            {getWalletValidationMessage()}
          </div>

          {/* Continue Button */}
          <div className="px-4 mb-4 sm:mb-5">
            <button
              onClick={handleContinue}
              disabled={!canProceed || loading}
              className={`w-full max-w-md ${!canProceed || loading
                  ? "bg-gray-700/60 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                } text-white text-base sm:text-lg font-semibold py-3 sm:py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform ${!canProceed || loading ? "" : "hover:scale-105"
                } mx-auto`}
            >
              {getButtonText()}
            </button>
          </div>

          <div className="px-4">
            <button
              onClick={handleNavigateToSignIn}
              className="w-full max-w-md border border-purple-600/70 text-purple-300 hover:text-white hover:bg-purple-600/20 text-base sm:text-lg font-semibold py-3 sm:py-4 px-8 rounded-full transition-all duration-300 mx-auto"
            >
              Sign in instead
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
