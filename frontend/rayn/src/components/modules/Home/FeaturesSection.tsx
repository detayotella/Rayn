import { User, Gift, Shield, Wallet, ArrowLeftRight, Lock } from 'lucide-react';

export default function FeaturesSection() {
  return (
    <section id="features" className="relative bg-gradient-to-b from-[#251435] via-purple-900/20 to-[#251435] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 opacity-0 animate-fade-in-up">
          <span className="inline-block px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-semibold mb-4">
            Why Choose Rayn
          </span>
          <h2 className="text-fluid-title font-bold mb-4 text-white">
            Crypto Giveaways <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Reimagined</span>
          </h2>
          <p className="text-gray-300 text-fluid-subtitle max-w-3xl mx-auto leading-relaxed">
            Create giveaways, reward your community, and distribute stablecoins effortlessly using usernames.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {/* Feature 1 */}
          <div className="group relative bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105 opacity-0 animate-fade-in-up delay-100">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl flex items-center justify-center mb-5 sm:mb-6 shadow-lg shadow-purple-500/30">
                <Gift className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Create Giveaways</h3>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                Launch your own stablecoin giveaways in minutes. Set rules, add participants, and distribute rewards automatically.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105 opacity-0 animate-fade-in-up delay-200">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl flex items-center justify-center mb-5 sm:mb-6 shadow-lg shadow-purple-500/30">
                <User className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Username Distribution</h3>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                Simply enter receiver's username to send rewards without requiring wallet addresses. It's fast, easy, and user-friendly.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105 opacity-0 animate-fade-in-up delay-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl flex items-center justify-center mb-5 sm:mb-6 shadow-lg shadow-purple-500/30">
                <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Blockchain Secured</h3>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                All transactions are secured on Ethereum blockchain. Transparent, immutable, and verifiable.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="group relative bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105 opacity-0 animate-fade-in-up delay-400">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl flex items-center justify-center mb-5 sm:mb-6 shadow-lg shadow-purple-500/30">
                <Wallet className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Your Keys, Your Crypto</h3>
              <p className="text-gray-300 leading-relaxedeta text-sm sm:text-base">
                Connect your MetaMask or any Web3 wallet. You always remain in full control of your funds.
              </p>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="group relative bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105 opacity-0 animate-fade-in-up delay-500">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl flex items-center justify-center mb-5 sm:mb-6 shadow-lg shadow-purple-500/30">
                <ArrowLeftRight className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Participate & Earn</h3>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                Browse active giveaways, join with one click, and receive stablecoins instantly when you win.
              </p>
            </div>
          </div>

          {/* Feature 6 */}
          <div className="group relative bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105 opacity-0 animate-fade-in-up delay-600">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl flex items-center justify-center mb-5 sm:mb-6 shadow-lg shadow-purple-500/30">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Built for Africa</h3>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                Designed specifically for African users with mobile-first experience and local currency support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
