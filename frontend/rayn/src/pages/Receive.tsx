import React, { useState } from 'react';
import { X, Link2, CheckCircle } from 'lucide-react';

export default function Receive(): React.JSX.Element {
    const [amount, setAmount] = useState<string>('');
    const [note, setNote] = useState<string>('');
    const [showNotification, setShowNotification] = useState<boolean>(true);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setAmount(e.target.value);
    };

    const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setNote(e.target.value);
    };

    const handleCloseNotification = (): void => {
        setShowNotification(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#191022] via-[#231036] to-[#191022] text-white">
            {/* Header */}
            <header className="p-4 sm:p-6 md:p-8">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-950 to-purple-900 rounded-lg flex items-center justify-center transform rotate-45">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded transform -rotate-45"></div>
                        </div>
                        <span className="text-xl sm:text-2xl font-bold">Rayn</span>
                    </div>

                    {/* Close Button */}
                    <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-800/50 hover:bg-gray-700/50 flex items-center justify-center transition-colors">
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex items-center justify-center min-h-[calc(100vh-120px)] px-4 sm:px-6 md:px-8">
                <div className="w-full max-w-2xl">
                    {/* Title Section */}
                    <div className="text-center mb-8 sm:mb-12">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">Receive Payment</h1>
                        <p className="text-gray-400 text-sm sm:text-base md:text-lg">
                            Generate a QR code to request funds.
                        </p>
                    </div>

                    {/* Content Grid */}
                    <div className="relative">
                        {/* QR Code Section */}
                        <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-purple-700/30 max-w-md mx-auto">
                            {/* QR Code Display */}
                            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 sm:p-8 mb-6 flex items-center justify-center shadow-2xl">
                                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                                    {/* QR Code Placeholder - Using SVG pattern for demo */}
                                    <svg width="200" height="200" viewBox="0 0 200 200" className="w-full h-auto max-w-[200px]">
                                        <rect width="200" height="200" fill="white" />
                                        {/* QR Code pattern simulation */}
                                        <g fill="black">
                                            <rect x="20" y="20" width="40" height="40" />
                                            <rect x="140" y="20" width="40" height="40" />
                                            <rect x="20" y="140" width="40" height="40" />
                                            <rect x="30" y="30" width="20" height="20" fill="white" />
                                            <rect x="150" y="30" width="20" height="20" fill="white" />
                                            <rect x="30" y="150" width="20" height="20" fill="white" />
                                            {/* Random pattern blocks */}
                                            <rect x="80" y="30" width="10" height="10" />
                                            <rect x="100" y="40" width="10" height="10" />
                                            <rect x="70" y="60" width="10" height="10" />
                                            <rect x="120" y="70" width="10" height="10" />
                                            <rect x="90" y="80" width="10" height="10" />
                                            <rect x="110" y="90" width="10" height="10" />
                                            <rect x="80" y="100" width="10" height="10" />
                                            <rect x="130" y="110" width="10" height="10" />
                                            <rect x="70" y="120" width="10" height="10" />
                                            <rect x="100" y="130" width="10" height="10" />
                                            <rect x="90" y="140" width="10" height="10" />
                                            <rect x="120" y="150" width="10" height="10" />
                                            <rect x="140" y="100" width="10" height="10" />
                                            <rect x="160" y="120" width="10" height="10" />
                                        </g>
                                    </svg>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-4 sm:space-y-5">
                                {/* Amount Field */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Amount</label>
                                    <input
                                        type="text"
                                        value={amount}
                                        onChange={handleAmountChange}
                                        placeholder="$ 0.00"
                                        className="w-full bg-[#1e1533] border border-purple-900/30 rounded-xl py-3 sm:py-4 px-4 text-base text-white placeholder-gray-500 focus:outline-none focus:border-purple-600/50 transition-colors"
                                    />
                                </div>

                                {/* Note Field */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Note (optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={note}
                                        onChange={handleNoteChange}
                                        placeholder="For coffee"
                                        className="w-full bg-[#1e1533] border border-purple-900/30 rounded-xl py-3 sm:py-4 px-4 text-base text-white placeholder-gray-500 focus:outline-none focus:border-purple-600/50 transition-colors"
                                    />
                                </div>

                                {/* Share Link Button */}
                                <button className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl sm:rounded-2xl text-base sm:text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2">
                                    <Link2 className="w-5 h-5" />
                                    Share Link
                                </button>
                            </div>

                            {/* Helper Text */}
                            <p className="text-center text-gray-400 text-sm mt-6">
                                Share this link with the sender to receive funds.
                            </p>
                        </div>

                        {/* Notification Toast */}
                        {showNotification && (
                            <div className="absolute top-0 right-0 w-full max-w-xs">
                                <div className="bg-gradient-to-br from-teal-900/40 to-teal-800/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-teal-700/30 relative">
                                    <button
                                        onClick={handleCloseNotification}
                                        className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-base sm:text-lg mb-1">Received $50.00</p>
                                            <p className="text-gray-400 text-sm">From @john.doe</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
