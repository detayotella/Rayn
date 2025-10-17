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
    <section id="testimonials" className="bg-[#191022] py-20 ">
      <div className="w-full px-2 sm:px-6 lg:px-10">{/* reduced horizontal padding */}
        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16 text-white">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 lg:gap-10">{/* slightly tighter gaps on small screens */}
          {testimonials.map((t, idx) => (
            <div key={idx} className="rounded-2xl p-6 md:px-8 md:py-12 border border-purple-700/50">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 ${t.avatarBg} rounded-full flex items-center justify-center text-xl font-bold text-white`}>
                  {t.initial}
                </div>
                <div>
                  <h4 className="font-bold text-white">{t.name}, {t.location}</h4>
                  <p className="text-gray-400 text-sm">Rayn User</p>
                </div>
              </div>
              <p className="text-gray-300">{`"${t.text}"`}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
