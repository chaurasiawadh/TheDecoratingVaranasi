import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, doc, setDoc, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase-config';
import { Lock, LogOut, Plus, Image as ImageIcon, Save, Loader2, ArrowLeft, Edit } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';

export const Admin: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Data State
  const { services, refreshData } = useData();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'service-form' | 'item-form'>('list');

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

const DashboardList = ({ services, onAddService, onEditService }: any) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-800">Services</h2>
      <button onClick={onAddService} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-purple-700 transition-colors">
        <Plus className="w-5 h-5" /> Add Service
      </button>
    </div>
    
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
            <p className="text-sm text-gray-500 line-clamp-2 mb-4">{service.description}</p>
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
    tags: existingService?.features?.join(', ') || ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let imageUrl = existingService?.image || '';
      
      if (imageFile) {
        const storageRef = ref(storage, `services/${formData.slug}/hero_${Date.now()}`);
        const uploadTask = await uploadBytesResumable(storageRef, imageFile);
        imageUrl = await getDownloadURL(uploadTask.ref);
      }

      const serviceData = {
        service: formData.title,
        slug: formData.slug,
        description: formData.description,
        tags: formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
        image: imageUrl,
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
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  required
                />
             </div>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Slug (ID)</label>
                <input 
                  className="w-full p-3 border rounded-lg bg-gray-50" 
                  value={formData.slug} 
                  onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                  required
                  disabled={!!serviceId}
                />
             </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea 
               className="w-full p-3 border rounded-lg h-32" 
               value={formData.description} 
               onChange={e => setFormData({...formData, description: e.target.value})}
               required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Tags (comma separated)</label>
            <input 
               className="w-full p-3 border rounded-lg" 
               value={formData.tags} 
               onChange={e => setFormData({...formData, tags: e.target.value})}
               placeholder="birthday, balloon, kids"
            />
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Hero Image</label>
             <div className="flex items-center gap-4">
                <input type="file" onChange={e => setImageFile(e.target.files?.[0] || null)} accept="image/*" />
                {existingService?.image && !imageFile && (
                    <img src={existingService.image} alt="Current" className="w-16 h-16 object-cover rounded" />
                )}
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

const ItemManager = ({ serviceId, onBack, onSuccess }: any) => {
    const { products } = useData();
    const serviceItems = products.filter((p: any) => p.serviceId === serviceId);
    const [editingItem, setEditingItem] = useState<any>(null); // null = list mode, {} = create mode, populated = edit
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        id: '',
        price: 0,
        oldPrice: 0,
        shortDesc: '',
        fullDesc: '',
        tags: '',
        stock: 10
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
                oldPrice: editingItem.oldPrice,
                shortDesc: editingItem.shortDescription,
                fullDesc: editingItem.fullDescription,
                tags: editingItem.tags.join(', '),
                stock: editingItem.stockQty || 10
            });
        } else {
            // Reset for new item
            setFormData({ name: '', id: '', price: 0, oldPrice: 0, shortDesc: '', fullDesc: '', tags: '', stock: 10 });
        }
    }, [editingItem]);

    const handleSaveItem = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setUploadProgress(0);

        try {
            let imageUrl = editingItem?.image || '';
            
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

            const discountPercent = formData.oldPrice > formData.price 
                ? Math.round(((formData.oldPrice - formData.price) / formData.oldPrice) * 100) 
                : 0;

            const itemData = {
                id: formData.id,
                name: formData.name,
                heroImage: imageUrl,
                images: [imageUrl],
                price: Number(formData.price),
                oldPrice: Number(formData.oldPrice),
                discountPercent,
                discountText: discountPercent > 0 ? `${discountPercent}% OFF` : null,
                shortDescription: formData.shortDesc,
                fullDescription: formData.fullDesc,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                stockQty: Number(formData.stock),
                updatedAt: serverTimestamp(),
                createdAt: editingItem?.createdAt || serverTimestamp(),
                // Defaults
                currency: 'INR',
                availability: 'available',
                deliveryTimeEstimate: '24-48 hours',
                rating: editingItem?.rating || 5,
                reviewsCount: editingItem?.reviews || 0
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
                                <input className="w-full p-2 border rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Item ID (Slug)</label>
                                <input className="w-full p-2 border rounded bg-gray-50" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} required disabled={!!editingItem.id} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Price</label>
                                <input type="number" className="w-full p-2 border rounded" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} required />
                            </div>
                             <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Old Price</label>
                                <input type="number" className="w-full p-2 border rounded" value={formData.oldPrice} onChange={e => setFormData({...formData, oldPrice: Number(e.target.value)})} />
                            </div>
                        </div>
                        
                        <div>
                             <label className="block text-sm font-bold text-gray-700 mb-1">Short Description</label>
                             <textarea className="w-full p-2 border rounded h-20" value={formData.shortDesc} onChange={e => setFormData({...formData, shortDesc: e.target.value})} required />
                        </div>
                        
                        <div>
                             <label className="block text-sm font-bold text-gray-700 mb-1">Full Description</label>
                             <textarea className="w-full p-2 border rounded h-32" value={formData.fullDesc} onChange={e => setFormData({...formData, fullDesc: e.target.value})} required />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Tags (comma separated)</label>
                            <input className="w-full p-2 border rounded" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
                        </div>

                         <div>
                             <label className="block text-sm font-bold text-gray-700 mb-2">Item Image</label>
                             <div className="flex items-center gap-4">
                                <input type="file" onChange={e => setImageFile(e.target.files?.[0] || null)} accept="image/*" />
                                {editingItem.image && !imageFile && <img src={editingItem.image} className="w-16 h-16 rounded object-cover" />}
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