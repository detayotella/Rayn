declare global {
  interface WindowEventMap {
    "eip6963:announceProvider": CustomEvent<EIP6963AnnounceProviderEvent>;
  }
}

let providers: EIP6963ProviderDetail[] = [];

export const store = {
  value: () => providers,

  subscribe: (callback: () => void) => {
    function onAnnouncement(event: CustomEvent<EIP6963AnnounceProviderEvent>) {
      if (providers.some((p) => p.info.uuid == event.detail.info.uuid)) return;
      providers = [...providers, event.detail];
      callback();
    }

    window.addEventListener("eip6963:announceProvider", onAnnouncement);
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    return () =>
      window.removeEventListener(
        "eip6963:announceProvider",
        onAnnouncement as EventListener
      );
  },
};
