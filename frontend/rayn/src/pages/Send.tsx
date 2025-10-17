import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { X, User } from 'lucide-react';
import Logo from '../assets/Logo.png';
import { useApp } from '../context/AppContext';
import AppLayout from '../components/layout/AppLayout';

const Send: React.FC = () => {
  const navigate = useNavigate();
  const { addTransaction, addNotification, setIsLoading, user } = useApp();
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setRecipient(e.target.value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setAmount(e.target.value);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setNote(e.target.value);
  };

  const handleSend = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');

    // Validation
    if (!recipient.trim()) {
      setError('Please enter a recipient');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const numAmount = parseFloat(amount);
    if (user && numAmount > user.balance) {
      setError('Insufficient balance');
      return;
    }

    setIsLoading(true);

    // Simulate transaction processing
    setTimeout(() => {
      // Add transaction to context
      addTransaction({
        amount: numAmount,
        description: `Sent to ${recipient}`,
        time: 'Just now',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        type: 'sent',
        recipient: recipient
      });

      // Show success notification
      addNotification({
        type: 'success',
        title: 'Transaction Successful!',
        message: `Sent $${numAmount.toFixed(2)} to ${recipient}`
      });

      setIsLoading(false);

      // Navigate back to dashboard
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <AppLayout>
      {/* Page Header */}
      <header className="border-b border-purple-900/30 bg-[#1a0b2e]/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Page Title */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/dashboard')}
                className="lg:hidden p-2 hover:bg-purple-900/30 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <button 
                onClick={() => navigate('/')}
                className="lg:hidden flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <img src={Logo} alt="Rayn logo" className="w-8 h-8 object-contain" />
                <span className="text-xl font-bold">Rayn</span>
              </button>
              <h1 className="hidden lg:block text-2xl font-bold text-white">Send Money</h1>
            </div>
            
            {/* Close Button - Desktop */}
            <button 
              onClick={() => navigate('/dashboard')}
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-purple-900/30 transition-colors"
            >
              <X className="w-5 h-5" />
              <span>Close</span>
            </button>
          </div>
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
        <form onSubmit={handleSend} className="space-y-6 sm:space-y-8">
          {/* Error Message */}
          {error && (
            <div className="bg-red-900/40 border border-red-700/30 rounded-xl p-4 text-red-200 text-sm">
              {error}
            </div>
          )}
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
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold py-4 sm:py-5 px-6 rounded-xl sm:rounded-2xl text-base sm:text-lg md:text-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </main>
    </AppLayout>
  );
};

export default Send;
