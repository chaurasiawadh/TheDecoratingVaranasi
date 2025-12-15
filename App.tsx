import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServiceCard } from './components/ServiceCard';
import { BookingModal } from './components/BookingModal';
import { ServiceDetail } from './components/ServiceDetail';
import { Admin } from './components/Admin';
import { Gallery } from './components/Gallery';
import { Contact } from './components/Contact';
import { LOGO_URL, APP_NAME } from './constants';
import { CapturedMoments } from './components/CapturedMoments';
import { TestimonialModal } from './components/TestimonialModal';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';
import { DataProvider, useData } from './contexts/DataContext';

// ScrollToTop Component handles scrolling to top on route change
const ScrollToTop = () => {

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const Footer = () => (
  <footer className="bg-dark text-gray-300 py-16">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-1 md:col-span-2">
        <img
          src={LOGO_URL}
          alt={APP_NAME}
          className="h-12 w-auto object-contain mb-6 rounded-lg bg-white/10"
        />
        <p className="text-sm leading-relaxed mb-6 max-w-sm">
          Creating timeless memories through exquisite event styling. Based in the heart of Varanasi, we bring joy, color, and elegance to every celebration.
        </p>
        <div className="flex gap-4">
          <a href="https://www.instagram.com/thedecoratingvaranasi/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="https://www.facebook.com/p/The-Decorating-Varanasi-61579304051679/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
            <Facebook className="w-5 h-5" />
          </a>
        </div>
      </div>

      <div>
        <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Quick Links</h3>
        <ul className="space-y-2 text-sm">
          <li><Link to="/" className="hover:text-secondary transition-colors">Home</Link></li>
          <li><Link to="/services" className="hover:text-secondary transition-colors">All Services</Link></li>
          <li><Link to="/gallery" className="hover:text-secondary transition-colors">Gallery</Link></li>
          <li><Link to="/contact" className="hover:text-secondary transition-colors">Contact Us</Link></li>
          <li><Link to="/booking" className="hover:text-secondary transition-colors">Book Now</Link></li>
          <li><Link to="/admin" className="hover:text-secondary transition-colors">Admin Portal</Link></li>
        </ul>
      </div>

      <div>
        <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Contact</h3>
        <ul className="space-y-4 text-sm">
          <li className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-secondary" />
            <span>+91 92503 33876</span>
          </li>
          <li className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-secondary" />
            <span>thedecoratingvaranasi@gmail.com</span>
          </li>
          <li className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-secondary mt-1" />
            <span>Brahmanand Colony, Durgakund, Varanasi</span>
          </li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
      © {new Date().getFullYear()} TheDecoratingVaranasi. All rights reserved.
    </div>
  </footer>
);

const Home = () => {
  const { services, testimonials, loading } = useData();
  const [selectedTestimonial, setSelectedTestimonial] = React.useState<any>(null);

  if (loading && services.length === 0) {
    return <div className="min-h-screen flex items-center justify-center text-primary">Loading amazing things...</div>;
  }

  return (
    <>
      <Hero />

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary font-bold uppercase tracking-widest text-xs">Our Expertise</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mt-2">Curated Experiences</h2>
            <div className="w-20 h-1 bg-secondary mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: '01', title: 'Choose Service', desc: 'Browse our wide range of decoration themes.' },
              { num: '02', title: 'Customize', desc: 'Add personal touches and specific requirements.' },
              { num: '03', title: 'Book Online', desc: 'Fill the simple form to initiate the request.' },
              { num: '04', title: 'Confirm', desc: 'Finalize details on WhatsApp with our expert.' }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="text-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-purple-50 text-primary font-bold text-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  {step.num}
                </div>
                <h3 className="font-bold text-xl mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CapturedMoments />

      {/* Testimonials */}
      <section className="py-20 bg-dark relative overflow-hidden px-4">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white text-center mb-12">Client Love</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <motion.div
                key={t.id}
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 cursor-pointer h-full hover:bg-white/15 transition-colors"
                onClick={() => setSelectedTestimonial(t)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full border-2 border-secondary object-cover" />
                  <div>
                    <h4 className="text-white font-bold">{t.name}</h4>
                    <div className="flex text-secondary text-xs">{'★'.repeat(t.rating)}</div>
                  </div>
                </div>
                <p className="text-gray-300 italic line-clamp-4">"{t.comment}"</p>
                <div className="mt-4 text-xs font-bold text-secondary uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">Read Full Review</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialModal
        testimonial={selectedTestimonial}
        onClose={() => setSelectedTestimonial(null)}
      />
    </>
  );
};

const ServicesPage = () => {
  const { services } = useData();
  return (
    <div className="pt-20 px-4 min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-center mb-12 mt-10">All Services</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Routes>
            <Route path="/admin" element={<Admin />} />

            <Route path="*" element={
              <>
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/booking" element={
                      <>
                        <Home />
                        <BookingModal />
                      </>
                    } />
                    <Route path="/booking/:id" element={<ServiceDetail />} />
                    <Route path="/services/:id" element={<ServiceDetail />} />
                  </Routes>
                </main>
                <Footer />

                {/* Mobile Sticky CTA */}
                <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3 md:hidden z-40 flex gap-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                  <a href={`tel:+919250333876`} className="flex-1 bg-gray-100 text-gray-800 font-bold py-3 rounded-lg flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" /> Call
                  </a>
                  <Link to="/booking" className="flex-1 bg-primary text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2">
                    Book Now
                  </Link>
                </div>
              </>
            } />
          </Routes>
        </div>
      </Router>
    </DataProvider>
  );
};

export default App;