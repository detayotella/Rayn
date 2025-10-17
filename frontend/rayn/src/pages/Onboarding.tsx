import React from "react";
import { Link } from "react-router";
import Logo from "../assets/Logo.png";

export default function Onboarding(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#191022] to-[#231036] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-DMSans">
      <div className="w-full max-w-xl text-center">
        {/* Logo/Icon Container */}
        <div className="mb-8 sm:mb-10 lg:mb-12 flex justify-center">
          <img
            src={Logo}
            alt="Rayn logo"
            className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 object-contain drop-shadow-2xl"
          />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 px-4">
          Welcome to Rayn
        </h1>
        <p className="text-gray-300 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 lg:mb-12 px-4 sm:px-6 leading-relaxed">
          Send, receive, and manage stablecoins effortlessly with our user-friendly app.
        </p>
        <Link to={"/choose-username"}><button className="w-full max-w-md bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-base sm:text-lg font-semibold py-3 sm:py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 mx-auto">
          Get Started
        </button></Link>
      </div>
    </div>
  );
}
