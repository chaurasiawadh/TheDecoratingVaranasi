import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, CalendarCheck, Share2, ShieldCheck, Clock } from 'lucide-react';
import { ProductItem } from '../types';
import { Link } from 'react-router-dom';

interface ProductModalProps {
  product: ProductItem | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 bg-white/50 backdrop-blur-md p-2 rounded-full hover:bg-white transition-colors"
          >
            <X className="w-6 h-6 text-gray-800" />
          </button>

          {/* Left: Image */}
          <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-100 relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 flex gap-2">
              <button className="bg-white/90 backdrop-blur text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm hover:bg-white flex items-center gap-1">
                <Share2 className="w-3 h-3" /> Share
              </button>
            </div>
          </div>

          {/* Right: Details */}
          <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto">
            <div className="mb-1">
              <span className="text-primary font-bold text-xs uppercase tracking-wider">{product.tags[0] || "Featured"}</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">{product.name}</h2>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                {product.oldPrice > product.price && (
                  <span className="text-gray-400 line-through mb-1">₹{product.oldPrice.toLocaleString()}</span>
                )}
              </div>
              {product.discountText && (
                <span className="bg-green-100 text-green-700 font-bold px-2 py-1 rounded text-xs">
                  Save {product.discountText}
                </span>
              )}
            </div>

            <div className="space-y-4 mb-8">
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {product.fullDescription}
              </p>

              <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Professional Setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>4-6 Hour Duration</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-500" />
                  <span>Quality Guarantee</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 sticky bottom-0 bg-white pt-4 border-t border-gray-100">
              <Link to={`/booking?service=${product.serviceId}&package=${product.id}`} className="flex-1">
                <button className="w-full bg-primary hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                  <CalendarCheck className="w-5 h-5" /> Book Now
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};