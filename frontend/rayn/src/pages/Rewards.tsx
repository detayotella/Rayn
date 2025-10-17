import React from 'react';
import { useNavigate } from 'react-router';
import rewards from '../assets/rewards.jpg';
import { motion } from "framer-motion";
import token from '../assets/naira.svg';
import token2 from '../assets/usdc.svg';
import Logo from '../assets/Logo.png';
import AppLayout from '../components/layout/AppLayout';
import { Bell } from 'lucide-react';

const bouncingVariants = {
  bounce: {
    y: [0, -50, 0],
    x: [0, 20, -20, 0],
    transition: {
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror" as const,
      ease: "easeInOut" as const,
    },
  },
};

const Rewards: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <AppLayout>
      {/* Page Header */}
      <header className="border-b border-purple-900/30 bg-[#1a0b2e]/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile: Logo */}
            <div className="lg:hidden flex items-center gap-2">
              <img src={Logo} alt="Rayn logo" className="w-8 h-8 object-contain" />
              <span className="text-xl font-bold">Rayn</span>
            </div>
            
            {/* Desktop: Page Title */}
            <h1 className="hidden lg:block text-2xl font-bold text-white">Rewards</h1>

            {/* User Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/notifications')}
                className="p-2 hover:bg-purple-900/30 rounded-full transition-colors"
              >
                <Bell className="w-5 h-5" />
              </button>
              <button 
                onClick={() => navigate('/profile-summary')}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 overflow-hidden ring-2 ring-purple-500/20 hover:ring-purple-500/40 transition-all"
              >
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        {/* Card Container */}
        <div className="w-full max-w-md lg:max-w-lg">
          {/* Illustration Card */}
          <div className="relative mb-6 sm:mb-8 md:mb-10">
            <div className="bg-gradient-to-br from-orange-300 via-orange-200 to-purple-200 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl aspect-video">
              <div className="relative w-full h-full p-6 sm:p-8 md:p-10 flex items-center justify-center">
                {/* Simplified illustration */}
                <div className="relative flex items-center justify-center gap-4 sm:gap-6 md:gap-8">
                  {/* Person */}
                  <div className="flex flex-col items-center">
                    <img src={rewards} alt="" className="w-full h-full sm:w-40 sm:h-40 md:w-full md:h-full rounded-xl object-cover shadow-lg" />

                  </div>

                </div>

                {/* Decorative elements */}
                <motion.img
                  src={token}
                  alt=""
                  className="absolute top-4 right-4"
                  variants={bouncingVariants}
                  animate="bounce"
                />
                <motion.img
                  src={token2}
                  alt=""
                  className="absolute bottom-6 left-6"
                  variants={bouncingVariants}
                  animate="bounce"
                />
                
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Claim your first reward
            </h1>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed px-2 sm:px-4">
              Learn the basics of crypto and claim your welcome gift. It's our way of saying thanks for joining the Rayn community.
            </p>
          </div>

          {/* Claim Button */}
          <button className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold py-4 sm:py-5 px-6 rounded-xl sm:rounded-2xl text-base sm:text-lg md:text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-purple-500/50">
            Claim
          </button>
        </div>
      </main>
    </AppLayout>
  );
};

export default Rewards;
