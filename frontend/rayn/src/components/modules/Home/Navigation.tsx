import { Menu, X } from 'lucide-react';
import { Link } from "react-router";
import Logo from '../../../assets/Logo.png';

interface NavigationProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function Navigation({ mobileMenuOpen, setMobileMenuOpen }: NavigationProps) {
  return (
    <nav className="bg-[#251435]/80 backdrop-blur-xl border-b border-purple-500/20 fixed top-0 left-0 right-0 z-50 shadow-lg shadow-purple-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16 sm:h-20">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={Logo} alt="Rayn logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
          <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">Rayn</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          <a href="#features" className="text-gray-300 hover:text-white transition-colors font-medium">Features</a>
          <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors font-medium">How it Works</a>
          <a href="#support" className="text-gray-300 hover:text-white transition-colors font-medium">Community</a>
        </div>
        <Link to="/onboarding" className="hidden md:block">
            <button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 text-white">
              Get started
            </button>
          </Link>
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2 hover:bg-purple-900/30 rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#251435]/95 backdrop-blur-xl border-b border-purple-500/20">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-purple-900/20">Features</a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-purple-900/20">How it Works</a>
            <a href="#support" className="text-gray-300 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-purple-900/20">Community</a>
            <Link to="/onboarding">
              <button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/30 w-full text-white mt-2">
                Get started
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
