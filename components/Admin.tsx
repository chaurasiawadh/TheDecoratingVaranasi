import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, doc, setDoc, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase-config';
import { Lock, LogOut, Plus, Image as ImageIcon, Save, Loader2, ArrowLeft, Edit, Check, Camera, Heart } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import { CapturedMomentsAdmin } from './CapturedMomentsAdmin';
import { ClientLoveAdmin } from './ClientLoveAdmin';

export const Admin: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Data State
  const { services, refreshData } = useData();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'service-form' | 'item-form' | 'moments' | 'testimonials'>('list');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Refresh data now that we are authenticated, in case initial public fetch failed
      await refreshData();
    } catch (err: any) {
      setError('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
            <p className="text-gray-500 text-sm">TheDecoratingVaranasi</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Login'}
            </button>
          </form>
          <div className="mt-6 text-center text-xs text-gray-400">
            <Link to="/" className="hover:text-primary">← Back to Website</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 hidden md:inline">{user.email}</span>
          <button onClick={handleLogout} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Logout">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-grow p-6 max-w-7xl mx-auto w-full">
        {view === 'list' && (
          <DashboardList
            services={services}
            onAddService={() => { setSelectedServiceId(null); setView('service-form'); }}
            onEditService={(id) => { setSelectedServiceId(id); setView('service-form'); }}
            onManageMoments={() => setView('moments')}
            onManageTestimonials={() => setView('testimonials')}
          />
        )}

        {view === 'moments' && (
          <CapturedMomentsAdmin
            onBack={() => setView('list')}
            onSuccess={() => { refreshData(); }}
          />
        )}

        {view === 'testimonials' && (
          <ClientLoveAdmin
            onBack={() => setView('list')}
            onSuccess={() => { refreshData(); }}
          />
        )}

        {view === 'service-form' && (
          <ServiceForm
            serviceId={selectedServiceId}
            onBack={() => setView('list')}
            onSuccess={() => { refreshData(); setView('list'); }}
            onManageItems={(id) => { setSelectedServiceId(id); setView('item-form'); }}
          />
        )}

        {view === 'item-form' && selectedServiceId && (
          <ItemManager
            serviceId={selectedServiceId}
            onBack={() => setView('service-form')}
            onSuccess={() => refreshData()}
          />
        )}
      </main>
    </div>
  );
};

