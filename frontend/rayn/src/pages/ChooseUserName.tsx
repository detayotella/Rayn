import React, { useState } from 'react';

export default function ChooseUsernamePage(): React.JSX.Element {
  const [username, setUsername] = useState<string>('');

  const handleContinue = (): void => {
    if (username) {
      alert(`Username selected: @${username}`);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#191022] to-[#231036] flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800/50 py-4 sm:py-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3">
          <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-purple-600 rounded-lg flex items-center justify-center transform rotate-45">
            <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 bg-white rounded-sm transform -rotate-45"></div>
          </div>
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Rayn</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md text-center">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-5 md:mb-6 px-4 leading-tight">
            Choose your
            <br />
            @username
          </h1>

          {/* Description */}
          <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-8 sm:mb-10 md:mb-12 px-4 leading-relaxed">
            Your @username is how friends can find you on Rayn. It must be unique.
          </p>

          {/* Username Input */}
          <div className="mb-6 sm:mb-8 px-4">
            <div className="relative">
              <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-500 text-base sm:text-lg">@</span>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="username"
                className="w-full bg-transparent border border-gray-700/50 rounded-2xl py-3 sm:py-4 pl-9 sm:pl-10 pr-4 sm:pr-5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-600 transition-colors text-base sm:text-lg"
              />
            </div>
          </div>

          {/* Continue Button */}
          <div className="px-4 mb-4 sm:mb-5">
            <button
              onClick={handleContinue}
              disabled={!username}
              className="w-full max-w-md bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-base sm:text-lg font-semibold py-3 sm:py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 mx-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Continue
            </button>
          </div>

          {/* Skip Link */}
          <button className="text-purple-500 hover:text-purple-400 text-sm sm:text-base transition-colors">
            Skip for now
          </button>
        </div>
      </main>
    </div>
  );
}