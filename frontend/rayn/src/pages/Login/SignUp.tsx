import React, { useState } from "react";
import { useNavigate } from "react-router";
import WalletConnectModal from "./WalletModal";
import { useWallet } from "../../context/WalletContext";
import Logo from "../../assets/Logo.png";

export default function ChooseUsernamePage(): React.JSX.Element {
  const [username, setUsername] = useState<string>("");
  const [referralLink, setReferralLink] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const { isWalletConnected } = useWallet();

  const handleContinue = (): void => {
    if (username && isWalletConnected) {
      sessionStorage.setItem("raynUsername", username);
      if (referralLink) {
        sessionStorage.setItem("raynReferralLink", referralLink);
      } else {
        sessionStorage.removeItem("raynReferralLink");
      }
      navigate("/profile", { state: { username } });
    }
  };

  const handleUsernameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""));
  };

  const handleReferralLinkChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setReferralLink(e.target.value);
  };

  const handleNavigateToSignIn = (): void => {
    navigate("/sign-in");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#191022] to-[#231036] flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800/50 py-4 sm:py-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap- sm:gap-">
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
                className="w-full bg-transparent border border-gray-700/50 rounded-2xl py-3 sm:py-4 pl-9 sm:pl-10 pr-4 sm:pr-5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-600 transition-colors text-base sm:text-lg"
              />
            </div>
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
              className={`w-full max-w-md ${
                isWalletConnected
                  ? "bg-gray-700/60 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              } text-white text-base sm:text-lg font-semibold py-3 sm:py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform ${
                isWalletConnected ? "" : "hover:scale-105"
              } mx-auto`}
            >
              {isWalletConnected ? "Wallet connected" : "Connect wallet"}
            </button>
            <WalletConnectModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </div>

          {/* Continue Button */}
          <div className="px-4 mb-4 sm:mb-5">
            <button
              onClick={handleContinue}
              disabled={!username || !isWalletConnected}
              className={`w-full max-w-md ${
                !username || !isWalletConnected
                  ? "bg-gray-700/60 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              } text-white text-base sm:text-lg font-semibold py-3 sm:py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform ${
                !username || !isWalletConnected ? "" : "hover:scale-105"
              } mx-auto`}
            >
              Continue
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