const DashboardList = ({ services, onAddService, onEditService, onManageMoments, onManageTestimonials }: any) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-800">Services</h2>
      <button onClick={onAddService} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-purple-700 transition-colors">
        <Plus className="w-5 h-5" /> Add Service
      </button>
    </div>

    {/* Quick Actions */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <button onClick={onManageMoments} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group">
        <div className="w-12 h-12 rounded-full bg-purple-50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
          <Camera className="w-6 h-6" />
        </div>
        <span className="font-bold text-gray-800">Captured Moments</span>
      </button>

      <button onClick={onManageTestimonials} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
          <Heart className="w-6 h-6" />
        </div>
        <span className="font-bold text-gray-800">Client Love</span>
      </button>
    </div>

    <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Service Management</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service: any) => (
        <div key={service.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div className="h-40 bg-gray-100 relative">
            <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
            <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold shadow-sm">
              {service.id}
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg text-gray-900 mb-1">{service.title}</h3>
            <p className="text-sm text-gray-500 line-clamp-2 mb-2">{service.description}</p>
            {service.priceStart > 0 && (
              <p className="text-sm font-bold text-primary mb-4">Starts from ₹{service.priceStart.toLocaleString()}</p>
            )}
            <button
              onClick={() => onEditService(service.id)}
              className="w-full border border-primary text-primary font-bold py-2 rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" /> Manage
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ServiceForm = ({ serviceId, onBack, onSuccess, onManageItems }: any) => {
  const { services } = useData();
  const existingService = services.find((s: any) => s.id === serviceId);

  const [formData, setFormData] = useState({
    title: existingService?.title || '',
    slug: existingService?.id || '',
    description: existingService?.description || '',

    tags: (existingService?.features || []) as string[],
    imageUrl: '',
    priceStart: existingService?.priceStart || ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [customTag, setCustomTag] = useState('');

  const PREDEFINED_TAGS = ["Balloon Arches", "Themed Backdrops", "Cake Table Decor"];

  const toggleServiceTag = (tag: string) => {
    setFormData(prev => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: newTags };
    });
  };

  const addCustomTag = () => {
    if (customTag && !formData.tags.includes(customTag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, customTag] }));
      setCustomTag('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.imageUrl || existingService?.image || '';

      if (imageFile) {
        const storageRef = ref(storage, `services/${formData.slug}/hero_${Date.now()}`);
        const uploadTask = await uploadBytesResumable(storageRef, imageFile);
        imageUrl = await getDownloadURL(uploadTask.ref);
      }

      const serviceData = {
        service: formData.title,
        slug: formData.slug,
        description: formData.description,
        tags: formData.tags,
        image: imageUrl,
        priceStart: Number(formData.priceStart) || 0,
        updatedAt: serverTimestamp(),
        createdAt: existingService?.createdAt || serverTimestamp()
      };

      await setDoc(doc(db, 'services', formData.slug), serviceData, { merge: true });
      alert('Service Saved!');
      onSuccess();
    } catch (err) {
      console.error(err);
      alert('Error saving service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={onBack} className="text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{serviceId ? 'Edit Service' : 'New Service'}</h2>
          {serviceId && (
            <button onClick={() => onManageItems(serviceId)} className="bg-secondary text-white px-4 py-2 rounded-lg font-bold text-sm">
              Manage Items
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Service Title</label>
              <input
                className="w-full p-3 border rounded-lg"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Slug (ID)</label>
              <input
                className="w-full p-3 border rounded-lg bg-gray-50"
                value={formData.slug}
                onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                required
                disabled={!!serviceId}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Starting Price</label>
              <input
                type="number"
                className="w-full p-3 border rounded-lg"
                value={formData.priceStart}
                onChange={e => setFormData({ ...formData, priceStart: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea
              className="w-full p-3 border rounded-lg h-32"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Features / Tags</label>

            {/* Selected Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map(tag => (
                <span key={tag} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                  {tag}
                  <button type="button" onClick={() => toggleServiceTag(tag)} className="hover:text-red-500">
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Predefined Options */}
            <div className="flex flex-wrap gap-2 mb-3">
              {PREDEFINED_TAGS.map(tag => {
                if (formData.tags.includes(tag)) return null;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleServiceTag(tag)}
                    className="px-3 py-1 rounded-full text-sm border border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition-colors"
                  >
                    + {tag}
                  </button>
                )
              })}
            </div>

            {/* Custom Tag Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                placeholder="Add extra tag..."
                className="flex-grow p-2 border rounded"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomTag();
                  }
                }}
              />
              <button type="button" onClick={addCustomTag} className="bg-gray-100 px-4 py-2 rounded font-bold hover:bg-gray-200 text-sm">
                Add
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Hero Image</label>
            <div className="flex items-center gap-4">
              <input type="file" onChange={e => setImageFile(e.target.files?.[0] || null)} accept="image/*" />
              {formData.imageUrl && !imageFile && (
                <img src={formData.imageUrl} className="w-16 h-16 rounded object-cover" alt="Preview" />
              )}
              {!formData.imageUrl && existingService?.image && !imageFile && (
                <img src={existingService.image} alt="Current" className="w-16 h-16 object-cover rounded" />
              )}
            </div>
            <div className="mt-2">
              <input
                type="text"
                placeholder="Or paste image URL"
                className="w-full p-2 border rounded text-sm"
                value={formData.imageUrl}
                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-700 transition-all flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />} Save Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AVAILABLE_TAGS = ['bestseller', 'new', 'premium', 'same-day', 'budget'];

const ItemManager = ({ serviceId, onBack, onSuccess }: any) => {
  const { products } = useData();
  const serviceItems = products.filter((p: any) => p.serviceId === serviceId);
  const [editingItem, setEditingItem] = useState<any>(null); // null = list mode, {} = create mode, populated = edit

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    price: '' as string | number,
    oldPrice: '' as string | number,
    shortDesc: '',
    fullDesc: '',

    tags: [] as string[],
    stock: '' as string | number,
    imageUrl: '',
    rating: '' as string | number,
    reviews: '' as string | number
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Populate form on edit
  useEffect(() => {
    if (editingItem && editingItem.id) {
      setFormData({
        name: editingItem.name,
        id: editingItem.id,
        price: editingItem.price,
        oldPrice: editingItem.oldPrice || '',
        shortDesc: editingItem.shortDescription,
        fullDesc: editingItem.fullDescription,

        tags: editingItem.tags || [],
        stock: editingItem.stockQty || '',
        imageUrl: editingItem.image || editingItem.heroImage || '',
        rating: editingItem.rating || '',
        reviews: editingItem.reviewsCount || editingItem.reviews || ''
      });
    } else {
      // Reset for new item
      setFormData({ name: '', id: '', price: '', oldPrice: '', shortDesc: '', fullDesc: '', tags: [], stock: '', imageUrl: '', rating: '', reviews: '' });
    }
  }, [editingItem]);

  const toggleTag = (tag: string) => {
    setFormData(prev => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: newTags };
    });
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0);
    console.log('formData', formData);

    try {
      let imageUrl = formData.imageUrl || editingItem?.image || '';

      // Upload Image
      if (imageFile) {
        const storageRef = ref(storage, `services/${serviceId}/items/${formData.id}_${Date.now()}`);
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

      const priceVal = Number(formData.price) || 0;
      const oldPriceVal = Number(formData.oldPrice) || 0;

      const discountPercent = oldPriceVal > priceVal
        ? Math.round(((oldPriceVal - priceVal) / oldPriceVal) * 100)
        : 0;

      const itemData = {
        id: formData.id,
        name: formData.name,

        image: imageUrl,
        heroImage: imageUrl,
        images: [imageUrl],
        price: priceVal,
        oldPrice: oldPriceVal,
        discountPercent,
        discountText: discountPercent > 0 ? `${discountPercent}% OFF` : null,
        shortDescription: formData.shortDesc,
        fullDescription: formData.fullDesc,
        tags: formData.tags, // Array directly
        rating: formData.rating === '' ? 5 : Number(formData.rating),
        reviews: formData.reviews === '' ? 0 : Number(formData.reviews),
        reviewsCount: formData.reviews === '' ? 0 : Number(formData.reviews), // Saving both for compatibility if schema varies
        stockQty: formData.stock === '' ? 10 : Number(formData.stock),
        updatedAt: serverTimestamp(),
        createdAt: editingItem?.createdAt || serverTimestamp(),
        // Defaults
        currency: 'INR',
        availability: 'available',
        deliveryTimeEstimate: '24-48 hours'
      };

      // Save to subcollection
      const itemRef = doc(db, 'services', serviceId, 'items', formData.id);
      await setDoc(itemRef, itemData, { merge: true });

      alert('Item Saved!');
      onSuccess();
      setEditingItem(null); // Return to list
      setImageFile(null);
    } catch (err) {
      console.error(err);
      alert('Error saving item');
    } finally {
      setLoading(false);
    }
  };

  if (editingItem !== null) {
    return (
      <div className="max-w-3xl mx-auto">
        <button onClick={() => setEditingItem(null)} className="text-gray-500 mb-6 flex gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Item List
        </button>
        <div className="bg-white p-8 rounded-xl border shadow-sm">
          <h2 className="text-xl font-bold mb-6">{editingItem.id ? 'Edit Item' : 'New Item'}</h2>
          <form onSubmit={handleSaveItem} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-bold text-gray-700 mb-1">Item Name</label>
                <input className="w-full p-2 border rounded" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-bold text-gray-700 mb-1">Item ID (Slug)</label>
                <input className="w-full p-2 border rounded bg-gray-50" value={formData.id} onChange={e => setFormData({ ...formData, id: e.target.value })} required disabled={!!editingItem.id} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Price</label>
                <input type="number" className="w-full p-2 border rounded" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Old Price</label>
                <input type="number" className="w-full p-2 border rounded" value={formData.oldPrice} onChange={e => setFormData({ ...formData, oldPrice: e.target.value })} placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Rating (0-5)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  className="w-full p-2 border rounded"
                  value={formData.rating}
                  onChange={e => setFormData({ ...formData, rating: e.target.value })}
                  placeholder="5"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Reviews Count</label>
                <input
                  type="number"
                  min="0"
                  className="w-full p-2 border rounded"
                  value={formData.reviews}
                  onChange={e => setFormData({ ...formData, reviews: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Short Description</label>
              <textarea className="w-full p-2 border rounded h-20" value={formData.shortDesc} onChange={e => setFormData({ ...formData, shortDesc: e.target.value })} required />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Full Description</label>
              <textarea className="w-full p-2 border rounded h-32" value={formData.fullDesc} onChange={e => setFormData({ ...formData, fullDesc: e.target.value })} required />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-bold border transition-colors flex items-center gap-1 ${formData.tags.includes(tag)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    {tag}
                    {formData.tags.includes(tag) && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">Select one or more tags for this product.</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Item Image</label>
              <div className="flex items-center gap-4">
                <input type="file" onChange={e => setImageFile(e.target.files?.[0] || null)} accept="image/*" />
                <input type="file" onChange={e => setImageFile(e.target.files?.[0] || null)} accept="image/*" />
                {formData.imageUrl && !imageFile && (
                  <img src={formData.imageUrl} className="w-16 h-16 rounded object-cover" alt="Preview" />
                )}
                {!formData.imageUrl && editingItem.image && !imageFile && <img src={editingItem.image} className="w-16 h-16 rounded object-cover" alt="Existing" />}
              </div>
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Or paste image URL"
                  className="w-full p-2 border rounded text-sm"
                  value={formData.imageUrl}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>
              {loading && uploadProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t flex justify-end">
              <button type="submit" disabled={loading} className="bg-primary text-white px-6 py-2 rounded-lg font-bold flex gap-2">
                {loading ? 'Uploading...' : 'Save Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Service
      </button>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Items for {serviceId}</h2>
        <button onClick={() => setEditingItem({})} className="bg-primary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        {serviceItems.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No items found for this service. Add one!</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Price</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {serviceItems.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                  </td>
                  <td className="p-4 font-medium">{item.name}</td>
                  <td className="p-4">₹{item.price}</td>
                  <td className="p-4">
                    <button onClick={() => setEditingItem(item)} className="text-primary font-bold hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};