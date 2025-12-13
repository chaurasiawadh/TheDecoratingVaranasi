import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Heart, Search, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOGO_URL, APP_NAME } from '../constants';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Check if we are on the home page or booking page (which overlays home)
  const isHomePage = location.pathname === '/' || location.pathname === '/booking';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Determine styles based on scroll and page location
  // On Home: Transparent at top, White when scrolled.
  // Other pages: Always White.
  const isTransparent = isHomePage && !scrolled;

  const navClasses = `fixed w-full z-50 transition-all duration-500 ease-in-out ${isTransparent ? 'bg-transparent py-4' : 'bg-white/95 backdrop-blur-md shadow-md py-2'
    }`;

  const textColorClass = isTransparent ? 'text-white' : 'text-gray-800';
  const iconColorClass = isTransparent ? 'text-white' : 'text-gray-600';
  const underlineColorClass = isTransparent ? 'bg-secondary' : 'bg-primary';

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section: Logo + Back Button */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
              <img
                src={LOGO_URL}
                alt={APP_NAME}
                className={`w-auto object-contain rounded-sm transition-all duration-500 ease-in-out ${scrolled ? 'h-8' : 'h-10 md:h-12'
                  }`}
              />
            </Link>

            <AnimatePresence>
              {scrolled && !isHomePage && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="hidden md:block"
                >
                  <Link
                    to="/"
                    className="flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-primary hover:text-white px-3 py-1.5 rounded-full transition-all"
                  >
                    <ArrowLeft className="w-3 h-3" /> Back to Home
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {['Home', 'Services', 'Gallery', 'Contact'].map((item) => (
              <Link
                key={item}
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                className={`relative group text-sm font-medium uppercase tracking-wider transition-colors ${textColorClass}`}
              >
                {item}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 ease-out group-hover:w-full ${underlineColorClass}`}></span>
              </Link>
            ))}

            <Link to="/booking">
              <button className="bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                Book Now
              </button>
            </Link>
          </div>

          {/* Mobile menu button & Back Link */}
          <div className="md:hidden flex items-center gap-3">
            <AnimatePresence>
              {scrolled && !isHomePage && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <Link
                    to="/"
                    className="flex items-center gap-1 text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full"
                  >
                    <ArrowLeft className="w-3 h-3" /> Home
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${textColorClass}`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-xl overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {['Home', 'Services', 'Gallery', 'Contact'].map((item) => (
                <Link
                  key={item}
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-purple-50 transition-colors"
                >
                  {item}
                </Link>
              ))}
              <Link
                to="/booking"
                className="block w-full text-center mt-4 bg-primary text-white px-4 py-3 rounded-lg font-bold"
              >
                Book via WhatsApp
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};