// /// <reference types="vite/client"/>

// interface EIP6963ProviderInfo{
//     uuid:string;
//     name: string;
//     icon:string;
//     rdns: string;
// }

// interface EIP6963Provider{
//     request:(request:{
//         method: string;
//         params?: Array<unknown>;
//     }) => Promise<unknown>;
// }

// interface EIP6963ProviderDetail{
//     info:EIP6963ProviderInfo;
//     provider: EIP6963Provider;
// }

// type EIP6963AnnounceProviderEvent = {
//     info: EIP6963ProviderInfo;
//     provider: EIP6963Provider;
// };

/// <reference types="vite/client" />

// Ethereum Provider Interface
interface EthereumProvider {
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
  isWalletConnect?: boolean;
  providers?: EthereumProvider[];
  request(args: { method: string; params?: any[] }): Promise<any>;
  on(eventName: string, handler: (...args: any[]) => void): void;
  removeListener(eventName: string, handler: (...args: any[]) => void): void;
  removeAllListeners?(eventName?: string): void;
}

// EIP-6963 Provider Detail Interface
interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

interface EIP6963Provider extends EthereumProvider {
  // Inherits all methods from EthereumProvider
}

interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: EIP6963Provider;
}

// Extend Window interface
declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }

  // EIP-6963 events
  interface WindowEventMap {
    "eip6963:announceProvider": CustomEvent<EIP6963ProviderDetail>;
  }
}

export {};
