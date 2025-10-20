import React, { createContext, useCallback, useContext, useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import type { ReactNode } from "react";
import GiveawayDist_ABI from "../abi/giveawayDist_abi.json";
import raynPayment_ABI from "../abi/raynPaymentRouter_abi.json";
import raynStable_ABI from "../abi/raynStable_abi.json";
import usernameReg_ABI from "../abi/Username_registry.json";


interface WalletContextType {
  selectedWallet?: EIP6963ProviderDetail;
  isWalletConnected: boolean;
  account: string;
  giveawayDistContract?: ethers.Contract;
  raynPaymentContract?: ethers.Contract;
  raynStableContract?: ethers.Contract;
  usernameRegContract?: ethers.Contract;
  usernameRegContract_readOnly?: ethers.Contract;
  error?: string;
  networkInfo?: { chainId: bigint; name: string };
  setSelectedWallet: (wallet: EIP6963ProviderDetail | undefined) => void;
  setIsWalletConnected: (connected: boolean) => void;
  setAccount: (account: string) => void;
  initializeContracts: () => Promise<void>;
  isInitializingContracts: boolean;
}

// TODO: Configure contract addresses after deployment
const GiveawayDist_address = "0x3b6e2Cf8E4b4b27188BccA88FfcC5B505742a803";
const raynPayment_address = "0xad3F6c7d78abD646104259c527C6092C3f8Dd52C";
const raynStable_address = "0xDcf050285a799389dE82B02bf9283246dD781f13";
const usernameReg_address = "0x6610d9AF8DA15b62edeC19E2E4faEb378A564CC0";


const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedWallet, setSelectedWallet] = useState<
    EIP6963ProviderDetail | undefined
  >();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [account, setAccount] = useState<string>("");
  const [giveawayDistContract, setGiveawayDistContract] = useState<ethers.Contract>();
  const [raynPaymentContract, setRaynPaymentContract] = useState<ethers.Contract>();
  const [usernameRegContract_readOnly, setUsernameRegContract_readOnly] = useState<ethers.Contract>();
  const [raynStableContract, setRaynStableContract] = useState<ethers.Contract>();
  const [usernameRegContract, setUsernameRegContract] = useState<ethers.Contract>();
  const [isInitializingContracts, setIsInitializingContracts] = useState(false);
  const [error, setError] = useState<string>();
  const [networkInfo, setNetworkInfo] = useState<{ chainId: bigint; name: string }>();

  // Refs to prevent infinite loops
  const hasInitialized = useRef(false);
  const contractsInitialized = useRef(false);
  const lastReconnectionAttempt = useRef<number>(0);

  // Storage keys for persistence
  const STORAGE_KEYS = {
    WALLET_CONNECTED: "rayn_wallet_connected",
    WALLET_ACCOUNT: "rayn_wallet_account",
    WALLET_PROVIDER_NAME: "rayn_wallet_provider_name",
    WALLET_PROVIDER_UUID: "rayn_wallet_provider_uuid",
  };

  // Save wallet state to localStorage
  const saveWalletState = useCallback(
    (
      wallet: EIP6963ProviderDetail | undefined,
      account: string,
      connected: boolean
    ) => {
      try {
        if (connected && wallet && account) {
          localStorage.setItem(STORAGE_KEYS.WALLET_CONNECTED, "true");
          localStorage.setItem(STORAGE_KEYS.WALLET_ACCOUNT, account);
          localStorage.setItem(
            STORAGE_KEYS.WALLET_PROVIDER_NAME,
            wallet.info.name
          );
          localStorage.setItem(
            STORAGE_KEYS.WALLET_PROVIDER_UUID,
            wallet.info.uuid
          );
        } else {
          localStorage.removeItem(STORAGE_KEYS.WALLET_CONNECTED);
          localStorage.removeItem(STORAGE_KEYS.WALLET_ACCOUNT);
          localStorage.removeItem(STORAGE_KEYS.WALLET_PROVIDER_NAME);
          localStorage.removeItem(STORAGE_KEYS.WALLET_PROVIDER_UUID);
        }
      } catch (error) {
        console.warn("Failed to save wallet state to localStorage:", error);
      }
    },
    []
  );

  const loadWalletState = useCallback(() => {
    try {
      const wasConnected =
        localStorage.getItem(STORAGE_KEYS.WALLET_CONNECTED) === "true";
      const storedAccount = localStorage.getItem(STORAGE_KEYS.WALLET_ACCOUNT);
      const storedProviderName = localStorage.getItem(
        STORAGE_KEYS.WALLET_PROVIDER_NAME
      );
      const storedProviderUuid = localStorage.getItem(
        STORAGE_KEYS.WALLET_PROVIDER_UUID
      );

      return {
        wasConnected,
        storedAccount: storedAccount || "",
        storedProviderName: storedProviderName || "",
        storedProviderUuid: storedProviderUuid || "",
      };
    } catch (error) {
      console.warn("Failed to load wallet state from localStorage:", error);
      return {
        wasConnected: false,
        storedAccount: "",
        storedProviderName: "",
        storedProviderUuid: "",
      };
    }
  }, []);

  // Clear wallet state
  const clearWalletState = useCallback(() => {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.warn("Failed to clear wallet state:", error);
    }
  }, []);

  // Find wallet provider by stored info
  const findWalletProvider = useCallback(
    async (providerName: string, providerUuid: string) => {
      return new Promise<EIP6963ProviderDetail | null>((resolve) => {
        const providers: EIP6963ProviderDetail[] = [];
        let resolved = false;

        const handleAnnouncement = (event: CustomEvent<EIP6963ProviderDetail>) => {
          if (resolved) return;

          const providerDetail = event.detail;

          // Check if this is the provider we're looking for
          if (
            providerDetail.info.uuid === providerUuid ||
            providerDetail.info.name === providerName
          ) {
            resolved = true;
            cleanup();
            resolve(providerDetail);
            return;
          }

          providers.push(providerDetail);
        };

        const cleanup = () => {
          if (typeof window !== "undefined") {
            window.removeEventListener(
              "eip6963:announceProvider",
              handleAnnouncement as EventListener
            );
          }
        };

        const checkProviders = () => {
          if (typeof window === "undefined") {
            resolve(null);
            return;
          }

          // Listen for EIP-6963 announcements
          window.addEventListener(
            "eip6963:announceProvider",
            handleAnnouncement as EventListener
          );

          // Request providers to announce themselves
          window.dispatchEvent(new Event("eip6963:requestProvider"));

          // Timeout after 3 seconds
          setTimeout(() => {
            if (resolved) return;

            cleanup();

            // Fallback: try to find provider by name matching
            const fallbackProvider = providers.find(
              (p) =>
                p.info.name.toLowerCase().includes(providerName.toLowerCase()) ||
                p.info.uuid === providerUuid
            );

            resolve(fallbackProvider || null);
          }, 3000);
        };

        checkProviders();
      });
    },
    []
  );

  // Reconnect to previously connected wallet
  const reconnectWallet = useCallback(async (): Promise<boolean> => {
    // Prevent multiple rapid reconnection attempts
    const now = Date.now();
    if (now - lastReconnectionAttempt.current < 5000) {
      // 5 second cooldown
      return false;
    }
    lastReconnectionAttempt.current = now;

    const {
      wasConnected,
      storedAccount,
      storedProviderName,
      storedProviderUuid,
    } = loadWalletState();

    if (!wasConnected || !storedAccount || !storedProviderName) {
      return false;
    }

    try {
      console.log("Attempting to reconnect to wallet:", storedProviderName);

      const walletProvider = await findWalletProvider(
        storedProviderName,
        storedProviderUuid
      );

      if (!walletProvider) {
        console.warn("Previously connected wallet provider not found");
        clearWalletState();
        return false;
      }

      const accounts = (await walletProvider.provider.request({
        method: "eth_accounts",
      })) as string[];

      if (!accounts || accounts.length === 0) {
        console.warn("No accounts available from previously connected wallet");
        clearWalletState();
        return false;
      }

      const accountExists = accounts.some(
        (acc) => acc.toLowerCase() === storedAccount.toLowerCase()
      );

      if (!accountExists) {
        console.warn("Previously connected account no longer available");
        clearWalletState();
        return false;
      }

      setSelectedWallet(walletProvider);
      setAccount(storedAccount);
      setIsWalletConnected(true);

      console.log("Wallet reconnected successfully:", storedAccount);
      return true;
    } catch (error) {
      console.error("Failed to reconnect wallet:", error);
      clearWalletState();
      return false;
    }
  }, [findWalletProvider, loadWalletState, clearWalletState]);


  const initializeContracts = useCallback(async () => {
    if (!selectedWallet?.provider) {
      setError("No Wallet Connected");
      return;
    }

    if (contractsInitialized.current) {
      console.log("Contracts already initialized, skipping...");
      return;
    }

    setIsInitializingContracts(true);
    setError(undefined);

    try {
      const provider = new ethers.BrowserProvider(selectedWallet.provider);
      const signer = await provider.getSigner();

      // Check network
      const network = await provider.getNetwork();
      console.log("Connected to network:", network.chainId, network.name);
      setNetworkInfo({ chainId: network.chainId, name: network.name });

      // Verify we're on the correct network (adjust chainId as needed)
      // Common networks: 1 = Ethereum Mainnet, 11155111 = Sepolia, 80001 = Mumbai, 137 = Polygon
      const expectedChainId = 11155111n; // Sepolia testnet - adjust this to your target network

      if (network.chainId !== expectedChainId) {
        console.warn(`Warning: Connected to chain ${network.chainId}, expected ${expectedChainId}`);
        // Don't throw error, just warn - user might be on correct network
      }

      // Only initialize contracts if addresses are provided and valid
      if (GiveawayDist_address && ethers.isAddress(GiveawayDist_address)) {
        const giveawayDistInstance = new ethers.Contract(
          GiveawayDist_address,
          GiveawayDist_ABI,
          signer
        );
        setGiveawayDistContract(giveawayDistInstance);
      } else {
        console.warn("GiveawayDist contract address not configured");
      }

      if (raynPayment_address && ethers.isAddress(raynPayment_address)) {
        const raynPaymentInstance = new ethers.Contract(
          raynPayment_address,
          raynPayment_ABI,
          signer
        );
        setRaynPaymentContract(raynPaymentInstance);
      } else {
        console.warn("RaynPayment contract address not configured");
      }

      if (raynStable_address && ethers.isAddress(raynStable_address)) {
        const raynStableInstance = new ethers.Contract(
          raynStable_address,
          raynStable_ABI,
          signer
        );
        setRaynStableContract(raynStableInstance);
      } else {
        console.warn("RaynStable contract address not configured");
      }

      if (usernameReg_address && ethers.isAddress(usernameReg_address)) {
        // Verify contract exists at address
        const code = await provider.getCode(usernameReg_address);
        if (code === "0x") {
          console.error(`No contract found at UsernameRegistry address: ${usernameReg_address}`);
          throw new Error(`UsernameRegistry contract not deployed at ${usernameReg_address}. Please check the contract address and network.`);
        }

        const usernameRegInstance = new ethers.Contract(
          usernameReg_address,
          usernameReg_ABI,
          signer
        );
        setUsernameRegContract(usernameRegInstance);
        const usernameRegInstance_readOnly = new ethers.Contract(
          usernameReg_address,
          usernameReg_ABI,
          provider
        );
        setUsernameRegContract_readOnly(usernameRegInstance_readOnly)

        console.log("✅ UsernameRegistry contract initialized at:", usernameReg_address);
      } else {
        console.warn("UsernameRegistry contract address not configured");
      }

      contractsInitialized.current = true;
      console.log("Wallet connected successfully, contracts initialized (where addresses are available)");
      setIsInitializingContracts(false);

    } catch (error) {
      console.error("Failed to initialize contracts:", error);
      setError("Failed to initialize contracts");
      setIsInitializingContracts(false);

    }
  }, [selectedWallet]);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;

      const initializeWallet = async () => {
        const reconnected = await reconnectWallet();
        if (reconnected) {
          await initializeContracts();
        }
      };

      initializeWallet();
    }
  }, [reconnectWallet, initializeContracts]);

  useEffect(() => {
    if (
      isWalletConnected &&
      selectedWallet &&
      account &&
      hasInitialized.current
    ) {
      saveWalletState(selectedWallet, account, true);
    }
  }, [isWalletConnected, selectedWallet, account, saveWalletState]);


  useEffect(() => {
    if (isWalletConnected && selectedWallet) {
      initializeContracts();
    }
  }, [isWalletConnected, selectedWallet]);




  return (
    <WalletContext.Provider
      value={{
        selectedWallet,
        isWalletConnected,
        account,
        giveawayDistContract,
        raynPaymentContract,
        raynStableContract,
        usernameRegContract,
        usernameRegContract_readOnly,
        error,
        networkInfo,
        setSelectedWallet,
        setIsWalletConnected,
        setAccount,
        initializeContracts,
        isInitializingContracts,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }

  return context;
};
