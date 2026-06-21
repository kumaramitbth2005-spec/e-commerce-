import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, MessageCircle, Heart, Share2, ShieldCheck, MapPin, Star, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Mock data for UI
  const product = {
    id: 1,
    name: "Engineering Mechanics: Statics & Dynamics",
    price: 350,
    oldPrice: 600,
    category: "Engineering",
    condition: "Like New",
    rating: 4.8,
    reviews: 12,
    college: "IIT Bombay",
    seller: {
      name: "Aditya Sharma",
      isVerified: true,
      rating: 4.9,
      joined: "Jan 2024"
    },
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800",
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800",
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800"
    ],
    description: "Hardcover 14th edition. No highlights or markings. The cover has slight wear but all pages are intact. Perfect for first-year engineering students. Includes the solution manual (PDF) which I can share after purchase.",
    specs: [
      { label: "Author", value: "R.C. Hibbeler" },
      { label: "Edition", value: "14th (International)" },
      { label: "Semester", value: "1st & 2nd" }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs / Back */}
      <Link to="/marketplace" className="inline-flex items-center text-gray-400 hover:text-secondary mb-8 transition-colors">
        <ChevronLeft className="w-5 h-5 mr-1" /> Back to Marketplace
      </Link>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <motion.div 
            layoutId={`product-image-${id}`}
            className="aspect-[4/5] glass-card overflow-hidden rounded-3xl relative"
          >
            <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
            
            <div className="absolute top-4 right-4 flex flex-col space-y-2">
              <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-3 rounded-full backdrop-blur-md transition-all ${isWishlisted ? 'bg-primary text-white' : 'bg-navy-900/40 text-white hover:text-primary'}`}
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button className="p-3 bg-navy-900/40 backdrop-blur-md rounded-full text-white hover:text-secondary transition-all">
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </motion.div>

          <div className="flex space-x-4">
            {product.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-secondary' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center space-x-2 text-secondary font-bold mb-4">
              <span className="bg-secondary/10 px-3 py-1 rounded-full text-sm">{product.category}</span>
              <span className="text-gray-600">•</span>
              <span className="flex items-center">
                <Star className="w-4 h-4 fill-current text-yellow-400 mr-1" /> {product.rating} ({product.reviews} reviews)
              </span>
            </div>
            <h1 className="text-4xl font-extrabold mb-4">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-4xl font-extrabold text-white">₹{product.price}</span>
              <span className="text-xl text-gray-500 line-through">₹{product.oldPrice}</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 font-bold rounded-lg text-sm">
                {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
              </span>
            </div>
          </div>

          {/* Seller Card */}
          <div className="glass-card p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full border-2 border-secondary overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${product.seller.name}`} alt="seller" />
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <p className="font-bold text-lg">{product.seller.name}</p>
                  {product.seller.isVerified && <ShieldCheck className="w-4 h-4 text-secondary" />}
                </div>
                <div className="flex items-center text-xs text-gray-400">
                  <MapPin className="w-3 h-3 mr-1" /> {product.college}
                </div>
              </div>
            </div>
            <Link to={`/seller/${product.seller.name}`} className="text-secondary font-bold hover:underline">View Profile</Link>
          </div>

          <p className="text-gray-400 leading-relaxed text-lg">
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-4">
            {product.specs.map((spec, idx) => (
              <div key={idx} className="p-4 bg-white/5 rounded-2xl">
                <p className="text-xs text-gray-500 uppercase font-bold">{spec.label}</p>
                <p className="font-bold">{spec.value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button 
              onClick={() => toast.success('Added to cart!')}
              className="flex-1 py-4 glass-card border-secondary/30 text-secondary font-bold flex items-center justify-center space-x-2 hover:bg-secondary/10 transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>
            <button className="flex-1 py-4 bg-gradient-to-r from-primary to-primary-light rounded-2xl font-extrabold flex items-center justify-center space-x-2 hover:shadow-[0_0_30px_rgba(255,0,122,0.4)] transition-all">
              <span>Buy Now</span>
            </button>
            <button className="p-4 glass-card hover:bg-white/10 text-white transition-all flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 pt-8">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                <Check className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-bold text-gray-500 uppercase">Secure Payment</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Check className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-bold text-gray-500 uppercase">Campus Verified</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Check className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-bold text-gray-500 uppercase">Hand-to-Hand</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
