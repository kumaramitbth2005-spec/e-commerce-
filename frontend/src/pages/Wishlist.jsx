import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, ShoppingCart, Trash2, Star, MapPin, Tag,
  Search, Filter, ArrowRight, ShoppingBag, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useWishlist } from '../context/WishlistContext';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [addedToCart, setAddedToCart] = useState({});

  const categories = ['All', ...new Set(wishlist.map((p) => p.category).filter(Boolean))];

  const filtered = wishlist.filter((p) => {
    const matchSearch =
      !searchQuery ||
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = activeFilter === 'All' || p.category === activeFilter;
    return matchSearch && matchCat;
  });

  const handleAddToCart = (product) => {
    const id = product._id || product.id;
    setAddedToCart((prev) => ({ ...prev, [id]: true }));
    toast.success(`🛒 "${product.name}" added to cart!`);
    setTimeout(() => setAddedToCart((prev) => ({ ...prev, [id]: false })), 2000);
  };

  const handleMoveAllToCart = () => {
    toast.success(`🛒 ${filtered.length} items added to cart!`);
  };

  /* ── Empty state ── */
  if (wishlist.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="relative mb-8"
        >
          <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto relative">
            <Heart className="w-16 h-16 text-primary/40" strokeWidth={1.5} />
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-primary/30"
            >
              0
            </motion.div>
          </div>
          {/* floating sparkles */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ y: [-10, 10, -10], opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 + i * 0.4, delay: i * 0.3 }}
              className="absolute text-primary/30"
              style={{ top: `${20 + i * 15}%`, left: i % 2 === 0 ? '10%' : '80%' }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-3xl font-black text-white mb-3">Your wishlist is empty</h2>
          <p className="text-gray-400 max-w-sm mx-auto mb-8 leading-relaxed">
            Save items you love by tapping the heart icon on any product. They'll appear here for easy access.
          </p>
          <Link
            to="/marketplace"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary to-primary-light rounded-2xl font-bold hover:shadow-[0_0_30px_rgba(255,0,122,0.4)] transition-all transform hover:-translate-y-1"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Explore Marketplace</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold flex items-center gap-3">
            <Heart className="w-9 h-9 text-primary fill-current" />
            My Wishlist
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {wishlist.length} saved item{wishlist.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleMoveAllToCart}
            className="flex items-center space-x-2 px-5 py-2.5 bg-secondary/10 border border-secondary/30 text-secondary rounded-xl font-semibold text-sm hover:bg-secondary/20 transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add All to Cart</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={clearWishlist}
            className="flex items-center space-x-2 px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl font-semibold text-sm hover:bg-red-500/20 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear All</span>
          </motion.button>
        </div>
      </div>

      {/* ── Search + Filter ── */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search saved items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-secondary/50 text-sm transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl border text-sm font-medium transition-all flex-shrink-0 ${
                activeFilter === cat
                  ? 'bg-primary/15 text-primary border-primary/40 font-semibold'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── No search results ── */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Filter className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg font-medium">No items match your filter</p>
          <button onClick={() => { setSearchQuery(''); setActiveFilter('All'); }} className="mt-4 text-secondary text-sm hover:underline">
            Clear filters
          </button>
        </div>
      )}

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {filtered.map((product, idx) => {
            const id = product._id || product.id;
            const isInCart = addedToCart[id];
            const imageUrl =
              product.image ||
              (product.images && product.images[0]) ||
              'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500';
            const savings = product.oldPrice ? product.oldPrice - product.price : null;

            return (
              <motion.div
                key={id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ delay: idx * 0.04 }}
                className="glass-card overflow-hidden group flex flex-col relative"
              >
                {/* Remove button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeFromWishlist(id)}
                  className="absolute top-3 right-3 z-20 p-2 bg-navy-900/60 backdrop-blur-md rounded-full text-primary hover:bg-red-500/80 hover:text-white transition-all shadow"
                  title="Remove from wishlist"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </motion.button>

                {/* Condition badge */}
                <div className="absolute top-3 left-3 z-20">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      product.condition === 'New'
                        ? 'bg-green-500 text-white'
                        : product.condition === 'Like New'
                        ? 'bg-blue-500 text-white'
                        : 'bg-yellow-500 text-navy-900'
                    }`}
                  >
                    {product.condition || 'Used'}
                  </span>
                </div>

                {/* Image */}
                <Link to={`/product/${id}`} className="block relative aspect-[4/3] overflow-hidden bg-navy-800">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {savings && (
                    <div className="absolute bottom-3 left-3 bg-green-500/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-bold text-white">
                      Save ₹{savings}
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  {/* Category + Rating */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] text-secondary font-semibold uppercase tracking-wider flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {product.category || 'General'}
                    </span>
                    {product.rating && (
                      <div className="flex items-center space-x-1 text-yellow-400">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs font-bold text-white">{product.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <Link
                    to={`/product/${id}`}
                    className="font-bold text-base text-white hover:text-secondary transition-colors line-clamp-2 mb-2"
                  >
                    {product.name}
                  </Link>

                  {/* College */}
                  {(product.collegeName || product.college) && (
                    <div className="flex items-center space-x-1 text-gray-500 text-xs mb-4">
                      <MapPin className="w-3 h-3" />
                      <span>{product.collegeName || product.college}</span>
                    </div>
                  )}

                  {/* Price + CTA */}
                  <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-xl font-extrabold text-white">₹{product.price}</span>
                      {product.oldPrice && (
                        <span className="text-xs text-gray-500 line-through ml-2">₹{product.oldPrice}</span>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddToCart(product)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        isInCart
                          ? 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                          : 'bg-secondary/10 border border-secondary/30 text-secondary hover:bg-secondary hover:text-navy-900'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {isInCart ? 'Added!' : 'Add'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── Footer CTA ── */}
      {filtered.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 text-sm mb-4">Looking for more deals?</p>
          <Link
            to="/marketplace"
            className="inline-flex items-center space-x-2 px-6 py-3 glass-card text-white font-semibold rounded-xl hover:bg-white/10 transition-all group"
          >
            <ShoppingBag className="w-5 h-5 text-secondary" />
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default Wishlist;
