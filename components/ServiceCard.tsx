import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Service } from '../types';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  service: Service;
  index: number;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
    >
      <div className="h-64 overflow-hidden relative">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          Top Rated
        </div>
      </div>
      
      <div className="p-6 relative">
        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
          {service.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
          {service.description}
        </p>
        
        <div className="space-y-2 mb-6">
            {service.features.slice(0, 3).map((feature, i) => (
                <div key={i} className="flex items-center text-xs text-gray-500">
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full mr-2"></span>
                    {feature}
                </div>
            ))}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="text-sm">
            <span className="text-gray-400">Starts at</span>
            <div className="font-bold text-lg text-gray-900">₹{service.priceStart.toLocaleString()}</div>
          </div>
          
          <Link to={`/booking?service=${service.id}`}>
            <button className="flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all">
              Book Now <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};