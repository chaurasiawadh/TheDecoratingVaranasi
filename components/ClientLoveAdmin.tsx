import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';

import { db, storage } from '../firebase-config';
import { useData } from '../contexts/DataContext';
import { Loader2, Save, Trash2, ArrowLeft, Heart, Star } from 'lucide-react';
import { Testimonial } from '../types';

interface ClientLoveAdminProps {
    onBack: () => void;
    onSuccess: () => void;
}

export const ClientLoveAdmin: React.FC<ClientLoveAdminProps> = ({ onBack, onSuccess }) => {
    const { testimonials, refreshData } = useData();
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        rating: '5',
        message: '',
        imageUrl: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let imageUrl = formData.imageUrl;

            if (!imageUrl) {
                // Use a default avatar if no image provided
                imageUrl = `https://ui-avatars.com/api/?name=${formData.name}&background=random`
            }

            const newTestimonial: Omit<Testimonial, 'id'> = {
                name: formData.name,
                rating: Number(formData.rating),
                comment: formData.message,
                image: imageUrl
            };

            await addDoc(collection(db, 'testimonials'), {
                ...newTestimonial,
                createdAt: serverTimestamp()
            });

            // Reset form
            setFormData({ name: '', rating: '5', message: '', imageUrl: '' });

            await refreshData();
            alert('Testimonial added successfully!');

        } catch (error) {
            console.error(error);
            alert('Failed to save testimonial.');
        } finally {
            setLoading(false);
        }
    };

    // Delete State to show spinner on specific item
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        console.log('Deleting testimonial:', id);
        setDeletingId(id);
        setConfirmDeleteId(null);

        try {
            await deleteDoc(doc(db, 'testimonials', id));
            console.log('Document deleted, refreshing data...');
            await refreshData();
            console.log('Data refreshed.');
        } catch (error) {
            console.error('Error deleting testimonial:', error);
            alert('Failed to delete. Check console for details.');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={onBack} className="text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form Section */}
                <div>
                    <div className="bg-white p-6 rounded-xl border shadow-sm mb-8">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Heart className="w-5 h-5 text-red-500" />
                            Add Client Love
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Client Name</label>
                                <input
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Priya Sharma"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Rating</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="1"
                                        max="5"
                                        step="0.5"
                                        className="flex-grow accent-primary"
                                        value={formData.rating}
                                        onChange={e => setFormData({ ...formData, rating: e.target.value })}
                                    />
                                    <span className="font-bold text-lg flex items-center gap-1 w-16">
                                        {formData.rating} <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                                <textarea
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none min-h-[100px]"
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="What did they say?"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Photo (Optional)</label>
                                <div className="space-y-3">
                                    <input
                                        type="url"
                                        placeholder="Paste Image URL"
                                        className="w-full p-2 border rounded-lg text-sm"
                                        value={formData.imageUrl}
                                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors"
                            >
                                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                                Save Review
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div>
                    <div className="bg-white rounded-xl border shadow-sm overflow-hidden h-full flex flex-col">
                        <div className="p-4 border-b bg-gray-50 font-bold text-gray-700">
                            Recent Reviews ({testimonials.length})
                        </div>
                        <div className="divide-y overflow-y-auto flex-grow" style={{ maxHeight: '600px' }}>
                            {testimonials.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">No testimonials yet.</div>
                            ) : (
                                testimonials.map(t => (
                                    <div key={t.id} className="p-4 flex gap-4 hover:bg-gray-50 transition-colors group relative">
                                        <img
                                            src={t.image}
                                            alt={t.name}
                                            className="w-12 h-12 rounded-full object-cover border border-gray-200"
                                        />
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-gray-900">{t.name}</h4>

                                                <div className="relative">
                                                    <button
                                                        type="button"
                                                        onClick={() => setConfirmDeleteId(confirmDeleteId === t.id ? null : t.id)}
                                                        className={`text-gray-400 hover:text-red-500 p-1 transition-opacity disabled:opacity-50 ${confirmDeleteId === t.id ? 'opacity-100 text-red-500' : 'opacity-0 group-hover:opacity-100'}`}
                                                        title="Delete"
                                                        disabled={deletingId === t.id}
                                                    >
                                                        {deletingId === t.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                                                        ) : (
                                                            <Trash2 className="w-4 h-4" />
                                                        )}
                                                    </button>

                                                    {/* Confirmation Popover */}
                                                    {confirmDeleteId === t.id && (
                                                        <div className="absolute right-0 top-8 z-10 bg-white shadow-xl border border-gray-200 rounded-lg p-3 w-48 text-center animate-in fade-in zoom-in duration-200">
                                                            <p className="text-xs font-semibold text-gray-700 mb-3">Delete this review?</p>
                                                            <div className="flex gap-2 justify-center">
                                                                <button
                                                                    onClick={() => setConfirmDeleteId(null)}
                                                                    className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(t.id)}
                                                                    className="px-3 py-1.5 text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                            {/* Arrow */}
                                                            <div className="absolute -top-1.5 right-2 w-3 h-3 bg-white border-t border-l border-gray-200 transform rotate-45"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex text-yellow-500 text-xs mb-1">
                                                {'★'.repeat(Math.round(t.rating))}
                                            </div>
                                            <p className="text-gray-600 text-sm line-clamp-2 italic">"{t.comment}"</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
