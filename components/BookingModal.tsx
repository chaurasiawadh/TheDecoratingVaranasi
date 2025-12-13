import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, CheckCircle, Smartphone, AlertCircle, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Service, Package, BookingFormData } from '../types';
import { PACKAGES, PHONE_NUMBER } from '../constants';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

export const BookingModal: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialServiceId = searchParams.get('service');
  const initialPackageId = searchParams.get('package');
  
  // Use Data Context for full product list and services
  const { services, products } = useData();

  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    phone: '',
    email: '',
    serviceId: initialServiceId || (services[0]?.id || 'birthday'),
    packageId: initialPackageId || '',
    date: '',
    time: '',
    address: '',
    guests: 50,
    message: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  // Update formData when URL param changes
  useEffect(() => {
    if (initialServiceId) {
      setFormData(prev => ({ ...prev, serviceId: initialServiceId }));
    }
    if (initialPackageId) {
      setFormData(prev => ({ ...prev, packageId: initialPackageId }));
    }
  }, [initialServiceId, initialPackageId]);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof BookingFormData, string>> = {};
    const phoneRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = "Name must be at least 3 characters";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit Indian number";
    }

    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.date) {
      newErrors.date = "Event date is required";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = "Date cannot be in the past";
      }
    }

    if (!formData.address.trim()) {
      newErrors.address = "Venue address is required";
    }

    if (formData.guests < 5) {
      newErrors.guests = "Minimum 5 guests required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name as keyof BookingFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, serviceId: e.target.value, packageId: '' });
  };

  // Lookup Logic
  const filteredPackages = PACKAGES.filter(p => p.serviceId === formData.serviceId);
  const selectedService = services.find(s => s.id === formData.serviceId);
  
  // Try to find the selected item in the products list (dynamic) first, then fallback to PACKAGES (static)
  const selectedProduct = products.find(p => p.id === formData.packageId);
  const selectedPackage = PACKAGES.find(p => p.id === formData.packageId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setGettingLocation(true);

    // 1. Fetch Location
    let locationString = "Location: Not shared by user";
    try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { 
                timeout: 8000,
                enableHighAccuracy: true 
            });
        });
        const { latitude, longitude } = position.coords;
        locationString = `Google Maps Location:\nhttps://www.google.com/maps?q=${latitude},${longitude}`;
    } catch (error) {
        console.log("Location access denied or timed out", error);
    } finally {
        setGettingLocation(false);
    }

    // 2. Prepare Data
    const finalItemName = selectedProduct?.name || selectedPackage?.name || "Custom / Not Selected";
    const finalPrice = selectedProduct 
        ? `₹${selectedProduct.price.toLocaleString()}` 
        : (selectedPackage ? `₹${selectedPackage.price.toLocaleString()}` : "Contact for pricing");

    // 3. Construct Message
    const msg = `
New Booking - TheDecoratingVaranasi

Service: ${selectedService?.title || 'General Inquiry'}

Product Details:
Product Name: ${finalItemName}
Price: ${finalPrice}

Customer Details:
Name: ${formData.fullName}
Phone: ${formData.phone}
Preferred Date: ${formData.date}
Address: ${formData.address}

${locationString}

Additional Notes:
${formData.message || 'None'}
`.trim();

    // 4. Success Animation
    setSuccess(true);
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7c3aed', '#fbbf24', '#ffffff']
    });

    // 5. Open WhatsApp
    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(msg)}`;
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        setIsSubmitting(false);
    }, 1500);
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
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Order Initiated!</h2>
          <p className="text-gray-600 mb-6">
            Opening WhatsApp with your order details and location...
          </p>
          <button onClick={close} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl transition-colors">
            Close
          </button>
        </motion.div>
      </div>
    );
  }

  const getInputClass = (fieldName: keyof BookingFormData) => `
    w-full p-3 bg-gray-50 rounded-lg border outline-none transition-all
    ${errors[fieldName] 
      ? 'border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' 
      : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20'}
  `;

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
            
            {/* 1. Show Selected Product (Priority) */}
            {selectedProduct ? (
                <div className="bg-white p-4 rounded-xl border border-primary/20 shadow-sm mb-6">
                    <span className="text-xs font-bold text-secondary uppercase">Selected Item</span>
                    <div className="font-bold text-gray-800 text-lg leading-tight mb-1">{selectedProduct.name}</div>
                    <div className="text-primary font-bold text-xl">₹{selectedProduct.price.toLocaleString()}</div>
                    {selectedProduct.image && <img src={selectedProduct.image} className="w-full h-32 object-cover rounded-lg mt-3" alt="product" />}
                </div>
            ) : selectedPackage ? (
                /* 2. Fallback to Selected Package */
                <div className="bg-white p-4 rounded-xl border border-primary/20 shadow-sm mb-6">
                    <span className="text-xs font-bold text-secondary uppercase">Selected Package</span>
                    <div className="font-bold text-gray-800">{selectedPackage.name}</div>
                    <div className="text-primary font-bold">₹{selectedPackage.price.toLocaleString()}</div>
                </div>
            ) : selectedService ? (
                 /* 3. Fallback to Service Info */
                <div className="mb-6">
                    <img src={selectedService.image} alt="Service" className="w-full h-32 object-cover rounded-lg mb-4 shadow-md" />
                    <h4 className="font-serif text-xl font-bold text-primary">{selectedService.title}</h4>
                    <p className="text-sm text-gray-500">Starting @ ₹{selectedService.priceStart}</p>
                </div>
            ) : null}

          </div>
          
          <div className="mt-8 space-y-3">
             <div className="flex items-center gap-2 text-sm text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className="text-xs">Location will be attached to order</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <Smartphone className="w-4 h-4" />
                <span>Booking handled via WhatsApp</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-2/3 p-6 md:p-8">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Complete Booking</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Full Name
                    </label>
                    <input 
                        type="text" 
                        name="fullName" 
                        value={formData.fullName} 
                        onChange={handleChange}
                        className={getInputClass('fullName')}
                        placeholder="John Doe"
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.fullName}</p>}
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Phone (+91)
                    </label>
                    <input 
                        type="tel" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange}
                        className={getInputClass('phone')}
                        placeholder="9936169852"
                        maxLength={10}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.phone}</p>}
                </div>
            </div>

            <div className="space-y-1">
                 <label className="text-xs font-bold text-gray-500 uppercase">
                    Email Address <span className="text-gray-300 font-normal normal-case">(Optional)</span>
                 </label>
                 <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange}
                    className={getInputClass('email')}
                    placeholder="you@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.email}</p>}
            </div>

            {/* Service & Package Selection - Hidden if specific product already selected to keep UI clean, or read-only */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Service Type</label>
                    <select 
                        name="serviceId" 
                        value={formData.serviceId} 
                        onChange={handleServiceChange}
                        className={getInputClass('serviceId')}
                        // If a product is selected via URL, we might want to disable this or warn user
                        disabled={!!initialPackageId}
                    >
                        {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>
                </div>
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Package / Item</label>
                    {selectedProduct ? (
                         <div className="w-full p-3 bg-gray-100 rounded-lg border border-gray-200 text-gray-600 truncate">
                            {selectedProduct.name}
                         </div>
                    ) : (
                        <select 
                            name="packageId" 
                            value={formData.packageId} 
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        >
                            <option value="">Select a package (Optional)</option>
                            {filteredPackages.map(p => <option key={p.id} value={p.id}>{p.name} - ₹{p.price}</option>)}
                        </select>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Event Date
                    </label>
                    <div className="relative">
                        <input 
                            type="date" 
                            name="date" 
                            value={formData.date} 
                            onChange={handleChange}
                            className={getInputClass('date')}
                            min={new Date().toISOString().split('T')[0]}
                        />
                        <Calendar className="absolute right-3 top-3 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                    {errors.date && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.date}</p>}
                </div>
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Guest Count
                    </label>
                    <input 
                        type="number" 
                        name="guests" 
                        value={formData.guests} 
                        onChange={handleChange}
                        className={getInputClass('guests')}
                        min="5"
                    />
                    {errors.guests && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.guests}</p>}
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Venue Address
                </label>
                <input 
                    type="text" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange}
                    className={getInputClass('address')}
                    placeholder="Area, Street, City"
                />
                {errors.address && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.address}</p>}
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Special Request / Message</label>
                <textarea 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none h-24 resize-none transition-all"
                    placeholder="Specific theme colors, timing constraints, etc."
                />
            </div>

            <div className="pt-4">
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                           {gettingLocation ? "Fetching Location..." : "Opening WhatsApp..."}
                        </span>
                    ) : (
                        <>
                            Book via WhatsApp <Smartphone className="w-5 h-5" />
                        </>
                    )}
                </button>
                <p className="text-center text-xs text-gray-400 mt-3">
                    Clicking "Book" will request your location to help us find you easily.
                </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};