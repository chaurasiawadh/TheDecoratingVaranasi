import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const HERO_IMAGES = [
  "https://images.pexels.com/photos/796606/pexels-photo-796606.jpeg",
  "https://images.pexels.com/photos/6229135/pexels-photo-6229135.jpeg",
  "https://images.pexels.com/photos/1045541/pexels-photo-1045541.jpeg",
  "https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg",
  "https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg",
  "https://images.pexels.com/photos/7802432/pexels-photo-7802432.jpeg",
  "https://images.pexels.com/photos/433452/pexels-photo-433452.jpeg",
  "https://images.pexels.com/photos/417458/pexels-photo-417458.jpeg"
];

export const Hero: React.FC = () => {
  const bgImage = useMemo(() => {
    return HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)];
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background with Parallax effect simulation via fixed position */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed transition-opacity duration-1000"
        style={{ backgroundImage: `url("${bgImage}")` }} 
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-secondary font-sans font-bold uppercase tracking-[0.2em] mb-4 text-sm md:text-base">
            Premium Event Styling in Varanasi
          </h2>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif text-white font-bold leading-tight mb-6 drop-shadow-2xl"
        >
          Make Every Moment <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-purple-200">
            Unforgettable
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-gray-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light"
        >
          From dreamy weddings to joyful birthday bashes, we craft experiences that touch the heart.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/booking">
            <button className="px-8 py-4 bg-secondary text-dark font-bold rounded-full shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6)] hover:scale-105 transition-all duration-300">
              Book a Celebration
            </button>
          </Link>
          <Link to="/services">
            <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold rounded-full hover:bg-white/20 transition-all duration-300">
              View Packages
            </button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white animate-bounce"
      >
        <ChevronDown className="w-8 h-8" />
      </motion.div>
    </div>
  );
};