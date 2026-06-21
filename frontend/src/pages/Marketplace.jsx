import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { Filter, ChevronDown, SlidersHorizontal, Search, Loader2, X, Star, MapPin, Heart, ShoppingCart, MessageSquare, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../api';

const Marketplace = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);
  
  // Mock data as fallback
  const mockProducts = [
    { _id: '1', name: "Engineering Mechanics", category: "Engineering", price: 350, oldPrice: 600, condition: "Good", rating: 4.5, collegeName: "IIT Bombay", images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500"] },
    { _id: '2', name: "Casio FX-991EX", category: "Tools", price: 850, oldPrice: 1200, condition: "Like New", rating: 4.9, collegeName: "NIT Delhi", images: ["https://images.unsplash.com/photo-1518118014377-ce94f3ba3734?w=500"] },
    { _id: '3', name: "Organic Chemistry Notes", category: "Notes", price: 150, oldPrice: 300, condition: "New", rating: 4.2, collegeName: "DTU", images: ["https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500"] },
    { _id: '4', name: "Lab Coat - Medium", category: "Tools", price: 200, oldPrice: 450, condition: "Fair", rating: 3.8, collegeName: "BITS Pilani", images: ["https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500"] },
    { _id: '5', name: "HCV Physics Part 1", category: "Engineering", price: 280, oldPrice: 400, condition: "Like New", rating: 5.0, collegeName: "IIT Bombay", images: ["https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500"] },
    { _id: '6', name: "Medical Anatomy Book", category: "Medical", price: 1200, oldPrice: 2500, condition: "Good", rating: 4.7, collegeName: "AIIMS Delhi", images: ["https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500"] },
  ];

  const [products, setProducts] = useState(mockProducts);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {};
        if (activeCategory !== 'All') params.category = activeCategory;
        if (searchQuery) params.search = searchQuery;
        const { data } = await API.get('/products', { params });
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(mockProducts);
        }
      } catch (err) {
        // Fallback to mock data if backend is not running
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory, searchQuery]);

  const categories = ['All', 'Engineering', 'Medical', 'Notes', 'Tools', 'Laptop accessories'];

  return (
    <div className="px-4 md:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold mb-1">Marketplace</h1>
          <p className="text-gray-400 text-sm">Discover academic treasures from fellow students</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <select className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all cursor-pointer text-sm">
              <option className="bg-navy-900 text-white">Sort: Newest</option>
              <option className="bg-navy-900 text-white">Price: Low to High</option>
              <option className="bg-navy-900 text-white">Price: High to Low</option>
              <option className="bg-navy-900 text-white">Top Rated</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Category Filter Chips — replaces the old sidebar filter */}
      <div className="flex overflow-x-auto pb-4 space-x-2 no-scrollbar mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-5 py-2 rounded-full border text-sm transition-all ${
              activeCategory === cat 
              ? 'bg-secondary/15 text-secondary border-secondary/40 font-semibold' 
              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid — full width, no sidebar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-secondary animate-spin" />
          </div>
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id || product.id} product={product} onQuickView={setSelectedProduct} />
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <p className="text-gray-400 text-lg">No products found. Try a different search.</p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      <div className="mt-12 flex justify-center items-center space-x-3">
        <button className="px-4 py-2 glass-card text-sm opacity-50 cursor-not-allowed">Previous</button>
        <div className="flex space-x-2">
          <button className="w-9 h-9 bg-secondary text-navy-900 rounded-lg font-bold text-sm">1</button>
          <button className="w-9 h-9 glass-card hover:bg-white/10 transition-colors text-sm">2</button>
          <button className="w-9 h-9 glass-card hover:bg-white/10 transition-colors text-sm">3</button>
        </div>
        <button className="px-4 py-2 glass-card hover:bg-white/10 transition-colors text-sm">Next</button>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-navy-900/80 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-navy-800 border border-white/10 rounded-2xl shadow-2xl z-10 flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white/70 hover:text-white transition-all z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image Section */}
              <div className="w-full md:w-1/2 bg-navy-900 relative">
                <img 
                  src={selectedProduct.image || (selectedProduct.images && selectedProduct.images[0]) || 'https://via.placeholder.com/500'} 
                  alt={selectedProduct.name}
                  className="w-full h-[300px] md:h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${
                    selectedProduct.condition === 'New' ? 'bg-green-500 text-white' : 
                    selectedProduct.condition === 'Like New' ? 'bg-blue-500 text-white' : 'bg-yellow-500 text-navy-900'
                  }`}>
                    {selectedProduct.condition}
                  </span>
                </div>
              </div>

              {/* Details Section */}
              <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-secondary font-bold uppercase tracking-widest">{selectedProduct.category}</span>
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold text-white">{selectedProduct.rating}</span>
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight">{selectedProduct.name}</h2>
                
                <div className="flex items-center space-x-2 text-gray-400 mb-6">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedProduct.collegeName || selectedProduct.college || 'Campus'}</span>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline space-x-3">
                    <span className="text-4xl font-black text-white">₹{selectedProduct.price}</span>
                    {selectedProduct.oldPrice && (
                      <span className="text-lg text-gray-500 line-through">₹{selectedProduct.oldPrice}</span>
                    )}
                  </div>
                  {selectedProduct.oldPrice && (
                    <p className="text-green-400 text-sm font-bold mt-1">You save ₹{selectedProduct.oldPrice - selectedProduct.price}!</p>
                  )}
                </div>

                <p className="text-gray-400 text-sm mb-8 line-clamp-3">
                  {selectedProduct.description || "This item is in great condition and ready for a new owner. It has been used carefully and contains no major defects. Perfect for your upcoming semester!"}
                </p>

                {/* Quick Actions (Many Tasks) */}
                <div className="mt-auto space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center space-x-2 bg-secondary text-navy-900 py-3.5 rounded-xl font-bold hover:bg-white transition-all shadow-[0_0_15px_rgba(0,242,255,0.3)]">
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(255,0,122,0.3)]">
                      <MessageSquare className="w-5 h-5" />
                      <span>Contact Seller</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center space-x-2 bg-white/5 border border-white/10 py-3 rounded-xl font-medium text-white hover:bg-white/10 transition-all">
                      <Heart className="w-4 h-4" />
                      <span>Wishlist</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 bg-white/5 border border-white/10 py-3 rounded-xl font-medium text-white hover:bg-white/10 transition-all">
                      <Share2 className="w-4 h-4" />
                      <span>Share Item</span>
                    </button>
                  </div>
                  
                  <Link 
                    to={`/product/${selectedProduct._id || selectedProduct.id}`}
                    className="block text-center mt-4 text-secondary text-sm font-bold hover:underline"
                  >
                    View Full Details &rarr;
                  </Link>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Marketplace;
