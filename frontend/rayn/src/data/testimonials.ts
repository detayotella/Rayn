export type Testimonial = {
  name: string;
  location: string;
  initial: string;
  text: string;
  avatarBg: string; // tailwind class for bg color of avatar circle
};

export const testimonials: Testimonial[] = [
  {
    name: "Aisha",
    location: "Lagos",
    initial: "A",
    text:
      "Rayn has made sending money to my family back home so much easier and cheaper. I love the simple username feature!",
    avatarBg: "bg-amber-400",
  },
  {
    name: "Kwame",
    location: "Accra",
    initial: "K",
    text:
      "I was skeptical about using stablecoins, but Rayn's user-friendly interface and secure transactions have won me over.",
    avatarBg: "bg-purple-400",
  },
  {
    name: "Fatima",
    location: "Nairobi",
    initial: "F",
    text:
      "The community giveaways are a fun way to earn extra stablecoins, and I've met some great people through the app.",
    avatarBg: "bg-amber-400",
  },
];
