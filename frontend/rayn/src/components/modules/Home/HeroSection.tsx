import { Link } from "react-router";
import RaynMockup from '../../../assets/Rayn.png';

export default function HeroSection() {
  return (
    <section className="bg-[#191022]">
      <div className="mx-auto w-full  px-4 sm:px-6 lg:px-16 py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Content */}
          <div className="w-full space-y-6 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-[4.5rem] xl:text-[6rem] font-bold leading-tight text-white">
              Send and receive stablecoins with ease
            </h1>
            <p className="text-gray-300 text-base sm:text-lg lg:w-3/4 leading-relaxed">
              Rayn is a Dapp that empowers African users to send, receive, and manage stablecoins seamlessly. Inspired by Pocket App's user-friendly P2P transfer model.
            </p>
            <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
              <Link to="/sign-up">
                <button className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-2xl font-medium transition text-white">
                  Get started
                </button>
              </Link>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="flex justify-center">
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-full">
              <img
                src={RaynMockup}
                alt="Rayn stablecoin app mockup"
                className="w-full h-auto rounded-3xl shadow-2xl shadow-purple-900/40"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
