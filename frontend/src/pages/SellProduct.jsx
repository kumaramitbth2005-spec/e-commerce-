import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, Tag, IndianRupee, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const SellProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    condition: 'Good',
    description: '',
    isAvailableForRent: false,
    rentPrice: '',
    isAvailableForExchange: false,
    exchangePreferences: '',
    isAuction: false,
    auctionEndTime: ''
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newPreviews]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price) {
      return toast.error('Please fill in all required fields');
    }
    setIsSubmitting(true);
    try {
      const productData = {
        ...formData,
        images: previewImages.length > 0 ? previewImages : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500']
      };
      await API.post('/products', productData);
      toast.success('Product listed successfully! 🎉');
      navigate('/marketplace');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post listing. Please login first.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold mb-4">Sell Your Resource</h1>
        <p className="text-gray-400">Fill in the details to reach thousands of students in your campus.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center space-x-2 text-secondary font-bold mb-2">
            <Info className="w-5 h-5" />
            <span>Basic Information</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Product Name</label>
              <input 
                type="text" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                placeholder="e.g. Thomas Calculus 14th Edition"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Category</label>
              <select 
                className="w-full bg-navy-800 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="">Select Category</option>
                <option value="Engineering">Engineering</option>
                <option value="Medical">Medical</option>
                <option value="Notes">Notes</option>
                <option value="Tools">Tools</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Description</label>
            <textarea 
              rows="4"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
              placeholder="Tell more about the condition, usage, and why you are selling..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>
        </div>

        {/* Pricing & Modes */}
        <div className="glass-card p-8 space-y-8">
          <div className="flex items-center space-x-2 text-primary font-bold mb-2">
            <Tag className="w-5 h-5" />
            <span>Pricing & Availability</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-400">Selling Price (₹)</label>
                <button 
                  type="button"
                  onClick={() => {
                    if(!formData.name) return toast.info('Please enter product name first');
                    const suggested = Math.floor(Math.random() * (500 - 200) + 200);
                    setFormData({...formData, price: suggested});
                    toast.success(`AI suggests: ₹${suggested} based on market demand`);
                  }}
                  className="text-[10px] bg-secondary/20 text-secondary px-2 py-1 rounded-full font-bold hover:bg-secondary/30 transition-all"
                >
                  ✨ AI Suggest
                </button>
              </div>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="number" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-400">Condition</label>
              <div className="flex space-x-2">
                {['New', 'Good', 'Fair'].map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setFormData({...formData, condition: cond})}
                    className={`flex-1 py-2 rounded-xl border transition-all ${
                      formData.condition === cond 
                      ? 'bg-secondary/20 border-secondary text-secondary font-bold' 
                      : 'bg-white/5 border-white/10 text-gray-400'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Rent Toggle */}
            <div className={`p-4 rounded-2xl border transition-all cursor-pointer ${formData.isAvailableForRent ? 'bg-secondary/10 border-secondary' : 'bg-white/5 border-white/10'}`}
                 onClick={() => setFormData({...formData, isAvailableForRent: !formData.isAvailableForRent})}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold">Rentable</span>
                {formData.isAvailableForRent ? <CheckCircle2 className="w-5 h-5 text-secondary" /> : <div className="w-5 h-5 rounded-full border border-white/20"></div>}
              </div>
              <p className="text-xs text-gray-400">Allow others to rent this resource.</p>
            </div>

            {/* Exchange Toggle */}
            <div className={`p-4 rounded-2xl border transition-all cursor-pointer ${formData.isAvailableForExchange ? 'bg-primary/10 border-primary' : 'bg-white/5 border-white/10'}`}
                 onClick={() => setFormData({...formData, isAvailableForExchange: !formData.isAvailableForExchange})}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold">Exchange</span>
                {formData.isAvailableForExchange ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <div className="w-5 h-5 rounded-full border border-white/20"></div>}
              </div>
              <p className="text-xs text-gray-400">Willing to swap with other items.</p>
            </div>

            {/* Auction Toggle */}
            <div className={`p-4 rounded-2xl border transition-all cursor-pointer ${formData.isAuction ? 'bg-yellow-500/10 border-yellow-500' : 'bg-white/5 border-white/10'}`}
                 onClick={() => setFormData({...formData, isAuction: !formData.isAuction})}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold">Auction</span>
                {formData.isAuction ? <CheckCircle2 className="w-5 h-5 text-yellow-500" /> : <div className="w-5 h-5 rounded-full border border-white/20"></div>}
              </div>
              <p className="text-xs text-gray-400">Put it up for the highest bidder.</p>
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="glass-card p-8">
          <div className="flex items-center space-x-2 text-green-400 font-bold mb-6">
            <Camera className="w-5 h-5" />
            <span>Product Images</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {previewImages.map((src, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                <img src={src} alt="preview" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    setPreviewImages(previewImages.filter((_, i) => i !== idx));
                    setImages(images.filter((_, i) => i !== idx));
                  }}
                >
                  <AlertCircle className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {previewImages.length < 4 && (
              <label className="aspect-square rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-secondary transition-all">
                <Upload className="w-8 h-8 text-gray-500 mb-2" />
                <span className="text-xs text-gray-500 text-center px-2">Upload Photo</span>
                <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            )}
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-5 bg-gradient-to-r from-primary to-secondary rounded-2xl font-extrabold text-xl hover:shadow-[0_0_40px_rgba(0,242,255,0.3)] transition-all transform hover:-translate-y-1 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Posting...' : 'Post Listing Now'}
        </button>
      </form>
    </div>
  );
};

export default SellProduct;
