import React from 'react';
import rewards from '../assets/rewards.jpg';
import { motion } from "framer-motion";
import token from '../assets/naira.svg';
import token2 from '../assets/usdc.svg';

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
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#191022] via-[#231036] to-[#191022] text-white font-DMSans">
      {/* Header */}
      <header className="p-4 sm:p-6 md:p-8 border-b border-purple-800/30">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center transform rotate-45">
            <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-white rounded transform -rotate-45"></div>
          </div>
          <span className="text-xl sm:text-2xl md:text-3xl font-bold">Rayn</span>
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
    </div>
  );
};

export default Rewards;
