import React, { useState } from "react";
import { useWallet } from "../../context/WalletContext";
import { useSyncProviders } from "../../sync";
import { ChevronLeft, X, CheckCircle, Loader2 } from "lucide-react";

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletConnectModal: React.FC<WalletConnectModalProps> = ({
  isOpen,
  onClose,
}) => {
  // All hooks must be called unconditionally at the top
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const { setSelectedWallet, setIsWalletConnected, setAccount } = useWallet();
  const providers = useSyncProviders();

  if (!isOpen) return null;

  const handleConnectWallet = async (
    providerWithInfo: EIP6963ProviderDetail
  ) => {
    try {
      setConnectingWallet(providerWithInfo.info.uuid);
      console.log("Attempting to connect to:", providerWithInfo.info.name);

      const accounts = (await providerWithInfo.provider.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (accounts && accounts.length > 0) {
        const account = accounts[0];
        console.log("Connected account:", account);

        // Update wallet context
        setSelectedWallet(providerWithInfo);
        setAccount(account);
        setIsWalletConnected(true);

        // Show success state
        setConnectingWallet(null);
        setConnectedWallet(providerWithInfo.info.uuid);

        // Close the modal after successful connection
        setTimeout(() => {
          onClose();
          setConnectedWallet(null); // Reset state when modal closes
        }, 1000); // Show success for 1 second

        console.log("Wallet connected successfully");
      } else {
        console.error("No accounts returned from wallet");
        setIsWalletConnected(false);
        setConnectingWallet(null);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setIsWalletConnected(false);
      setConnectingWallet(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-white text-lg font-semibold">Sign in</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Wallet List */}
        <div className="px-4 py-4">
          {providers.length > 0 ? (
            providers.map((provider: EIP6963ProviderDetail) => {
              const isConnecting = connectingWallet === provider.info.uuid;
              const isConnected = connectedWallet === provider.info.uuid;

              return (
                <button
                  key={provider.info.uuid}
                  onClick={() => handleConnectWallet(provider)}
                  disabled={isConnecting || isConnected}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-colors mb-2 ${
                    isConnected
                      ? "bg-green-900/30 border border-green-500/30"
                      : isConnecting
                      ? "bg-blue-900/30 border border-blue-500/30"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 relative">
                    {provider.info.icon ? (
                      <img
                        src={provider.info.icon}
                        alt={provider.info.name}
                        className="w-full h-full rounded-xl"
                      />
                    ) : (
                      provider.info.name.charAt(0)
                    )}

                    {/* Loading spinner overlay */}
                    {isConnecting && (
                      <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                      </div>
                    )}

                    {/* Success checkmark overlay */}
                    {isConnected && (
                      <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-white font-medium">
                      {provider.info.name}
                    </span>
                    <span
                      className={`text-sm ${
                        isConnected
                          ? "text-green-400"
                          : isConnecting
                          ? "text-blue-400"
                          : "text-gray-500"
                      }`}
                    >
                      {isConnected
                        ? "Connected"
                        : isConnecting
                        ? "Connecting..."
                        : "Installed"}
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-center py-8">
              <h3 className="text-gray-400 text-lg">No Wallets Found</h3>
            </div>
          )}

          {/* All Wallets Button */}
          <button className="w-full flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-gray-800 transition-colors mt-2">
            <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
              <div className="grid grid-cols-2 gap-1">
                <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-sm"></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">All Wallets</span>
              <span className="text-gray-500 text-xs bg-gray-800 px-2 py-1 rounded-full">
                500+
              </span>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">New to wallets?</span>
            <button
              onClick={() =>
                window.open("https://blog.thirdweb.com/web3-wallet/", "_blank")
              }
              className="text-emerald-500 text-sm font-medium hover:text-emerald-400 transition-colors"
            >
              Get started
            </button>
          </div>
        </div>

        {/* Powered By */}
        <div className="px-6 py-3 text-center">
          <span className="text-gray-600 text-xs">Powered by thirdweb</span>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectModal;
