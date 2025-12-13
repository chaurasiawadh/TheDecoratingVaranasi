import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Filter } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export const Gallery: React.FC = () => {
  const { capturedMoments, loading } = useData();
  const [filter, setFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState<any>(null);

  // Get unique types for filter
  const categories = ['All', ...Array.from(new Set(capturedMoments.map(m => m.type)))];

  const filteredItems = filter === 'All'
    ? capturedMoments
    : capturedMoments.filter(item => item.type === filter);

  if (loading && capturedMoments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary font-bold uppercase tracking-widest text-xs"
          >
            Our Portfolio
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mt-2 mb-4"
          >
            Captured Moments
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-1 bg-secondary mx-auto rounded-full"
          />
        </div>

        {/* Filters */}
        {categories.length > 1 && (
          <div className="flex justify-center mb-10">
            <div className="inline-flex flex-wrap justify-center gap-2 bg-white p-2 rounded-full shadow-sm border border-gray-100">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${filter === cat
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl"
                onClick={() => setSelectedImage(item)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-secondary text-xs font-bold uppercase tracking-wider mb-1">
                    {item.type}
                  </span>
                  <h3 className="text-white text-xl font-serif font-bold flex items-center justify-between">
                    {item.name}
                    <ZoomIn className="w-5 h-5 text-white/80" />
                  </h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <Filter className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>No photos in this category yet.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-[90vh] rounded-lg overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-white hover:text-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.name}
                className="w-full h-full object-contain max-h-[85vh] rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                <h3 className="text-2xl font-serif font-bold">{selectedImage.name}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};