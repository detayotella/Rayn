import React from 'react';
import { Bell, Gift, ArrowUp, ArrowDown } from 'lucide-react';

interface Transaction {
  id: number;
  amount: number;
  description: string;
  time: string;
  avatar: string;
}

export default function Dashboard(): JSX.Element {
  const transactions: Transaction[] = [
    {
      id: 1,
      amount: 250.00,
      description: "Received from Sarah",
      time: "2d ago",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
    },
    {
      id: 2,
      amount: 150.00,
      description: "Sent to David",
      time: "3d ago",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    },
    {
      id: 3,
      amount: 300.00,
      description: "Received from Michael",
      time: "5d ago",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
    },
    {
      id: 4,
      amount: 200.00,
      description: "Sent to Jessica",
      time: "7d ago",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#191022] via-[#231036] to-[#191022] text-white">
      {/* Header */}
      <header className="border-b border-purple-900/30 bg-[#1a0b2e]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center transform rotate-45">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded transform -rotate-45"></div>
              </div>
              <span className="text-xl sm:text-2xl font-bold">Rayn</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-white hover:text-purple-400 transition-colors">Home</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Transactions</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Giveaways</a>
            </nav>

            {/* User Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button className="p-2 hover:bg-purple-900/30 rounded-full transition-colors">
                <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 mb-6 sm:mb-8 border border-purple-700/30 shadow-2xl">
          <p className="text-gray-400 text-sm sm:text-base mb-2">Your Balance</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">$1,250.75</h1>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold py-4 sm:py-5 px-6 rounded-xl sm:rounded-2xl text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2">
            <ArrowUp className="w-5 h-5" />
            Send
          </button>
          <button className="bg-purple-900/40 hover:bg-purple-800/50 text-white font-semibold py-4 sm:py-5 px-6 rounded-xl sm:rounded-2xl text-base sm:text-lg transition-all duration-300 border border-purple-700/30 flex items-center justify-center gap-2">
            <ArrowDown className="w-5 h-5" />
            Receive
          </button>
          <button className="bg-purple-900/40 hover:bg-purple-800/50 text-white font-semibold py-4 sm:py-5 px-6 rounded-xl sm:rounded-2xl text-base sm:text-lg transition-all duration-300 border border-purple-700/30 flex items-center justify-center gap-2">
            <Gift className="w-5 h-5" />
            Giveaways
          </button>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Recent Activity</h2>
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
    </div>
  );
}
