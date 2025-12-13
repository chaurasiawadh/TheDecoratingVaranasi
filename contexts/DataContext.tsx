import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, getDocs, collectionGroup } from 'firebase/firestore';
import { db } from '../firebase-config';
import { SERVICES, ALL_PRODUCTS } from '../constants';
import { Service, ProductItem, CapturedMoment } from '../types';

interface DataContextType {
  services: Service[];
  products: ProductItem[];
  capturedMoments: CapturedMoment[];
  loading: boolean;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType>({
  services: SERVICES,
  products: ALL_PRODUCTS,
  capturedMoments: [],
  loading: false,
  refreshData: async () => { },
});

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [products, setProducts] = useState<ProductItem[]>(ALL_PRODUCTS);
  const [capturedMoments, setCapturedMoments] = useState<CapturedMoment[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    setLoading(true);
    try {
      // Attempt to fetch from Firestore
      // Note: This requires Firestore Security Rules to allow read access
      const servicesRef = collection(db, 'services');
      const servicesSnap = await getDocs(servicesRef);

      const productsRef = collectionGroup(db, 'items');
      const productsSnap = await getDocs(productsRef);

      if (!servicesSnap.empty) {
        const fetchedServices = servicesSnap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.service || data.title,
            description: data.description,
            image: data.image,
            features: data.tags || [],
            priceStart: data.priceStart || 0,
            ...data
          } as Service;
        });
        setServices(fetchedServices);
      }

      if (!productsSnap.empty) {
        const fetchedProducts = productsSnap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            serviceId: doc.ref.parent.parent?.id || '',
            ...data
          } as ProductItem;
        });
        setProducts(fetchedProducts);
      }

      // Fetch Captured Moments
      const momentsRef = collection(db, 'captured_moments');
      const momentsSnap = await getDocs(momentsRef);
      if (!momentsSnap.empty) {
        const fetchedMoments = momentsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as CapturedMoment));
        setCapturedMoments(fetchedMoments);
      }
    } catch (error: any) {
      // Handle permission errors (common in dev/new projects) gracefully
      if (error.code === 'permission-denied') {
        console.warn("Firestore permission denied. Falling back to static data. Ensure Firestore Security Rules allow public read access.");
      } else {
        console.error("Error fetching data:", error);
      }
      // Keep initial static state on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <DataContext.Provider value={{ services, products, capturedMoments, loading, refreshData }}>
      {children}
    </DataContext.Provider>
  );
};