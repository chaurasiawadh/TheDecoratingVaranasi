import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, ChevronDown, Search, ArrowLeft } from 'lucide-react';
import { ALL_PRODUCTS, SERVICES } from '../constants';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { ProductItem } from '../types';

export const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [filterTag, setFilterTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const service = SERVICES.find(s => s.id === id);
  
  // Filter products for this service
  const serviceProducts = useMemo(() => {
    return ALL_PRODUCTS.filter(p => p.serviceId === id);
  }, [id]);

  // Extract unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    serviceProducts.forEach(p => p.tags.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, [serviceProducts]);

  // Apply filters and sort
  const filteredProducts = useMemo(() => {
    let result = [...serviceProducts];

    if (filterTag !== 'all') {
      result = result.filter(p => p.tags.includes(filterTag));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q));
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result = result.filter(p => p.tags.includes('new')).concat(result.filter(p => !p.tags.includes('new')));
        break;
      default: // popular
        // Assuming original order is somewhat curated or random, keeping as is or sorting by rating
        result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [serviceProducts, filterTag, sortBy, searchQuery]);

  if (!service) {
    return <div className="p-20 text-center">Service not found. <Link to="/" className="text-primary underline">Go Home</Link></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      {/* Header Banner */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 py-8">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-4 text-sm font-bold">
                <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-2">{service.title}</h1>
                    <p className="text-gray-500 max-w-2xl">{service.description}</p>
                </div>
                <div className="text-right hidden md:block">
                    <div className="text-sm text-gray-400">Starting from</div>
                    <div className="text-2xl font-bold text-primary">₹{service.priceStart.toLocaleString()}</div>
                </div>
            </div>
        </div>
        
        {/* Filters Bar */}
        <div className="border-t border-gray-100 bg-white px-4 py-3">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-center">
                
                {/* Search */}
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search items..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                </div>

                {/* Tag Filters */}
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                    <button 
                        onClick={() => setFilterTag('all')}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${filterTag === 'all' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        All Items
                    </button>
                    {allTags.map(tag => (
                        <button 
                            key={tag}
                            onClick={() => setFilterTag(tag)}
                            className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap capitalize transition-colors ${filterTag === tag ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {/* Sort */}
                <div className="relative group min-w-[140px]">
                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none w-full bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold text-gray-700 cursor-pointer hover:border-primary focus:outline-none"
                    >
                        <option value="popular">Most Popular</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="newest">New Arrivals</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
            {filteredProducts.map(product => (
                <ProductCard 
                    key={product.id} 
                    product={product} 
                    onQuickView={setSelectedProduct} 
                />
            ))}
        </motion.div>

        {filteredProducts.length === 0 && (
            <div className="text-center py-20 text-gray-400">
                <p>No items found matching your criteria.</p>
                <button onClick={() => {setFilterTag('all'); setSearchQuery('')}} className="mt-4 text-primary font-bold hover:underline">Clear filters</button>
            </div>
        )}
      </div>

      {/* Detail Modal */}
      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </div>
  );
};