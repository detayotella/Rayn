import React from "react";
import { AppRouter } from "./router";
import { AppProvider } from "./context/AppContext";
import { WalletProvider } from "./context/WalletContext";
import NotificationToast from "./components/common/NotificationToast";

const App: React.FC = () => {
  return (
    <AppProvider>
      <WalletProvider>
        <div className="min-h-screen font-dmsans text-base text-white">
          <AppRouter />
          <NotificationToast />
        </div>
      </WalletProvider>
    </AppProvider>
  );
};

export default App;
