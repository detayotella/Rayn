import React, { useState } from 'react';
import { Bell, ChevronDown, DollarSign } from 'lucide-react';

export default function Transactions() {
  const [filterType, setFilterType] = useState('All');
  const [filterTime, setFilterTime] = useState('Today');

  const transactions = [
    {
      section: 'Today',
      items: [
        { type: 'Received', amount: 100.00, currency: 'KES', converted: 10.000 },
        { type: 'Sent', amount: -50.00, currency: 'KES', converted: 5.000 }
      ]
    },
    {
      section: 'Yesterday',
      items: [
        { type: 'Received', amount: 200.00, currency: 'KES', converted: 20.000 },
        { type: 'Sent', amount: -75.00, currency: 'KES', converted: 7.500 }
      ]
    },
    {
      section: 'Last Week',
      items: [
        { type: 'Received', amount: 150.00, currency: 'KES', converted: 15.000 },
        { type: 'Sent', amount: -120.00, currency: 'KES', converted: 12.000 }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#191022] via-[#231036] to-[#191022] text-white font-DMSans">
      {/* Header */}
      <header className="border-b border-purple-900/30 bg-[#1a0b2e]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center transform rotate-45">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded transform -rotate-45"></div>
              </div>
              <span className="text-xl sm:text-2xl font-bold">Rayn</span>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button className="p-2 hover:bg-purple-900/30 rounded-full transition-colors">
                <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
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
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Transactions</h1>
          <button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold py-3 px-6 sm:px-8 rounded-xl sm:rounded-2xl text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30">
            Send Money
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex gap-3 sm:gap-4">
            {/* Type Filter */}
            <div className="relative">
              <button className="bg-purple-900/40 hover:bg-purple-800/50 border border-purple-700/30 text-white font-medium py-2.5 px-4 sm:px-6 rounded-xl flex items-center gap-2 transition-all">
                {filterType}
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Time Filter */}
            <div className="relative">
              <button className="bg-purple-900/40 hover:bg-purple-800/50 border border-purple-700/30 text-white font-medium py-2.5 px-4 sm:px-6 rounded-xl flex items-center gap-2 transition-all">
                {filterTime}
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Currency Converter */}
          <div className="text-sm sm:text-base">
            <span className="text-gray-400 mr-2">Convert to:</span>
            <span className="text-purple-400 font-semibold">KES</span>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-8 sm:space-y-10">
          {transactions.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {/* Section Header */}
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{section.section}</h2>

              {/* Transaction Items */}
              <div className="space-y-3 sm:space-y-4">
                {section.items.map((transaction, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-700/30 hover:border-purple-600/50 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      {/* Left Side - Icon and Details */}
                      <div className="flex items-center gap-3 sm:gap-4">
                        {/* Icon */}
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600/30 rounded-xl flex items-center justify-center flex-shrink-0">
                          <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                        </div>

                        {/* Transaction Info */}
                        <div>
                          <p className="font-semibold text-base sm:text-lg mb-1">USD Coin</p>
                          <p className={`text-sm sm:text-base ${
                            transaction.type === 'Received' ? 'text-purple-400' : 'text-purple-300'
                          }`}>
                            {transaction.type}
                          </p>
                        </div>
                      </div>

                      {/* Right Side - Amount */}
                      <div className="text-right">
                        <p className={`font-bold text-lg sm:text-xl mb-1 ${
                          transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount < 0 ? '-' : ''}${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                        <p className="text-gray-400 text-sm sm:text-base">
                          {transaction.converted.toFixed(3)} {transaction.currency}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}