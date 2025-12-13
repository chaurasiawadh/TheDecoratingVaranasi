import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Quote } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialModalProps {
    testimonial: Testimonial | null;
    onClose: () => void;
}

export const TestimonialModal: React.FC<TestimonialModalProps> = ({ testimonial, onClose }) => {
    return (
        <AnimatePresence>
            {testimonial && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>

                        <div className="relative h-32 bg-primary/5">
                            <Quote className="absolute top-6 left-6 w-12 h-12 text-primary/10" />
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
                                />
                            </div>
                        </div>

                        <div className="pt-12 pb-8 px-8 text-center">
                            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-1">{testimonial.name}</h3>
                            <div className="flex justify-center gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < testimonial.rating
                                            ? "text-yellow-400 fill-current"
                                            : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>

                            <blockquote className="text-gray-600 italic leading-relaxed text-lg">
                                "{testimonial.comment}"
                            </blockquote>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
