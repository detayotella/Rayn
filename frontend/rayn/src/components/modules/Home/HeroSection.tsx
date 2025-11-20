import { Link } from "react-router";
import { motion } from "framer-motion";
import RaynMockup from '../../../assets/Rayn.png';

import { Shield, Zap, Users } from 'lucide-react';
import { fadeInDown, fadeInRight, fadeInUp, scaleIn, createStagger } from "../../../utils/animations";

export default function HeroSection() {
  const heroStagger = createStagger();

  return (
    <motion.section
      className="relative bg-[#251435] overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
    >
      {/* Background Effects */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-purple-900/10"
        variants={fadeInDown}
      />
      <motion.div
        className="absolute top-20 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        variants={scaleIn}
      />
      <motion.div
        className="absolute bottom-20 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
        variants={scaleIn}
      />
      
      <motion.div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28" variants={heroStagger}>
        <div className="grid gap-10 lg:gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left Content */}
          <motion.div className="w-full space-y-6 sm:space-y-8 text-center lg:text-left" variants={heroStagger}>
            {/* Badge */}
            {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm text-purple-200 font-medium">Live on Sepolia Testnet</span>
            </div> */}
            
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-6xl font-bold leading-tight text-white"
              variants={fadeInUp}
            >
              Create & Join Crypto
              <span className="block mt-2 bg-gradient-to-r from-purple-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                Giveaways with Ease
              </span>
            </motion.h1>
            
            <motion.p
              className="text-gray-300 text-fluid-subtitle lg:w-4/5 leading-relaxed"
              variants={fadeInUp}
            >
              Host stablecoin giveaways for your community or participate in existing ones. 
              Send rewards using simple usernames - no complex wallet addresses needed.
            </motion.p>
            
            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start" variants={fadeInUp}>
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
            </motion.div>
            
            {/* Trust Indicators */}
            <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 sm:pt-8 border-t border-purple-500/20" variants={fadeInUp}>
              <motion.div className="text-center lg:text-left" variants={fadeInUp}>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-purple-300 mb-1">
                  <Users className="w-5 h-5" />
                  <span className="text-2xl font-bold text-white">Community</span>
                </div>
                <p className="text-sm text-gray-400">Driven Rewards</p>
              </motion.div>
              <motion.div className="text-center lg:text-left" variants={fadeInUp}>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-purple-300 mb-1">
                  <Zap className="w-5 h-5" />
                  <span className="text-2xl font-bold text-white">Instant</span>
                </div>
                <p className="text-sm text-gray-400">Transfers</p>
              </motion.div>
              <motion.div className="text-center lg:text-left" variants={fadeInUp}>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-purple-300 mb-1">
                  <Shield className="w-5 h-5" />
                  <span className="text-2xl font-bold text-white">Blockchain</span>
                </div>
                <p className="text-sm text-gray-400">Transparent</p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Illustration */}
          <motion.div className="flex justify-center lg:justify-end" variants={fadeInRight}>
            <motion.div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg" variants={scaleIn}>
              {/* Glow effect behind mockup */}
              <motion.div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-3xl opacity-30 animate-glow" variants={fadeInRight}></motion.div>
              <motion.img
                src={RaynMockup}
                alt="Rayn DeFi app interface"
                className="relative w-full h-auto rounded-3xl shadow-2xl shadow-purple-900/60 border border-purple-500/20 backdrop-blur-sm"
                variants={fadeInRight}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}
