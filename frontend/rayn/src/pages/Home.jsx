import React, { useState } from 'react';
import { User, Gift, Shield, HelpCircle, Menu, X } from 'lucide-react';
import giveaway from "../assets/giveaway.jpg";
import { CiTwitter } from "react-icons/ci";
import { CiInstagram } from "react-icons/ci";
import { RxAvatar } from "react-icons/rx";
import femaleavatar from "../assets/femaleavatar.jpg";
import avatar1 from "../assets/avatar1.jpg";
import avatar2 from "../assets/avatar2.jpg";


  export default function Home() {
    const [email, setEmail] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleSubscribe = () => {
      if (email) {
        alert(`Subscribed with: ${email}`);
        setEmail('');
      }
    };

    return (
      <div className="min-h-screen bg-[#191022] text-white font-DMSans">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-[#191022]/95 backdrop-blur-sm border-b border-purple-800/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4 md:py-6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-600 rounded-lg flex items-center justify-center transform rotate-45">
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-white rounded-sm transform -rotate-45"></div>
                </div>
                <span className="text-lg sm:text-xl font-bold">Rayn</span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-6 lg:gap-8">
                <a href="#features" className="text-gray-300 hover:text-white transition text-sm lg:text-base">Features</a>
                <a href="#testimonials" className="text-gray-300 hover:text-white transition text-sm lg:text-base">Testimonials</a>
                <a href="#support" className="text-gray-300 hover:text-white transition text-sm lg:text-base">Support</a>
                <button className="bg-purple-600 hover:bg-purple-700 px-4 lg:px-6 py-2 rounded-full font-medium transition text-sm lg:text-base">
                  Connect Wallet
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-white p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-purple-800/20">
                <div className="flex flex-col gap-4">
                  <a href="#features" className="text-gray-300 hover:text-white transition py-2">Features</a>
                  <a href="#testimonials" className="text-gray-300 hover:text-white transition py-2">Testimonials</a>
                  <a href="#support" className="text-gray-300 hover:text-white transition py-2">Support</a>
                  <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-full font-medium transition w-full">
                    Connect Wallet
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section className="bg-[#191022] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6">
                Send and receive stablecoins with ease
              </h1>
              <p className="text-gray-300 text-base sm:text-lg mb-6 sm:mb-8">
                Rayn is a mobile-first Dapp that empowers African users to send, receive, and manage stablecoins seamlessly. Inspired by Pocket App's user-friendly P2P transfer model.
              </p>
              <button className="bg-purple-600 hover:bg-purple-700 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium transition w-full sm:w-auto">
                Connect Wallet
              </button>
            </div>
            <div className="order-1 lg:order-2">
              <div className="bg-gradient-to-br from-amber-200 to-amber-50 rounded-xl p-4 sm:p-6 relative overflow-hidden">
                <div className="relative z-10 aspect-video bg-gradient-to-br from-green-400 to-amber-300 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl sm:text-6xl mb-2"><img src={giveaway} alt=""/></div>
                    <p className="text-green-800 font-semibold text-sm sm:text-base">Stablecoin Transfer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section id="features" className="bg-gradient-to-b from-[#231037] to-[#231036] py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">Key Features</h2>
              <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto px-4">
                Rayn offers a range of features designed to make stablecoin transactions simple and secure for African users.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 rounded-2xl p-6 sm:p-8 border border-purple-700/30">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                  <User className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Username-Based Transfers</h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  Send and receive stablecoins using simple usernames, eliminating the need for complex wallet addresses.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 rounded-2xl p-6 sm:p-8 border border-purple-700/30">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                  <Gift className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Community Giveaways</h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  Participate in community-driven giveaways to boost adoption and reward users.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 rounded-2xl p-6 sm:p-8 border border-purple-700/30 sm:col-span-2 lg:col-span-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Secure Transactions</h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  Benefit from secure and transparent transactions powered by blockchain technology.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-10 sm:mb-16">What Our Users Say</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-gradient-to-br from-purple-900/30 to-transparent rounded-2xl p-6 sm:p-8 border border-purple-700/20">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-400 rounded-full flex items-center justify-center text-2xl"><img src={femaleavatar} alt='' className='rounded-full'/></div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base">Aisha, Lagos</h4>
                    <p className="text-gray-400 text-xs sm:text-sm">Rayn User</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm sm:text-base">
                  "Rayn has made sending money to my family back home so much easier and cheaper. I love the simple username feature!"
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-900/30 to-transparent rounded-2xl p-6 sm:p-8 border border-purple-700/20">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-400 rounded-full flex items-center justify-center text-2xl"><img src={avatar1} alt='' className='rounded-full'/></div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base">Kwame, Accra</h4>
                    <p className="text-gray-400 text-xs sm:text-sm">Rayn User</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm sm:text-base">
                  "I was skeptical about using stablecoins, but Rayn's user-friendly interface and secure transactions have won me over."
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-900/30 to-transparent rounded-2xl p-6 sm:p-8 border border-purple-700/20 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-400 rounded-full flex items-center justify-center text-2xl"><img src={avatar2} alt='' className='rounded-full'/></div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base">Fatima, Nairobi</h4>
                    <p className="text-gray-400 text-xs sm:text-sm">Rayn User</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm sm:text-base">
                  "The community giveaways are a fun way to earn extra stablecoins, and I've met some great people through the app."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-b from-[#231037] to-[#231036] py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Get started with Rayn today</h2>
            <p className="text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join the growing community of African users who are experiencing the future of finance with Rayn.
            </p>
            <button className="bg-purple-600 hover:bg-purple-700 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium transition w-full sm:w-auto">
              Download App
            </button>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-purple-800/40 to-purple-900/40 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-purple-700/30">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-3 sm:mb-4">Stay in the loop</h2>
              <p className="text-gray-300 text-center mb-6 sm:mb-8 text-sm sm:text-base">
                Subscribe to our newsletter for the latest updates, news, and exclusive content about Rayn.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-purple-950/50 border border-purple-700/30 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm sm:text-base"
                />
                <button
                  onClick={handleSubscribe}
                  className="bg-purple-600 hover:bg-purple-700 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium transition text-sm sm:text-base whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gradient-to-b from-[#231037] to-[#231036] border-t border-purple-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
              <div className="flex items-center gap-2 order-1">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-purple-600 rounded-lg flex items-center justify-center transform rotate-45">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-sm transform -rotate-45"></div>
                </div>
                <span className="text-xs sm:text-sm text-gray-400">© 2025 Rayn. All rights reserved.</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 order-3 lg:order-2">
                <a href="#privacy" className="text-gray-400 hover:text-white text-xs sm:text-sm transition">Privacy Policy</a>
                <a href="#terms" className="text-gray-400 hover:text-white text-xs sm:text-sm transition">Terms of Service</a>
                <a href="#contact" className="text-gray-400 hover:text-white text-xs sm:text-sm transition">Contact Us</a>
              </div>
              <div className="flex items-center gap-4 order-2 lg:order-3">
                <a href="#twitter" className="text-gray-400 hover:text-white transition">
                  <CiTwitter className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a href="#instagram" className="text-gray-400 hover:text-white transition">
                  <CiInstagram className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a href="#help" className="text-gray-400 hover:text-white transition">
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
