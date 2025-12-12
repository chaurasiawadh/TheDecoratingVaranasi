import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, CheckCircle, Smartphone } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Service, Package, BookingFormData } from '../types';
import { SERVICES, PACKAGES, PHONE_NUMBER } from '../constants';
import { useSearchParams, useNavigate } from 'react-router-dom';

export const BookingModal: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialServiceId = searchParams.get('service');

  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    phone: '',
    email: '',
    serviceId: initialServiceId || SERVICES[0].id,
    packageId: '',
    date: '',
    time: '',
    address: '',
    guests: 50,
    message: ''
  });

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Update formData when URL param changes
  useEffect(() => {
    if (initialServiceId) {
      setFormData(prev => ({ ...prev, serviceId: initialServiceId }));
    }
  }, [initialServiceId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, serviceId: e.target.value, packageId: '' });
  };

  const filteredPackages = PACKAGES.filter(p => p.serviceId === formData.serviceId);
  const selectedService = SERVICES.find(s => s.id === formData.serviceId);
  const selectedPackage = PACKAGES.find(p => p.id === formData.packageId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate validation/api call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7c3aed', '#fbbf24', '#ffffff']
      });
      
      // WhatsApp Logic
      const msg = `
*New Booking — TheDecoratingVaranasi* ✨
--------------------------------
👤 *Name:* ${formData.fullName}
📞 *Phone:* +91 ${formData.phone}
📧 *Email:* ${formData.email || 'N/A'}
🎉 *Service:* ${selectedService?.title}
📦 *Package:* ${selectedPackage ? `${selectedPackage.name} (₹${selectedPackage.price})` : 'Custom / Not Selected'}
📅 *Date:* ${formData.date}
⏰ *Time:* ${formData.time || 'Flexible'}
📍 *Venue:* ${formData.address}
👥 *Guests:* ${formData.guests}
📝 *Note:* ${formData.message || 'None'}
--------------------------------
Source: Website
      `.trim();

      const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(msg)}`;
      
      // Open in new tab after a slight delay to show success animation
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1500);

    }, 1000);
  };

  const close = () => navigate(-1);

  if (success) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-green-500" />
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Booking Initiated!</h2>
          <p className="text-gray-600 mb-6">
            We are redirecting you to WhatsApp to finalize details with our team.
          </p>
          <button onClick={close} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl transition-colors">
            Close
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative my-8"
      >
        <button onClick={close} className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full hover:bg-white transition-colors">
          <X className="w-6 h-6 text-gray-600" />
        </button>

        {/* Left Side - Visual Summary */}
        <div className="w-full md:w-1/3 bg-gray-50 p-6 md:p-8 flex flex-col justify-between border-r border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-400 uppercase tracking-wide mb-6">Summary</h3>
            {selectedService && (
                <div className="mb-6">
                    <img src={selectedService.image} alt="Service" className="w-full h-32 object-cover rounded-lg mb-4 shadow-md" />
                    <h4 className="font-serif text-xl font-bold text-primary">{selectedService.title}</h4>
                    <p className="text-sm text-gray-500">Starting @ ₹{selectedService.priceStart}</p>
                </div>
            )}
            
            {selectedPackage && (
                <div className="bg-white p-4 rounded-xl border border-primary/20 shadow-sm">
                    <span className="text-xs font-bold text-secondary uppercase">Selected Package</span>
                    <div className="font-bold text-gray-800">{selectedPackage.name}</div>
                    <div className="text-primary font-bold">₹{selectedPackage.price.toLocaleString()}</div>
                </div>
            )}
          </div>
          
          <div className="mt-8">
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <Smartphone className="w-4 h-4" />
                <span>Booking handled via WhatsApp</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-2/3 p-6 md:p-8">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Plan Your Celebration</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                    <input 
                        required 
                        type="text" 
                        name="fullName" 
                        value={formData.fullName} 
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="John Doe"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Phone (+91)</label>
                    <input 
                        required 
                        type="tel" 
                        pattern="[6-9][0-9]{9}"
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-primary outline-none"
                        placeholder="9936169852"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Service Type</label>
                    <select 
                        name="serviceId" 
                        value={formData.serviceId} 
                        onChange={handleServiceChange}
                        className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none"
                    >
                        {SERVICES.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>
                </div>
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Package (Optional)</label>
                    <select 
                        name="packageId" 
                        value={formData.packageId} 
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none"
                    >
                        <option value="">Select a package</option>
                        {filteredPackages.map(p => <option key={p.id} value={p.id}>{p.name} - ₹{p.price}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Event Date</label>
                    <div className="relative">
                        <input 
                            required 
                            type="date" 
                            name="date" 
                            value={formData.date} 
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none"
                        />
                        <Calendar className="absolute right-3 top-3 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                </div>
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Guest Count</label>
                    <input 
                        type="number" 
                        name="guests" 
                        value={formData.guests} 
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none"
                        min="5"
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Venue Address</label>
                <input 
                    required 
                    type="text" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none"
                    placeholder="Area, Street, City"
                />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Special Request / Message</label>
                <textarea 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none h-24 resize-none"
                    placeholder="Specific theme colors, timing constraints, etc."
                />
            </div>

            <div className="pt-4">
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <span className="animate-pulse">Processing...</span>
                    ) : (
                        <>
                            Confirm Booking via WhatsApp <Smartphone className="w-5 h-5" />
                        </>
                    )}
                </button>
                <p className="text-center text-xs text-gray-400 mt-3">
                    No payment required now. You will chat with our agent.
                </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};