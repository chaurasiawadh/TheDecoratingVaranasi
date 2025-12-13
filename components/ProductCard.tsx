import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, CalendarCheck, Heart, Sparkles } from 'lucide-react';
import { ProductItem } from '../types';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: ProductItem;
  onQuickView: (product: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white rounded-xl shadow-sm hover:shadow-2xl border border-gray-100 overflow-hidden flex flex-col relative"
    >
      {/* Discount Badge */}
      {product.discount > 0 && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 left-3 z-20 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg"
        >
          {product.discount}% OFF
        </motion.div>
      )}

      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        
        {/* Hover Overlay with Actions */}
        <div className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center gap-3 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onQuickView(product)}
            className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-xl"
          >
            <Eye className="w-4 h-4" /> View
          </motion.button>
          <Link to={`/booking?service=${product.serviceId}&package=${product.id}`}>
            <motion.button
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.95 }}
               className="bg-primary text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-xl"
            >
              <CalendarCheck className="w-4 h-4" /> Book
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
            <div>
                 <h3 className="font-serif font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1 text-lg">
                  {product.name}
                </h3>
                 {/* Rating stars */}
                <div className="flex items-center gap-1 mt-1">
                    <div className="flex text-yellow-400 text-xs">
                        {'★'.repeat(Math.floor(product.rating))}
                        <span className="text-gray-300">{'★'.repeat(5 - Math.floor(product.rating))}</span>
                    </div>
                    <span className="text-xs text-gray-400">({product.reviews})</span>
                </div>
            </div>
        </div>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.shortDescription}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {product.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-gray-100 text-gray-600 rounded-sm">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
          <div>
            {product.oldPrice > product.price && (
              <span className="text-xs text-gray-400 line-through mr-2">₹{product.oldPrice.toLocaleString()}</span>
            )}
            <span className="text-xl font-bold text-primary">₹{product.price.toLocaleString()}</span>
          </div>
          
          <Link to={`/booking?service=${product.serviceId}&package=${product.id}`} className="md:hidden">
              <button className="bg-primary/10 text-primary p-2 rounded-lg">
                  <CalendarCheck className="w-5 h-5" />
              </button>
          </Link>
        </div>
      </div>
    </motion.article>
  );
};