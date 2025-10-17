import React, { useState } from 'react';
import { X, User } from 'lucide-react';
import Logo from '../assets/Logo.png';

const Send: React.FC = () => {
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setRecipient(e.target.value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setAmount(e.target.value);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setNote(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#191022] via-[#231036] to-[#191022] text-white font-DMSans">
      {/* Header */}
      <header className="p-4 sm:p-6 md:p-8">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <img src={Logo} alt="Rayn logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
            <span className="text-xl sm:text-2xl font-bold">Rayn</span>
          </div>

          {/* Close Button */}
          <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-800/50 hover:bg-gray-700/50 flex items-center justify-center transition-colors">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12">
        {/* Title Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">Send</h1>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg">
            Send stablecoins to anyone instantly.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6 sm:space-y-8">
          {/* To Field */}
          <div>
            <label className="block text-sm sm:text-base font-medium mb-3">To</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={recipient}
                onChange={handleRecipientChange}
                placeholder="@username or wallet address"
                className="w-full bg-[#1e1533] border border-purple-900/30 rounded-xl sm:rounded-2xl py-4 sm:py-5 pl-12 pr-4 text-base sm:text-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-600/50 transition-colors"
              />
            </div>
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-sm sm:text-base font-medium mb-3">Amount</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg sm:text-xl">
                $
              </div>
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="w-full bg-[#1e1533] border border-purple-900/30 rounded-xl sm:rounded-2xl py-4 sm:py-5 pl-12 pr-4 text-base sm:text-lg text-white placeholder-gray-500 text-right focus:outline-none focus:border-purple-600/50 transition-colors"
              />
            </div>
          </div>

          {/* Note Field */}
          <div>
            <label className="block text-sm sm:text-base font-medium mb-3">
              Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={handleNoteChange}
              placeholder="What's this for?"
              rows={4}
              className="w-full bg-[#1e1533] border border-purple-900/30 rounded-xl sm:rounded-2xl py-4 px-4 text-base sm:text-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-600/50 transition-colors resize-none"
            />
          </div>

          {/* Gas Fee */}
          <div className="flex items-center justify-between text-sm sm:text-base">
            <span className="text-gray-400">Estimated gas fee:</span>
            <span className="text-white font-medium">0.00001 ETH</span>
          </div>

          {/* Send Button */}
          <button className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold py-4 sm:py-5 px-6 rounded-xl sm:rounded-2xl text-base sm:text-lg md:text-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-purple-500/30">
            Send
          </button>
        </div>
      </main>
    </div>
  );
};

export default Send;
