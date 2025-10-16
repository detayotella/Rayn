import React from 'react';
import { FiTwitter, FiInstagram, FiFacebook } from 'react-icons/fi';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#120a1b] border-t border-white/10 py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#8854F6] to-[#5F2EEA]">
              <span className="text-xl font-bold text-white">R</span>
            </div>
            <div>
              <p className="text-sm text-white/60">© {currentYear} Rayn. All rights reserved.</p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-6 text-sm text-white/60">
            <a href="#privacy" className="transition-colors hover:text-white">Privacy Policy</a>
            <a href="#terms" className="transition-colors hover:text-white">Terms of Service</a>
            <a href="#contact" className="transition-colors hover:text-white">Contact Us</a>
          </nav>

          <div className="flex items-center gap-5 text-white/60">
            <a
              href="https://twitter.com"
              aria-label="Visit Rayn on Twitter"
              className="transition-colors hover:text-white"
              target="_blank"
              rel="noreferrer"
            >
              <FiTwitter className="text-xl" />
            </a>
            <a
              href="https://instagram.com"
              aria-label="Visit Rayn on Instagram"
              className="transition-colors hover:text-white"
              target="_blank"
              rel="noreferrer"
            >
              <FiInstagram className="text-xl" />
            </a>
            <a
              href="https://facebook.com"
              aria-label="Visit Rayn on Facebook"
              className="transition-colors hover:text-white"
              target="_blank"
              rel="noreferrer"
            >
              <FiFacebook className="text-xl" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;