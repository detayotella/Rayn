import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Bell, ArrowUp, ArrowDown, Gift } from 'lucide-react';
import Logo from '../assets/Logo.png';
import { useApp } from '../context/AppContext';
import AppLayout from '../components/layout/AppLayout';


export default function Dashboard(): React.JSX.Element {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, transactions: contextTransactions } = useApp();
  const locationState = (location.state as { profileImage?: string | null } | null) ?? undefined;

  useEffect(() => {
    const stateProfileImage = locationState?.profileImage;

    if (stateProfileImage) {
      setProfileImage(stateProfileImage);
      sessionStorage.setItem('raynProfileImage', stateProfileImage);
      return;
    }

    const storedProfileImage = sessionStorage.getItem('raynProfileImage');
    setProfileImage(storedProfileImage ?? null);
  }, [locationState]);

  // Use transactions from context
  const transactions = contextTransactions.slice(0, 4); // Show only latest 4

  return (
    <AppLayout>
      {/* Page Header */}
      <header className="border-b border-purple-900/30 bg-[#1a0b2e]/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Page Title - visible on mobile, hidden on desktop since sidebar shows logo */}
            <button 
              onClick={() => navigate('/')}
              className="lg:hidden flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img src={Logo} alt="Rayn logo" className="w-8 h-8 object-contain" />
              <span className="text-xl font-bold">Rayn</span>
            </button>
            
            <h1 className="hidden lg:block text-2xl font-bold text-white">Dashboard</h1>

            {/* User Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/notifications')}
                className="p-2 hover:bg-purple-900/30 rounded-full transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {/* Notification badge */}
                <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
              </button>
              <button 
                onClick={() => navigate('/profile-summary')}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 overflow-hidden ring-2 ring-purple-500/20 hover:ring-purple-500/40 transition-all"
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 mb-6 sm:mb-8 border border-purple-700/30 shadow-2xl">
          <p className="text-gray-400 text-sm sm:text-base mb-2">Your Balance</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">${user?.balance.toFixed(2) || '0.00'}</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-2">≈ {(user?.balance || 0) * 1650} NGN</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <button 
            onClick={() => navigate('/send')}
            className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold py-4 sm:py-5 px-6 rounded-xl sm:rounded-2xl text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
          >
            <ArrowUp className="w-5 h-5" />
            Send
          </button>
          <button 
            onClick={() => navigate('/receive')}
            className="bg-purple-900/40 hover:bg-purple-800/50 text-white font-semibold py-4 sm:py-5 px-6 rounded-xl sm:rounded-2xl text-base sm:text-lg transition-all duration-300 border border-purple-700/30 flex items-center justify-center gap-2"
          >
            <ArrowDown className="w-5 h-5" />
            Receive
          </button>
          <button 
            onClick={() => navigate('/giveaway')}
            className="bg-purple-900/40 hover:bg-purple-800/50 text-white font-semibold py-4 sm:py-5 px-6 rounded-xl sm:rounded-2xl text-base sm:text-lg transition-all duration-300 border border-purple-700/30 flex items-center justify-center gap-2"
          >
            <Gift className="w-5 h-5" />
            Giveaways
          </button>
        </div>

        {/* Recent Activity */}
        <div className="pb-20 md:pb-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold">Recent Activity</h2>
            <button 
              onClick={() => navigate('/transactions')}
              className="text-purple-400 hover:text-purple-300 text-sm sm:text-base transition-colors"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-700/30 hover:border-purple-600/50 transition-all duration-300 hover:transform hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 overflow-hidden flex-shrink-0">
                      <img 
                        src={transaction.avatar} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-lg sm:text-xl font-bold">${transaction.amount.toFixed(2)}</p>
                      <p className="text-gray-400 text-sm sm:text-base">{transaction.description}</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm sm:text-base">{transaction.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
