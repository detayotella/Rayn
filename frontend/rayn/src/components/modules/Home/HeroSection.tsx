import { Link } from "react-router";
import RaynMockup from '../../../assets/Rayn.png';

import { Shield, Zap, Users } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative bg-[#251435] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-purple-900/10"></div>
      <div className="absolute top-20 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Content */}
          <div className="w-full space-y-8 text-center lg:text-left opacity-0 animate-fade-in-up">
            {/* Badge */}
            {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm text-purple-200 font-medium">Live on Sepolia Testnet</span>
            </div> */}
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-6xl font-bold leading-tight text-white opacity-0 animate-fade-in-up delay-100">
              Create & Join Crypto
              <span className="block mt-2 bg-gradient-to-r from-purple-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                Giveaways with Ease
              </span>
            </h1>
            
            <p className="text-gray-300 text-lg sm:text-xl lg:w-4/5 leading-relaxed opacity-0 animate-fade-in-up delay-200">
              Host stablecoin giveaways for your community or participate in existing ones. 
              Send rewards using simple usernames - no complex wallet addresses needed.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start opacity-0 animate-fade-in-up delay-300">
              <Link to="/sign-up">
                <button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 px-8 py-4 rounded-xl font-semibold transition-all shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 text-white text-lg">
                  Launch App →
                </button>
              </Link>
              <Link to="/sign-up">
                <button className="border-2 border-purple-500/30 hover:border-purple-500/50 bg-purple-500/5 hover:bg-purple-500/10 px-8 py-4 rounded-xl font-semibold transition-all text-white text-lg backdrop-blur-sm">
                  Create Giveaway
                </button>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-purple-500/20 opacity-0 animate-fade-in-up delay-400">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-purple-300 mb-1">
                  <Users className="w-5 h-5" />
                  <span className="text-2xl font-bold text-white">Community</span>
                </div>
                <p className="text-sm text-gray-400">Driven Rewards</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-purple-300 mb-1">
                  <Zap className="w-5 h-5" />
                  <span className="text-2xl font-bold text-white">Instant</span>
                </div>
                <p className="text-sm text-gray-400">Transfers</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-purple-300 mb-1">
                  <Shield className="w-5 h-5" />
                  <span className="text-2xl font-bold text-white">Blockchain</span>
                </div>
                <p className="text-sm text-gray-400">Transparent</p>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="flex justify-center lg:justify-end opacity-0 animate-scale-in delay-300">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
              {/* Glow effect behind mockup */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-3xl opacity-30 animate-glow"></div>
              <img
                src={RaynMockup}
                alt="Rayn DeFi app interface"
                className="relative w-full h-auto rounded-3xl shadow-2xl shadow-purple-900/60 border border-purple-500/20 backdrop-blur-sm transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
