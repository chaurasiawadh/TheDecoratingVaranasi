import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';

export const CapturedMoments = () => {
    const { capturedMoments, services } = useData();
    const [filter, setFilter] = useState('All');

    const filteredMoments = filter === 'All'
        ? capturedMoments
        : capturedMoments.filter(m => m.type === filter);

    // Get unique types from captured moments for filter
    const distinctTypes = ['All', ...Array.from(new Set(capturedMoments.map(m => m.type)))];

    if (!capturedMoments || capturedMoments.length === 0) return null;

    return (
        <section className="py-20 bg-white px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <span className="text-primary font-bold uppercase tracking-widest text-xs">Gallery</span>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mt-2">Captured Moments</h2>
                    <div className="w-20 h-1 bg-secondary mx-auto mt-6 rounded-full"></div>
                </div>

                {/* Filter Tabs */}
                {distinctTypes.length > 1 && (
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {distinctTypes.map(type => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === type
                                        ? 'bg-primary text-white shadow-lg transform scale-105'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredMoments.map((moment, index) => (
                        <motion.div
                            key={moment.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative overflow-hidden rounded-xl aspect-[4/5] cursor-pointer"
                        >
                            <img
                                src={moment.imageUrl}
                                alt={moment.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                <span className="text-secondary text-xs font-bold uppercase tracking-wider mb-2">{moment.type}</span>
                                <h3 className="text-white font-serif text-xl font-bold">{moment.name}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
