import React from 'react';
import { AppRouter } from './router';
import { AppProvider } from './context/AppContext';
import NotificationToast from './components/common/NotificationToast';

const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="mx-auto font-dmsans text-[16px] text-dark w-[100%]">
        <AppRouter />
        <NotificationToast />
      </div>
    </AppProvider>
  )
}

export default App;
