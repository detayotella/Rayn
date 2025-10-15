import { Bell, ArrowLeft } from 'lucide-react';
import communitygiveaway from '../assets/communitygiveaway.jpg';
import referral from '../assets/referral.jpg';
import { CiTwitter } from "react-icons/ci";
import { CiInstagram } from "react-icons/ci";

export default function CommunityGiveaway() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#191022] via-[#231036] to-[#191022] text-white font-DMSans">
            {/* Header */}
            <header className="border-b border-purple-900/30 bg-[#1a0b2e]/80 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        {/* Logo with Back Button */}
                        <div className="flex items-center gap-3 sm:gap-4">
                            <button className="w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <span className="text-xl sm:text-2xl font-bold">Rayn</span>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Send</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Receive</a>
                            <a href="#" className="text-purple-400 font-semibold">Giveaways</a>
                        </nav>

                        {/* User Actions */}
                        <div className="flex items-center gap-3 sm:gap-4">
                            <button className="p-2 hover:bg-purple-900/30 rounded-full transition-colors">
                                <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                {/* Hero Section */}
                <div className="text-center mb-12 sm:mb-16">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">Community Giveaways</h1>
                    <p className="text-gray-400 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto">
                        Participate in our community giveaways and earn stablecoins.
                    </p>
                </div>

                {/* Welcome Card */}
                <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm rounded-3xl overflow-hidden border border-purple-700/30 mb-12 sm:mb-16">
                    {/* Illustration */}
                    <div className="bg-gradient-to-r from-purple-300 to-purple-200 p-8 sm:p-12 lg:p-16">
                        <div className="flex items-center justify-center gap-4 sm:gap-8 max-w-7xl mx-auto">
                            <img src={communitygiveaway} alt="Community Giveaway" className="w-full h-full sm:w-64 sm:h-64 md:w-full md:h-full lg:w-full lg:h-full rounded-xl object-cover shadow-lg" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-8 lg:p-10">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Welcome to the Rayn Community Giveaway!</h2>
                        <p className="text-gray-400 text-base sm:text-lg mb-6">
                            Join our community and participate in our first giveaway. Share the love and earn stablecoins.
                        </p>
                        <button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold py-3 sm:py-4 px-8 rounded-xl sm:rounded-2xl text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30">
                            Join Now
                        </button>
                    </div>
                </div>

                {/* Active Giveaways Section */}
                <div className="mb-12 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-10">Active Giveaways</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                        {/* Refer a Friend Card */}
                        <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden border border-purple-700/30 hover:border-purple-600/50 transition-all duration-300">
                            {/* Card Image */}
                            <div className="bg-gradient-to-br from-purple-300 to-purple-200 p-8 sm:p-12 flex items-center justify-center min-h-[200px]">
                                <div className="flex items-end justify-center gap-4">
                                    <img src={referral} alt="" className="w-full h-full sm:w-40 sm:h-40 md:w-full md:h-full rounded-xl object-cover shadow-lg" />
                                    
                                </div>
                            </div>

                            <div className="p-6 sm:p-8">
                                <h3 className="text-xl sm:text-2xl font-bold mb-3">Refer a Friend and Earn</h3>
                                <p className="text-gray-400 text-sm sm:text-base mb-6">
                                    Invite your friends to join Rayn and earn stablecoins for each successful referral.
                                </p>
                                <button className="bg-purple-700 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300">
                                    Invite Friends
                                </button>
                            </div>
                        </div>

                        {/* Daily Check-In Card */}
                        <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden border border-purple-700/30 hover:border-purple-600/50 transition-all duration-300">
                            {/* Card Image */}
                            <div className="bg-gradient-to-br from-purple-300 to-purple-200 p-8 sm:p-12 flex items-center justify-center min-h-[200px]">
                                <div className="bg-white rounded-lg p-6 shadow-lg">
                                    <div className="grid grid-cols-7 gap-2">
                                        {Array.from({ length: 28 }).map((_, i) => (
                                            <div key={i} className="w-3 h-3 bg-purple-300 rounded-full"></div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 sm:p-8">
                                <h3 className="text-xl sm:text-2xl font-bold mb-3">Daily Check-In Rewards</h3>
                                <p className="text-gray-400 text-sm sm:text-base mb-6">
                                    Check in daily to earn small stablecoin rewards. Consistency pays off!
                                </p>
                                <button className="bg-purple-700 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300">
                                    Check In
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Media Section */}
                <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm rounded-3xl overflow-hidden border border-purple-700/30">
                    <div className="p-6 sm:p-8 lg:p-10">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Social Media Engagement</h2>
                        <p className="text-gray-400 text-base sm:text-lg mb-6">
                            Follow us on social media and engage with our content to earn extra rewards.
                        </p>
                        <button className="bg-purple-700 hover:bg-purple-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300">
                            Follow Us
                        </button>
                    </div>

                    {/* Social Media Icons Illustration */}
                    <div className="bg-gradient-to-br from-purple-300 to-purple-200 p-8 sm:p-12 lg:p-16 relative overflow-hidden">
                        <div className="flex items-center justify-center gap-4 flex-wrap max-w-2xl mx-auto">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-full shadow-lg"> <CiTwitter className="w-12 h-12 sm:w-16 sm:h-16" /></div>
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-600 rounded-full shadow-lg"> <CiInstagram className="w-12 h-12 sm:w-16 sm:h-16" /></div>
                          
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}