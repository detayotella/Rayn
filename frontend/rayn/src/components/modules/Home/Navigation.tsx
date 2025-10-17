import { Menu, X } from 'lucide-react';
import { Link } from "react-router";
import Logo from '../../../assets/Logo.png';

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
          <img src={Logo} alt="Rayn logo" className="w-8 h-8 object-contain" />
          <span className="text-xl font-bold text-white">Rayn</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center  gap-6 lg:gap-8">
          <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
          <a href="#testimonials" className="text-gray-300 hover:text-white transition">Testimonials</a>
          <a href="#support" className="text-gray-300 hover:text-white transition">Support</a>
          
        </div>
        <Link to="/onboarding">
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-2xl font-medium transition text-white">
              Get started
            </button>
          </Link>
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
                Get started
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
