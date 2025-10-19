import React, { createContext, useCallback, useContext, useState, useEffect} from "react";
import {ethers} from "ethers";
import type {ReactNode} from "react";
import GiveawayDist_ABI from "../abi/giveawayDist_abi.json";
import raynPayment_ABI from "../abi/raynPaymentRouter_abi.json";
import raynStable_ABI from "../abi/raynStable_abi.json";
import usernameReg_ABI from "../abi/Username_registry.json";


interface WalletContextType{
    selectedWallet?: EIP6963ProviderDetail;
    isWalletConnected: boolean;
    account: string;
    giveawayDistContract?: ethers.Contract;
    raynPaymentContract?: ethers.Contract;
    raynStableContract?: ethers.Contract;
    usernameRegContract?: ethers.Contract;
    error?: string;
    setSelectedWallet: (wallet: EIP6963ProviderDetail | undefined) => void;
    setIsWalletConnected: (connected: boolean) => void;
    setAccount: (account: string) => void;
    initializeContracts: () => Promise<void>;
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
  const [giveawayDistContract, setGiveawayDistContract]  = useState<ethers.Contract>();
  const [raynPaymentContract, setRaynPaymentContract]  = useState<ethers.Contract>();
  const [raynStableContract, setRaynStableContract]  = useState<ethers.Contract>();
  const [usernameRegContract, setUsernameRegContract]  = useState<ethers.Contract>();
  const [error, setError] = useState<string>();

  const initializeContracts = useCallback(async() => {
    if(!selectedWallet?.provider){
        setError("No Wallet Connected");
        return;
    }

    try{
        const provider = new ethers.BrowserProvider(selectedWallet.provider);
        const signer = await provider.getSigner();

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
          const usernameRegInstance = new ethers.Contract(
              usernameReg_address,
              usernameReg_ABI,
              signer
          );
          setUsernameRegContract(usernameRegInstance);
        } else {
          console.warn("UsernameRegistry contract address not configured");
        }

        console.log("Wallet connected successfully, contracts initialized (where addresses are available)");
    }catch(error){
        console.error("Failed to initialize contracts:", error);
        setError("Failed to initialize contracts");
    }
  }, [selectedWallet]);

  useEffect(()=>{
    if(isWalletConnected && selectedWallet){
        initializeContracts();
    }
  }, [isWalletConnected, selectedWallet, initializeContracts]);

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
        error,
        setSelectedWallet,
        setIsWalletConnected,
        setAccount,
        initializeContracts
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
