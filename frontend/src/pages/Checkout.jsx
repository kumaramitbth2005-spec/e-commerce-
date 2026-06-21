import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, CreditCard, Truck, CheckCircle2, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: 'Aditya Sharma',
    phone: '9876543210',
    address: 'Hostel 12, Room 405',
    pincode: '400076',
    college: 'IIT Bombay',
    paymentMethod: 'upi'
  });

  const handlePlaceOrder = () => {
    toast.success('Order placed successfully!');
    setStep(3);
    setTimeout(() => {
        navigate('/settings#orders');
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
      {/* Steps Header */}
      <div className="flex items-center justify-center mb-12 space-x-4">
        <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-secondary' : 'text-gray-600'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-secondary text-navy-900' : 'bg-white/5 border border-white/10'}`}>1</div>
          <span className="font-bold hidden sm:inline">Address</span>
        </div>
        <div className="w-12 h-px bg-white/10"></div>
        <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-secondary' : 'text-gray-600'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-secondary text-navy-900' : 'bg-white/5 border border-white/10'}`}>2</div>
          <span className="font-bold hidden sm:inline">Payment</span>
        </div>
        <div className="w-12 h-px bg-white/10"></div>
        <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-green-400' : 'text-gray-600'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-green-500 text-navy-900' : 'bg-white/5 border border-white/10'}`}>3</div>
          <span className="font-bold hidden sm:inline">Success</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Main Section */}
        <div className="lg:col-span-2 space-y-8">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-8 flex items-center">
                <MapPin className="w-6 h-6 mr-3 text-secondary" /> Shipping Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-500">Full Name</label>
                  <input type="text" value={formData.name} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-500">Phone Number</label>
                  <input type="text" value={formData.phone} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-gray-500">Hostel Address / Department</label>
                  <input type="text" value={formData.address} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-500">Pin Code</label>
                  <input type="text" value={formData.pincode} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-500">College Name</label>
                  <input type="text" value={formData.college} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none" disabled />
                </div>
              </div>
              <button onClick={() => setStep(2)} className="mt-10 w-full py-4 bg-secondary text-navy-900 font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,242,255,0.3)] transition-all">
                Continue to Payment
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-8 flex items-center">
                <CreditCard className="w-6 h-6 mr-3 text-secondary" /> Payment Method
              </h2>
              <div className="space-y-4">
                {['upi', 'card', 'cod'].map((method) => (
                  <div 
                    key={method}
                    onClick={() => setFormData({...formData, paymentMethod: method})}
                    className={`p-5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${formData.paymentMethod === method ? 'bg-secondary/10 border-secondary' : 'bg-white/5 border-white/10'}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === method ? 'border-secondary' : 'border-gray-600'}`}>
                        {formData.paymentMethod === method && <div className="w-3 h-3 bg-secondary rounded-full"></div>}
                      </div>
                      <span className="font-bold uppercase">{method}</span>
                    </div>
                    {method === 'upi' && <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" className="h-4 grayscale invert" alt="UPI" />}
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-blue-500/10 rounded-xl flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-blue-400 mt-0.5" />
                <p className="text-sm text-blue-200">Your payment is secured with Razorpay. Funds will only be released to the seller after your confirmation of pickup.</p>
              </div>

              <button onClick={handlePlaceOrder} className="mt-10 w-full py-4 bg-gradient-to-r from-primary to-primary-light text-white font-bold rounded-xl shadow-[0_0_30px_rgba(255,0,122,0.3)] transition-all">
                Pay ₹1220 & Place Order
              </button>
              <button onClick={() => setStep(1)} className="mt-4 w-full text-gray-500 text-sm hover:underline">
                Back to Address
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12 text-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 text-green-400">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-4xl font-extrabold mb-4 text-white">Order Confirmed!</h2>
              <p className="text-gray-400 mb-8 text-lg">Your order #EDU-9921 has been successfully placed. <br /> You can track it in your order history.</p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
                <Link to="/settings#orders" className="px-8 py-3 bg-white text-navy-900 rounded-xl font-bold">Go to My Orders</Link>
                <Link to="/marketplace" className="px-8 py-3 glass-card text-white rounded-xl font-bold">Continue Shopping</Link>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="font-bold mb-6 text-lg border-b border-white/10 pb-4">Order Summary</h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-4">
                <img src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100" className="w-12 h-16 rounded-lg object-cover" alt="book" />
                <div className="flex-grow">
                  <p className="text-sm font-bold line-clamp-1">Engineering Mechanics</p>
                  <p className="text-xs text-gray-500">Qty: 1</p>
                </div>
                <p className="font-bold">₹350</p>
              </div>
              <div className="flex items-center space-x-4">
                <img src="https://images.unsplash.com/photo-1518118014377-ce94f3ba3734?w=100" className="w-12 h-16 rounded-lg object-cover" alt="calc" />
                <div className="flex-grow">
                  <p className="text-sm font-bold line-clamp-1">Casio FX-991EX</p>
                  <p className="text-xs text-gray-500">Qty: 1</p>
                </div>
                <p className="font-bold">₹850</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400"><span>Items Total</span><span className="text-white">₹1200</span></div>
              <div className="flex justify-between text-gray-400"><span>Platform Fee</span><span className="text-white">₹20</span></div>
              <div className="h-px bg-white/10 my-4"></div>
              <div className="flex justify-between text-xl font-extrabold text-secondary"><span>Total</span><span>₹1220</span></div>
            </div>
          </div>
          
          <div className="p-6 glass-card border-green-500/20 flex items-center space-x-4">
             <Truck className="w-10 h-10 text-green-400" />
             <div>
                <p className="font-bold">Campus Delivery</p>
                <p className="text-xs text-gray-400">Usually delivered within 2-4 hours at your chosen spot.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
