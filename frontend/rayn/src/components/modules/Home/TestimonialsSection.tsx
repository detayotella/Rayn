type Testimonial = {
  name: string;
  location: string;
  initial: string;
  text: string;
  avatarBg: string;
};

type Props = {
  testimonials: Testimonial[];
};

export default function TestimonialsSection({ testimonials }: Props) {
  return (
    <section id="testimonials" className="bg-[#251435] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 opacity-0 animate-fade-in-up">
          <span className="inline-block px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-semibold mb-4">
            Testimonials
          </span>
          <h2 className="text-fluid-title font-bold mb-4 text-white">
            Trusted by <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Real People</span>
          </h2>
          <p className="text-gray-300 text-fluid-subtitle max-w-2xl mx-auto">
            See what our community has to say about their DeFi experience with Rayn.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {testimonials.map((t, idx) => {
            const delays = ['delay-100', 'delay-200', 'delay-300', 'delay-400', 'delay-500', 'delay-600'];
            return (
            <div key={idx} className={`bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:-translate-y-2 shadow-lg opacity-0 animate-fade-in-up ${delays[idx % delays.length]}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 ${t.avatarBg} rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg`}>
                  {t.initial}
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">{t.name}</h4>
                  <p className="text-purple-300 text-sm">{t.location}</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed italic">"{t.text}"</p>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
