import { Link } from "react-router";

export default function Onboarding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#191022] to-[#231036] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-DMSans">
      <div className="w-full max-w-xl text-center">
        {/* Logo/Icon Container */}
        <div className="mb-8 sm:mb-10 lg:mb-12 flex justify-center">
          <div className="relative">
            <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 bg-gradient-to-br from-pink-200 to-pink-300 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl">
             <div className="relative">
               <div className="absolute left-0 top-0 w-16 sm:w-20 md:w-24 h-32 sm:h-40 md:h-48 bg-gradient-to-br from-pink-300 to-pink-400 rounded-t-3xl rounded-bl-3xl shadow-lg"></div>
                <div className="absolute left-0 bottom-0 w-24 sm:w-32 md:w-40 h-16 sm:h-20 md:h-24 bg-gradient-to-br from-pink-300 to-pink-400 rounded-br-3xl rounded-bl-3xl shadow-lg"></div>
                <div className="absolute bottom-[-8px] sm:bottom-[-10px] left-4 sm:left-6 w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 bg-pink-400 rounded-full shadow-md"></div>
                <div className="absolute bottom-[-8px] sm:bottom-[-10px] right-4 sm:right-6 w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 bg-pink-400 rounded-full shadow-md"></div>
              </div>
            </div>
          </div>
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