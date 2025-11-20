import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from "framer-motion";
import { createStagger, fadeInDown, fadeInUp, scaleIn } from "../../../utils/animations";

export default function CTASection() {
  const stagger = createStagger(0.2, 0.1);

  return (
    <motion.section
      className="relative py-16 sm:py-24 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Background Effects */}
      <motion.div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-purple-500/20 to-pink-600/30" variants={scaleIn}></motion.div>
      <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/20 rounded-full blur-3xl" variants={scaleIn}></motion.div>
      
      <motion.div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" variants={stagger}>
        <motion.div className="bg-gradient-to-br from-purple-900/60 to-purple-800/40 backdrop-blur-xl rounded-3xl border border-purple-500/30 p-6 sm:p-10 lg:p-16 text-center shadow-2xl" variants={scaleIn}>
          {/* Badge */}
          <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-400/30 backdrop-blur-sm mb-6" variants={fadeInDown}>
            <span className="text-sm text-purple-200 font-semibold">Community Giveaways</span>
          </motion.div>
          
          <motion.h2 className="text-fluid-title font-bold mb-4 sm:mb-6 text-white leading-tight" variants={fadeInUp}>
            Ready to Reward Your
            <span className="block mt-2 bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              Community?
            </span>
          </motion.h2>
          
          <motion.p className="max-w-2xl mx-auto text-fluid-subtitle text-gray-300 mb-8 sm:mb-10 leading-relaxed" variants={fadeInUp}>
            Create crypto giveaways in minutes, or join existing ones to earn free stablecoins.
            Built for communities that want to reward and grow together.
          </motion.p>
          
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center items-center" variants={fadeInUp}>
            <Link to="/onboarding">
              <button className="group bg-gradient-to-r from-white to-gray-100 text-purple-700 px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-2 text-lg">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/sign-up">
              <button className="border-2 border-white/40 hover:border-white/60 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold transition-all backdrop-blur-sm text-lg">
                Create Giveaway
              </button>
            </Link>
          </motion.div>
          
          {/* Stats */}
          <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-purple-400/20" variants={fadeInUp}>
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="text-fluid-title font-bold text-white mb-1">Free</div>
              <div className="text-xs sm:text-sm text-gray-400">To Create</div>
            </motion.div>
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="text-fluid-title font-bold text-white mb-1">Username</div>
              <div className="text-xs sm:text-sm text-gray-400">Distribution</div>
            </motion.div>
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="text-fluid-title font-bold text-white mb-1">Instant</div>
              <div className="text-xs sm:text-sm text-gray-400">Rewards</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
