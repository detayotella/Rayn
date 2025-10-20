import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Logo from "../../assets/Logo.png";
import WalletConnectModal from "./WalletModal";
import { useWallet } from "../../context/WalletContext";
import { useApp } from "../../context/AppContext";

interface ValidationState {
  usernameExists: boolean;
  walletMatches: boolean;
  isValidating: boolean;
  error: string | null;
}

export default function SignIn(): React.JSX.Element {
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validation, setValidation] = useState<ValidationState>({
    usernameExists: false,
    walletMatches: false,
    isValidating: false,
    error: null,
  });

  const { isWalletConnected, account, usernameRegContract } = useWallet();
  const { setUser, addNotification } = useApp();
  const navigate = useNavigate();

  // Reset validation when username or wallet changes
  useEffect(() => {
    if (username || account) {
      setValidation({
        usernameExists: false,
        walletMatches: false,
        isValidating: false,
        error: null,
      });
    }
  }, [username, account]);

  // Validate username and wallet combination when both are available
  useEffect(() => {
    const validateCredentials = async () => {
      if (
        !username.trim() ||
        !isWalletConnected ||
        !account ||
        !usernameRegContract
      ) {
        return;
      }

      setValidation((prev) => ({ ...prev, isValidating: true, error: null }));

      try {
        // Clean username
        const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, "");

        console.log(`🔍 Validating credentials for username: ${cleanUsername}`);

        // Check if contract is initialized
        if (!usernameRegContract) {
          throw new Error("Username registry contract not initialized. Please ensure your wallet is connected.");
        }

        // Check if username exists
        const resolvedAddress = await usernameRegContract.resolveUsername(
          cleanUsername
        );
        const usernameExists =
          resolvedAddress !== "0x0000000000000000000000000000000000000000";

        console.log(
          `📝 Username exists: ${usernameExists}, Resolved: ${resolvedAddress}`
        );

        if (!usernameExists) {
          setValidation({
            usernameExists: false,
            walletMatches: false,
            isValidating: false,
            error:
              "Username not found. Please check your username or sign up instead.",
          });
          return;
        }

        // Check if the resolved address matches the connected wallet
        const walletMatches =
          resolvedAddress.toLowerCase() === account.toLowerCase();

        console.log(`🔐 Wallet matches: ${walletMatches}`);
        console.log(`   Expected: ${account.toLowerCase()}`);
        console.log(`   Found: ${resolvedAddress.toLowerCase()}`);

        if (!walletMatches) {
          setValidation({
            usernameExists: true,
            walletMatches: false,
            isValidating: false,
            error:
              "This username belongs to a different wallet. Please connect the correct wallet or use a different username.",
          });
          return;
        }

        // Success case
        console.log(`✅ Validation successful for @${cleanUsername}`);
        setValidation({
          usernameExists: true,
          walletMatches: true,
          isValidating: false,
          error: null,
        });
      } catch (error) {
        console.error("❌ Validation error:", error);
        setValidation({
          usernameExists: false,
          walletMatches: false,
          isValidating: false,
          error:
            "Unable to validate credentials. Please check your connection and try again.",
        });
      }
    };

    // Debounce validation to avoid excessive calls
    const timeoutId = setTimeout(validateCredentials, 800);
    return () => clearTimeout(timeoutId);
  }, [username, isWalletConnected, account, usernameRegContract]);

  const handleUsernameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = event.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setUsername(value);
  };

  const handleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const cleanUsername = username.trim();

    // Validation checks
    if (!cleanUsername) {
      addNotification({
        type: "error",
        title: "Username Required",
        message: "Please enter your username",
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

    if (!validation.usernameExists) {
      addNotification({
        type: "error",
        title: "Username Not Found",
        message:
          "This username does not exist. Please check your username or sign up instead.",
      });
      return;
    }

    if (!validation.walletMatches) {
      addNotification({
        type: "error",
        title: "Wallet Mismatch",
        message:
          "This username belongs to a different wallet. Please connect the correct wallet.",
      });
      return;
    }

    if (validation.isValidating) {
      addNotification({
        type: "info",
        title: "Validating",
        message: "Please wait while we validate your credentials",
      });
      return;
    }

    // Proceed with sign in
    setLoading(true);

    try {
      console.log(`🚀 Signing in user: @${cleanUsername}`);

      addNotification({
        type: "info",
        title: "Signing In",
        message: "Verifying your credentials...",
      });

      // Check if contract is initialized
      if (!usernameRegContract) {
        throw new Error("Username registry contract not initialized. Please ensure your wallet is connected.");
      }

      // Double-check credentials one more time
      const resolvedAddress = await usernameRegContract.resolveUsername(
        cleanUsername
      );

      if (resolvedAddress.toLowerCase() !== account.toLowerCase()) {
        throw new Error("Credential verification failed");
      }

      // Store user data
      const userData = {
        username: cleanUsername,
        walletAddress: account,
        balance: 0, // Will be fetched from blockchain later
      };

      setUser(userData);

      // Store in session for immediate access
      sessionStorage.setItem("raynUsername", cleanUsername);
      sessionStorage.setItem("raynWalletAddress", account);

      console.log(`✅ Sign in successful for @${cleanUsername}`);

      addNotification({
        type: "success",
        title: "Welcome Back!",
        message: `Successfully signed in as @${cleanUsername}`,
      });

      // Navigate to dashboard
      navigate("/dashboard", {
        state: {
          username: cleanUsername,
          walletAddress: account,
        },
      });
    } catch (error: any) {
      console.error("❌ Sign in error:", error);

      let errorMessage = "An error occurred during sign in. Please try again.";

      if (error.message?.includes("Credential verification failed")) {
        errorMessage =
          "Credential verification failed. Please ensure you're using the correct wallet.";
      } else if (error.code === "NETWORK_ERROR") {
        errorMessage =
          "Network error. Please check your connection and try again.";
      }

      addNotification({
        type: "error",
        title: "Sign In Failed",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const canProceed =
    username.trim() &&
    isWalletConnected &&
    validation.usernameExists &&
    validation.walletMatches &&
    !validation.isValidating;

  const getButtonText = () => {
    if (loading) return "Signing in...";
    if (validation.isValidating) return "Validating...";
    if (!username.trim()) return "Enter username";
    if (!isWalletConnected) return "Connect wallet";
    if (!validation.usernameExists) return "Username not found";
    if (!validation.walletMatches) return "Wallet mismatch";
    return "Continue";
  };

  const getValidationMessage = () => {
    if (validation.error) {
      return (
        <div className="text-red-400 text-sm mt-2 text-center flex items-center justify-center gap-1">
          <span>❌</span>
          {validation.error}
        </div>
      );
    }

    if (validation.isValidating) {
      return (
        <div className="text-blue-400 text-sm mt-2 text-center flex items-center justify-center gap-1">
          <span className="animate-spin">⏳</span>
          Validating credentials...
        </div>
      );
    }

    if (
      username.trim() &&
      isWalletConnected &&
      validation.usernameExists &&
      validation.walletMatches
    ) {
      return (
        <div className="text-green-400 text-sm mt-2 text-center flex items-center justify-center gap-1">
          <span>✅</span>
          Credentials verified
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#191022] to-[#231036] flex flex-col">
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

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-5 md:mb-6 px-4 leading-tight">
            Sign in
          </h1>

          <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-8 sm:mb-10 md:mb-12 px-4 leading-relaxed">
            Enter your @username and connect your wallet to continue to Rayn.
          </p>

          <div className="mb-6 sm:mb-8 px-4">
            <div className="relative">
              <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-500 text-base sm:text-lg">
                @
              </span>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="username"
                className={`w-full bg-transparent border rounded-2xl py-3 sm:py-4 pl-9 sm:pl-10 pr-4 sm:pr-5 text-white placeholder-gray-500 focus:outline-none transition-colors text-base sm:text-lg ${validation.error
                    ? "border-red-500/50 focus:border-red-500"
                    : validation.usernameExists && validation.walletMatches
                      ? "border-green-500/50 focus:border-green-500"
                      : "border-gray-700/50 focus:border-purple-600"
                  }`}
              />
            </div>
            {getValidationMessage()}
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
          </div>

          <div className="px-4">
            <button
              onClick={handleSignIn}
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

          <div className="px-4 mt-6">
            <p className="text-gray-500 text-sm">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/sign-up")}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
