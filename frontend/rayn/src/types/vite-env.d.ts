/// <reference types="vite/client"/>

interface EIP6963ProviderInfo{
    uuid:string;
    name: string;
    icon:string;
    rdns: string;
}

interface EIP6963Provider{
    request:(request:{
        method: string;
        params?: Array<unknown>;
    }) => Promise<unknown>;
}

interface EIP6963ProviderDetail{
    info:EIP6963ProviderInfo;
    provider: EIP6963Provider;
}

type EIP6963AnnounceProviderEvent = {
    info: EIP6963ProviderInfo;
    provider: EIP6963Provider;
};