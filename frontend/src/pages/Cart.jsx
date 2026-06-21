import React, { useState } from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([
    { id: 1, name: "Engineering Mechanics", price: 350, image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200", quantity: 1 },
    { id: 2, name: "Casio FX-991EX", price: 850, image: "https://images.unsplash.com/photo-1518118014377-ce94f3ba3734?w=200", quantity: 1 }
  ]);

  const updateQuantity = (id, delta) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const serviceFee = 20;
  const total = subtotal + serviceFee;

  if (items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-20 text-center">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShoppingBag className="w-12 h-12 text-gray-600" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-400 mb-10">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/marketplace" className="px-8 py-4 bg-primary rounded-xl font-bold hover:bg-primary-light transition-all">
          Explore Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-4xl font-extrabold mb-10">My Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-card p-6 flex items-center space-x-6"
              >
                <div className="w-24 h-32 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-xl font-bold">{item.name}</h3>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center bg-white/5 rounded-lg border border-white/10 p-1">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1.5 hover:bg-white/5 rounded-md transition-all"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1.5 hover:bg-white/5 rounded-md transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-gray-500 text-sm">x ₹{item.price}</span>
                    </div>
                    <span className="text-xl font-extrabold text-secondary">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <div className="glass-card p-8 sticky top-28">
            <h3 className="text-2xl font-bold mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white font-medium">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Service Fee</span>
                <span className="text-white font-medium">₹{serviceFee}</span>
              </div>
              <div className="h-px bg-white/10 my-4"></div>
              <div className="flex justify-between text-xl font-extrabold">
                <span>Total</span>
                <span className="text-secondary">₹{total}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-gradient-to-r from-primary to-primary-light rounded-xl font-extrabold flex items-center justify-center space-x-2 hover:shadow-[0_0_20px_rgba(255,0,122,0.3)] transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <div className="mt-6 flex items-center justify-center space-x-4 opacity-50 grayscale">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="PayPal" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Visa.svg" className="h-4" alt="Visa" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" alt="Mastercard" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
