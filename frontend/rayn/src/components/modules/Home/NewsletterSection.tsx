import React from 'react';

interface NewsletterSectionProps {
  email: string;
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubscribe: () => void;
}

import { Send } from 'lucide-react';

export default function NewsletterSection({ email, handleEmailChange, handleSubscribe }: NewsletterSectionProps) {
  return (
    <section className="bg-gradient-to-b from-[#251435] to-purple-900/20 py-24 sm:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-purple-900/60 to-purple-800/40 backdrop-blur-xl rounded-3xl p-8 sm:p-12 lg:p-16 border border-purple-500/30 text-center shadow-2xl overflow-hidden opacity-0 animate-scale-in">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-400/30 backdrop-blur-sm mb-6 opacity-0 animate-fade-in-down delay-100">
              <Send className="w-4 h-4 text-purple-300" />
              <span className="text-sm text-purple-200 font-semibold">Stay Updated</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white opacity-0 animate-fade-in-up delay-200">
              Join Our <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Community</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto opacity-0 animate-fade-in-up delay-300">
              Get updates on new features, exclusive giveaways, and tips for making the most of Rayn's stablecoin payments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto opacity-0 animate-fade-in-up delay-400">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
              />
              <button
                onClick={handleSubscribe}
                className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 px-8 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 text-white whitespace-nowrap flex items-center justify-center gap-2 hover:scale-105"
              >
                Subscribe
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
