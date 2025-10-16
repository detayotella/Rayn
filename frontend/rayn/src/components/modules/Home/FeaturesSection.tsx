import { User, Gift, Shield } from 'lucide-react';

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-[#191022] py-20">
      <div className="w-full px-2 sm:px-6 lg:px-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white">Key Features</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Rayn offers a range of features designed to make stablecoin transactions simple and secure for African users.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 lg:gap-10">
          <div className="bg-[#2A1A3E] rounded-2xl p-6 md:p-8 border border-purple-700/30">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
              <User className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-white">Username-Based Transfers</h3>
            <p className="text-gray-300">
              Send and receive stablecoins using simple usernames, eliminating the need for complex wallet addresses.
            </p>
          </div>
          <div className="bg-[#2A1A3E] rounded-2xl p-6 md:p-8 border border-purple-700/30">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-white">Community Giveaways</h3>
            <p className="text-gray-300">
              Participate in community-driven giveaways to boost adoption and reward users.
            </p>
          </div>
          <div className="bg-[#2A1A3E] rounded-2xl p-6 md:p-8 border border-purple-700/30">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-white">Secure Transactions</h3>
            <p className="text-gray-300">
              Benefit from secure and transparent transactions powered by blockchain technology.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
