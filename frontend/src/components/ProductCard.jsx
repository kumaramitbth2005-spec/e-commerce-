import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Eye, Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product, onQuickView }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product._id || product.id);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="glass-card overflow-hidden group relative flex flex-col h-full"
    >
      {/* Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
          product.condition === 'New' ? 'bg-green-500 text-white' : 
          product.condition === 'Like New' ? 'bg-blue-500 text-white' : 'bg-yellow-500 text-navy-900'
        }`}>
          {product.condition}
        </span>
      </div>

      {/* Wishlist Button */}
      <motion.button
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleWishlist}
        className={`absolute top-4 right-4 z-10 p-2 backdrop-blur-md rounded-full transition-all shadow ${
          wishlisted
            ? 'bg-primary text-white shadow-primary/30'
            : 'bg-navy-900/40 text-white hover:text-primary hover:bg-navy-900/60'
        }`}
        title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
      </motion.button>

      {/* Image Container */}
      <div 
        className="relative aspect-[4/5] overflow-hidden cursor-pointer" 
        onClick={() => onQuickView ? onQuickView(product) : null}
      >
        <img 
          src={product.image || (product.images && product.images[0]) || 'https://via.placeholder.com/500'} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-navy-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {onQuickView ? (
            <button className="p-3 bg-white text-navy-900 rounded-full hover:bg-secondary transition-colors shadow-lg shadow-white/20">
              <Eye className="w-6 h-6" />
            </button>
          ) : (
            <Link to={`/product/${product._id || product.id}`} className="p-3 bg-white text-navy-900 rounded-full hover:bg-secondary transition-colors">
              <Eye className="w-6 h-6" />
            </Link>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs text-secondary font-medium uppercase tracking-tighter">{product.category}</span>
          <div className="flex items-center space-x-1 text-yellow-400">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs font-bold text-white">{product.rating}</span>
          </div>
        </div>

        <Link to={`/product/${product._id || product.id}`} className="text-lg font-bold mb-2 hover:text-secondary transition-colors line-clamp-1">
          {product.name}
        </Link>

        <div className="flex items-center space-x-2 mb-4 text-gray-400 text-xs">
          <MapPin className="w-3 h-3" />
          <span>{product.collegeName || product.college || 'Campus'}</span>
        </div>

        <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xl font-extrabold text-white">₹{product.price}</span>
            {product.oldPrice && (
              <span className="text-xs text-gray-500 line-through ml-2">₹{product.oldPrice}</span>
            )}
          </div>
          <button 
            onClick={() => toast.success(`🛒 "${product.name}" added to cart!`)}
            className="p-2 bg-secondary/10 text-secondary border border-secondary/20 rounded-lg hover:bg-secondary hover:text-navy-900 transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
