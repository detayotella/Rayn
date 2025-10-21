import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export default function CTASection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-purple-500/20 to-pink-600/30"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/20 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-purple-900/60 to-purple-800/40 backdrop-blur-xl rounded-3xl border border-purple-500/30 p-8 sm:p-12 lg:p-16 text-center shadow-2xl opacity-0 animate-scale-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-400/30 backdrop-blur-sm mb-6 opacity-0 animate-fade-in-down delay-100">
            <span className="text-sm text-purple-200 font-semibold">Community Giveaways</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-white leading-tight opacity-0 animate-fade-in-up delay-200">
            Ready to Reward Your
            <span className="block mt-2 bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              Community?
            </span>
          </h2>
          
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-300 mb-10 leading-relaxed opacity-0 animate-fade-in-up delay-300">
            Create crypto giveaways in minutes, or join existing ones to earn free stablecoins.
            Built for communities that want to reward and grow together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0 animate-fade-in-up delay-400">
            <Link to="/giveaway">
              <button className="group bg-gradient-to-r from-white to-gray-100 text-purple-700 px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-2 text-lg">
                Browse Giveaways
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/sign-up">
              <button className="border-2 border-white/40 hover:border-white/60 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold transition-all backdrop-blur-sm text-lg">
                Create Giveaway
              </button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-purple-400/20 opacity-0 animate-fade-in-up delay-500">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">Free</div>
              <div className="text-sm text-gray-400">To Create</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">@username</div>
              <div className="text-sm text-gray-400">Distribution</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">Instant</div>
              <div className="text-sm text-gray-400">Rewards</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
