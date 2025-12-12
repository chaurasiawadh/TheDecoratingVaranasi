import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Heart, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <span className={`font-serif text-2xl font-bold tracking-tight ${scrolled ? 'text-primary' : 'text-white'}`}>
              TheDecorating<span className="text-secondary">Varanasi</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {['Home', 'Services', 'Gallery', 'Contact'].map((item) => (
              <Link
                key={item}
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                className={`text-sm font-medium uppercase tracking-wider hover:text-secondary transition-colors ${
                  scrolled ? 'text-gray-800' : 'text-white'
                }`}
              >
                {item}
              </Link>
            ))}
            
            <div className={`flex items-center space-x-4 ${scrolled ? 'text-gray-600' : 'text-white'}`}>
               <Search className="w-5 h-5 cursor-pointer hover:text-secondary" />
               <Heart className="w-5 h-5 cursor-pointer hover:text-secondary" />
               <Link to="/booking" className="relative group">
                 <ShoppingBag className="w-5 h-5 cursor-pointer hover:text-secondary" />
               </Link>
            </div>
            
            <Link to="/booking">
              <button className="bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                Book Now
              </button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${scrolled ? 'text-gray-800' : 'text-white'}`}
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
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-purple-50"
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