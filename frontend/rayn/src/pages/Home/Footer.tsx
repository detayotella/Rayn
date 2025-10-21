import React from 'react';
import { FiTwitter, FiGithub, FiYoutube } from 'react-icons/fi';
import { Mail } from 'lucide-react';
import Logo from '../../assets/Logo.png';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a0f2e] border-t border-purple-500/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={Logo} alt="Rayn logo" className="h-10 w-10 object-contain" />
              <span className="text-2xl font-bold text-white">Rayn</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Decentralized finance made simple. Send, receive, and manage stablecoins with ease.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com"
                aria-label="Twitter"
                className="w-10 h-10 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-500/40 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                target="_blank"
                rel="noreferrer"
              >
                <FiTwitter className="text-lg" />
              </a>
              <a
                href="https://github.com/detayotella/Rayn"
                aria-label="GitHub"
                className="w-10 h-10 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-500/40 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                target="_blank"
                rel="noreferrer"
              >
                <FiGithub className="text-lg" />
              </a>
              <a
                href="https://youtube.com"
                aria-label="YouTube"
                className="w-10 h-10 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-500/40 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                target="_blank"
                rel="noreferrer"
              >
                <FiYoutube className="text-lg" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="/giveaway" className="text-gray-400 hover:text-white transition-colors">Giveaways</a></li>
              <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">How it Works</a></li>
              <li><a href="/sign-up" className="text-gray-400 hover:text-white transition-colors">Get Started</a></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#support" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#blog" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#security" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
              <li><a href="#disclaimer" className="text-gray-400 hover:text-white transition-colors">Disclaimer</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-purple-500/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} Rayn. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Mail className="w-4 h-4" />
              <a href="mailto:hello@rayn.app" className="hover:text-white transition-colors">
                hello@rayn.app
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;