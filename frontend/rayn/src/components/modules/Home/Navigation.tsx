import { Menu, X } from 'lucide-react';
import { Link } from "react-router";

interface NavigationProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function Navigation({ mobileMenuOpen, setMobileMenuOpen }: NavigationProps) {
  return (
    <nav className="bg-[#191022] py-4">
      <div className="w-full px-2 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center transform rotate-45">
            <div className="w-4 h-4 bg-white rounded-sm transform -rotate-45"></div>
          </div>
          <span className="text-xl font-bold text-white">Rayn</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
          <a href="#testimonials" className="text-gray-300 hover:text-white transition">Testimonials</a>
          <a href="#support" className="text-gray-300 hover:text-white transition">Support</a>
          <Link to="/onboarding">
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full font-medium transition text-white">
              Download App
            </button>
          </Link>
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
        <div className="md:hidden mt-4 px-2 sm:px-4">
          <div className="flex flex-col gap-4 py-4 border-t border-purple-800/20">
            <a href="#features" className="text-gray-300 hover:text-white transition py-2">Features</a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition py-2">Testimonials</a>
            <a href="#support" className="text-gray-300 hover:text-white transition py-2">Support</a>
            <Link to="/onboarding">
              <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full font-medium transition w-full text-white">
                Download App
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
