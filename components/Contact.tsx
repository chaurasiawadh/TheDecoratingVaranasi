import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, Instagram, Facebook, Smartphone, CheckCircle } from 'lucide-react';
import { PHONE_NUMBER } from '../constants';
import confetti from 'canvas-confetti';

export const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        service: 'General Inquiry',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate network delay
        setTimeout(() => {
            setSuccess(true);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#7c3aed', '#fbbf24']
            });

            const msg = `
New Inquiry from Website:
Name: ${formData.name}
Phone: ${formData.phone}
Interested In: ${formData.service}
Message: ${formData.message}
        `.trim();

            const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(msg)}`;

            // Open WhatsApp after small delay
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                setIsSubmitting(false);
                setSuccess(false); // Reset for next time
                setFormData({ name: '', phone: '', service: 'General Inquiry', message: '' });
            }, 1500);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-white pt-20">
            {/* Header Hero */}
            <div className="bg-dark text-white py-20 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-4xl md:text-6xl font-serif font-bold mb-4"
                    >
                        Get in Touch
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-300 text-lg"
                    >
                        Ready to plan your next celebration? We're here to help.
                    </motion.p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* Left: Info */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">Contact Information</h2>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">Phone & WhatsApp</h3>
                                    <p className="text-gray-500 mb-1">Available 9 AM - 9 PM</p>
                                    <a href={`tel:+919250333876`} className="text-primary font-bold hover:underline text-lg">+91 92503 33876</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0 text-secondary">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">Email Us</h3>
                                    <p className="text-gray-500 mb-1">For corporate & bulk inquiries</p>
                                    <a href="mailto:thedecoratingvaranasi@gmail.com" className="text-primary font-bold hover:underline text-lg">thedecoratingvaranasi@gmail.com</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 text-pink-500">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">Visit Us</h3>
                                    <p className="text-gray-500 text-lg leading-relaxed">
                                        Brahmanand Colony, Durgakund,<br />
                                        Varanasi, Uttar Pradesh 221005
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h4 className="font-bold text-gray-900 mb-4">Follow Us</h4>
                            <div className="flex gap-4">
                                <a href="https://www.instagram.com/thedecoratingvaranasi/" target="_blank" className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-500 hover:text-white transition-all shadow-sm hover:shadow-lg">
                                    <Instagram className="w-6 h-6" />
                                </a>
                                <a href="https://www.facebook.com/p/The-Decorating-Varanasi-61579304051679/" target="_blank" className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-lg">
                                    <Facebook className="w-6 h-6" />
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Form */}
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100"
                    >
                        {success ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-10 h-10 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Ready!</h3>
                                <p className="text-gray-500">Redirecting to WhatsApp to send your message...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <h2 className="text-2xl font-serif font-bold text-gray-900">Send a Message</h2>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        type="number"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="9876543210"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Interested In</label>
                                    <select
                                        name="service"
                                        value={formData.service}
                                        onChange={handleChange}
                                        className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
                                    >
                                        <option>General Inquiry</option>
                                        <option>Wedding Decoration</option>
                                        <option>Birthday Party</option>
                                        <option>Anniversary</option>
                                        <option>Corporate Event</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all h-32 resize-none"
                                        placeholder="Tell us about your event date, venue, and requirements..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-primary hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        'Opening WhatsApp...'
                                    ) : (
                                        <>
                                            Send to WhatsApp <Smartphone className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Map Section */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="w-full h-96 bg-gray-100"
            >
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.039607198162!2d82.99767677598822!3d25.27581162744383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e33d4b6894c25%3A0x629c42c94a504383!2sDurgakund%2C%20Jawahar%20Nagar%20Colony%2C%20Bhelupur%2C%20Varanasi%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1709825432000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="grayscale hover:grayscale-0 transition-all duration-700"
                ></iframe>
            </motion.div>
        </div>
    );
};