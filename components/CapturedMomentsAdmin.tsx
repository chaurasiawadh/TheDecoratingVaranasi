import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase-config';
import { useData } from '../contexts/DataContext';
import { Loader2, Plus, Image as ImageIcon, Save, Trash2, ArrowLeft, Camera } from 'lucide-react';
import { CapturedMoment } from '../types';

interface CapturedMomentsAdminProps {
    onBack: () => void;
    onSuccess: () => void;
}

export const CapturedMomentsAdmin: React.FC<CapturedMomentsAdminProps> = ({ onBack, onSuccess }) => {
    const { capturedMoments, services, refreshData } = useData();
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        imageUrl: ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setUploadProgress(0);

        try {
            let imageUrl = formData.imageUrl;

            if (imageFile) {
                const storageRef = ref(storage, `captured_moments/${Date.now()}_${imageFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, imageFile);

                await new Promise<void>((resolve, reject) => {
                    uploadTask.on('state_changed',
                        (snap) => setUploadProgress((snap.bytesTransferred / snap.totalBytes) * 100),
                        reject,
                        async () => {
                            imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve();
                        }
                    );
                });
            }

            if (!imageUrl) {
                alert('Please provide an image URL or upload a file.');
                setLoading(false);
                return;
            }

            const newMoment: Omit<CapturedMoment, 'id'> = {
                name: formData.name,
                type: formData.type || 'General',
                imageUrl: imageUrl,
                timestamp: serverTimestamp()
            };

            await addDoc(collection(db, 'captured_moments'), newMoment);

            // Reset form
            setFormData({ name: '', type: '', imageUrl: '' });
            setImageFile(null);
            setUploadProgress(0);

            await refreshData();
            alert('Moment captured successfully!');

        } catch (error) {
            console.error(error);
            alert('Failed to save moment.');
        } finally {
            setLoading(false);
        }
    };

    // Delete State
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        console.log('Deleting moment:', id);
        setDeletingId(id);
        setConfirmDeleteId(null);

        try {
            await deleteDoc(doc(db, 'captured_moments', id));
            await refreshData();
        } catch (error) {
            console.error(error);
            alert('Failed to delete.');
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
                            <Camera className="w-5 h-5 text-primary" />
                            Add New Moment
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Moment Name</label>
                                <input
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Birthday Bash at Grand Hotel"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Service Type</label>
                                <select
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    required
                                >
                                    <option value="">Select Service...</option>
                                    {services.map(s => (
                                        <option key={s.id} value={s.title}>{s.title}</option>
                                    ))}
                                    <option value="General">General/Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Photo</label>
                                <div className="space-y-3">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setImageFile(e.target.files?.[0] || null)}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                    />
                                    <div className="text-center text-gray-400 text-xs">- OR -</div>
                                    <input
                                        type="url"
                                        placeholder="Paste Image URL"
                                        className="w-full p-2 border rounded-lg text-sm"
                                        value={formData.imageUrl}
                                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                    />
                                </div>

                                {/* Preview */}
                                {(imageFile || formData.imageUrl) && (
                                    <div className="mt-4 relative h-40 rounded-lg overflow-hidden bg-gray-100 border">
                                        <img
                                            src={imageFile ? URL.createObjectURL(imageFile) : formData.imageUrl}
                                            alt="Preview"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                )}

                                {loading && uploadProgress > 0 && (
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                        <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors"
                            >
                                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                                Save Moment
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div>
                    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                        <div className="p-4 border-b bg-gray-50 font-bold text-gray-700">
                            Recent Moments ({capturedMoments.length})
                        </div>
                        <div className="divide-y max-h-[600px] overflow-y-auto">
                            {capturedMoments.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">No moments added yet.</div>
                            ) : (
                                capturedMoments.map(moment => (
                                    <div key={moment.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors group">
                                        <img
                                            src={moment.imageUrl}
                                            alt={moment.name}
                                            className="w-16 h-16 rounded-lg object-cover bg-gray-200"
                                        />
                                        <div className="flex-grow">
                                            <h4 className="font-bold text-gray-900">{moment.name}</h4>
                                            <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                                {moment.type}
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setConfirmDeleteId(confirmDeleteId === moment.id ? null : moment.id)}
                                                className={`text-gray-400 hover:text-red-500 p-2 transition-opacity disabled:opacity-50 ${confirmDeleteId === moment.id ? 'opacity-100 text-red-500' : 'opacity-0 group-hover:opacity-100'}`}
                                                title="Delete"
                                                disabled={deletingId === moment.id}
                                            >
                                                {deletingId === moment.id ? (
                                                    <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                                                ) : (
                                                    <Trash2 className="w-5 h-5" />
                                                )}
                                            </button>

                                            {/* Confirmation Popover */}
                                            {confirmDeleteId === moment.id && (
                                                <div className="absolute right-0 top-10 z-10 bg-white shadow-xl border border-gray-200 rounded-lg p-3 w-48 text-center animate-in fade-in zoom-in duration-200">
                                                    <p className="text-xs font-semibold text-gray-700 mb-3">Delete this moment?</p>
                                                    <div className="flex gap-2 justify-center">
                                                        <button
                                                            onClick={() => setConfirmDeleteId(null)}
                                                            className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(moment.id)}
                                                            className="px-3 py-1.5 text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                    {/* Arrow */}
                                                    <div className="absolute -top-1.5 right-3 w-3 h-3 bg-white border-t border-l border-gray-200 transform rotate-45"></div>
                                                </div>
                                            )}
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
