import { User, Gift, Shield, Wallet, ArrowLeftRight, Lock } from 'lucide-react';

export default function FeaturesSection() {
  return (
    <section id="features" className="relative bg-gradient-to-b from-[#251435] via-purple-900/20 to-[#251435] py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-20 opacity-0 animate-fade-in-up">
          <span className="inline-block px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-semibold mb-4">
            Why Choose Rayn
          </span>
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-white">
            Crypto Giveaways <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Reimagined</span>
          </h2>
          <p className="text-gray-300 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
            Create giveaways, reward your community, and distribute stablecoins effortlessly using usernames.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Feature 1 */}
          <div className="group relative bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105 opacity-0 animate-fade-in-up delay-100">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                <Gift className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Create Giveaways</h3>
              <p className="text-gray-300 leading-relaxed">
                Launch your own stablecoin giveaways in minutes. Set rules, add participants, and distribute rewards automatically.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105 opacity-0 animate-fade-in-up delay-200">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                <User className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">@Username Distribution</h3>
              <p className="text-gray-300 leading-relaxed">
                Simply enter receiver's username to send rewards without requiring wallet addresses. It's fast, easy, and user-friendly.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105 opacity-0 animate-fade-in-up delay-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Blockchain Secured</h3>
              <p className="text-gray-300 leading-relaxed">
                All transactions are secured on Ethereum blockchain. Transparent, immutable, and verifiable.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="group relative bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105 opacity-0 animate-fade-in-up delay-400">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                <Wallet className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Your Keys, Your Crypto</h3>
              <p className="text-gray-300 leading-relaxed">
                Connect your MetaMask or any Web3 wallet. You always remain in full control of your funds.
              </p>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="group relative bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105 opacity-0 animate-fade-in-up delay-500">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                <ArrowLeftRight className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Participate & Earn</h3>
              <p className="text-gray-300 leading-relaxed">
                Browse active giveaways, join with one click, and receive stablecoins instantly when you win.
              </p>
            </div>
          </div>

          {/* Feature 6 */}
          <div className="group relative bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105 opacity-0 animate-fade-in-up delay-600">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Built for Africa</h3>
              <p className="text-gray-300 leading-relaxed">
                Designed specifically for African users with mobile-first experience and local currency support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
