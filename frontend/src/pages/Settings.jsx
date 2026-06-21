import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Shield, CreditCard, ChevronRight, Globe, Moon, Sun, LogOut, Truck, List, Package, MessageSquare, TrendingUp, Star, Activity, Edit, Trash2, ArrowUpRight, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Profile from './Profile';

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = React.useState(null);

  useEffect(() => {
    if (location.hash) {
      const hash = location.hash.replace('#', '');
      setActiveSection(hash);
    } else {
      setActiveSection('profile');
      navigate('/settings#profile', { replace: true });
    }
  }, [location.hash, navigate]);

  const settingSections = [
    {
      id: 'listings',
      title: 'My Listings',
      icon: <List className="w-6 h-6 text-primary" />,
      description: 'Manage your active marketplace listings',
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6 bg-white/5 p-4 rounded-xl">
            <h2 className="text-xl font-bold flex items-center"><List className="w-5 h-5 mr-2 text-primary"/> Active Listings</h2>
            <div className="flex items-center space-x-2 text-sm text-green-400 bg-green-400/10 px-3 py-1.5 rounded-full font-medium">
               <TrendingUp className="w-4 h-4" />
               <span>+24% views this week</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <motion.div 
                whileHover={{ scale: 1.01 }}
                key={i} 
                className="glass-card p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between group hover:border-secondary/50 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center space-x-4 sm:space-x-6 w-full sm:w-auto mb-4 sm:mb-0">
                  <div className="w-20 h-24 sm:w-24 sm:h-24 bg-white/5 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                    <img src={`https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&q=80`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="item" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] uppercase font-bold rounded">Book</span>
                      <span className="flex items-center text-xs text-gray-400"><Star className="w-3 h-3 text-yellow-500 fill-current mr-1"/> 4.8</span>
                    </div>
                    <h4 className="font-bold text-lg sm:text-xl group-hover:text-secondary transition-colors text-white">Thomas Calculus Book {i}</h4>
                    <p className="text-xl font-extrabold text-white mt-1">₹{300 + i * 50}</p>
                    <p className="text-xs text-gray-500 mt-2 flex items-center">Listed 12 Apr 2024 <span className="mx-2">•</span> <Activity className="w-3 h-3 mr-1"/> 45 Views</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                  <button className="p-3 bg-white/5 rounded-xl hover:bg-secondary/20 hover:text-secondary text-gray-300 transition-all shadow-sm"><Edit className="w-5 h-5" /></button>
                  <button className="p-3 bg-red-500/10 rounded-xl hover:bg-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] text-red-500 transition-all"><Trash2 className="w-5 h-5" /></button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'orders',
      title: 'My Orders',
      icon: <Package className="w-6 h-6 text-purple-400" />,
      description: 'View your purchase history and orders',
      content: (
        <div className="text-center py-20 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] -z-10"></div>
          <Package className="w-20 h-20 text-gray-600 mx-auto mb-6 opacity-50" />
          <h3 className="text-2xl font-bold mb-3 text-white">No Recent Orders</h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">You haven't purchased anything yet. Explore the marketplace to find great deals on academic resources.</p>
          <button className="px-8 py-3 bg-gradient-to-r from-secondary to-blue-500 text-navy-900 font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all transform hover:-translate-y-1 flex items-center justify-center mx-auto">
            Go Shopping <ArrowUpRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      )
    },
    {
      id: 'tracking',
      title: 'Track Parcel',
      icon: <Truck className="w-6 h-6 text-secondary" />,
      description: 'Monitor your academic resources in real-time',
      content: (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
            <div>
              <p className="text-gray-400 text-sm">Monitor your academic resources in real-time</p>
            </div>
            <div className="px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary text-xs font-bold uppercase tracking-wider w-fit">
              4 Active Deliveries
            </div>
          </div>
          
          <div className="relative mb-12">
            <input 
              type="text" 
              placeholder="Enter Tracking ID (e.g. EDU-7829-X)" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 pl-14 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all font-mono text-white placeholder:text-gray-600" 
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-secondary text-navy-900 px-6 py-2.5 rounded-xl font-bold hover:bg-white transition-all shadow-lg">Track</button>
          </div>

          <div className="space-y-10 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
            {[
              { status: 'Delivered', time: 'Today, 2:30 PM', desc: 'Package delivered at Central Library Gate', completed: true, active: true },
              { status: 'Out for Delivery', time: 'Today, 10:00 AM', desc: 'Delivery partner is near Boys Hostel 7', completed: true, active: false },
              { status: 'In Transit', time: 'Yesterday, 4:15 PM', desc: 'Package left the Campus Hub', completed: true, active: false },
              { status: 'Order Confirmed', time: '12 Apr, 11:00 AM', desc: 'Seller has accepted the request', completed: true, active: false },
            ].map((step, i) => (
              <div key={i} className="flex items-start space-x-8 pl-1 relative group">
                <div className={`w-8 h-8 rounded-full border-4 border-navy-900 z-10 flex items-center justify-center transition-all duration-500 ${step.completed ? 'bg-secondary' : 'bg-gray-800'} ${step.active ? 'scale-125 shadow-[0_0_15px_rgba(0,242,255,0.5)]' : ''}`}>
                  {step.completed && <div className="w-2 h-2 bg-navy-900 rounded-full"></div>}
                </div>
                <div className={`transition-all duration-500 ${step.active ? 'translate-x-2' : ''}`}>
                  <p className={`font-bold text-lg ${step.completed ? 'text-white' : 'text-gray-600'}`}>{step.status}</p>
                  <p className="text-[10px] uppercase font-black tracking-widest text-secondary mb-1">{step.time}</p>
                  <p className="text-sm text-gray-400 max-w-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'messages',
      title: 'Messages',
      icon: <MessageSquare className="w-6 h-6 text-yellow-400" />,
      description: 'Chat with resource sellers and buyers',
      content: (
        <div className="overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center rounded-t-xl">
            <h3 className="font-bold flex items-center text-white"><MessageSquare className="w-5 h-5 mr-2 text-primary"/> Conversations</h3>
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-bold">2 Unread</span>
          </div>
          <div className="divide-y divide-white/10">
            {[1, 2, 3].map((m) => (
              <div key={m} className={`p-6 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-all group ${m === 1 ? 'bg-primary/5' : ''}`}>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-primary transition-colors">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=User${m+5}`} alt="user" className="w-full h-full object-cover bg-navy-800" />
                    </div>
                    {m === 1 && <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-navy-900 rounded-full"></div>}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-bold text-lg group-hover:text-primary transition-colors text-white">{m === 1 ? 'Priya Singh' : 'Rahul Verma'}</p>
                      {m === 1 && <span className="w-2 h-2 rounded-full bg-primary"></span>}
                    </div>
                    <p className={`text-sm line-clamp-1 mt-0.5 ${m === 1 ? 'text-white font-medium' : 'text-gray-400'}`}>
                      {m === 1 ? "Yes, I can meet at the library tomorrow." : "Is the Drafter still available for exchange?"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className="text-xs text-gray-500 font-medium">{m === 1 ? 'Just now' : '2h ago'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'profile',
      title: 'Profile Settings',
      icon: <User className="w-6 h-6 text-secondary" />,
      description: 'Update your campus info, avatar and bio',
      content: <Profile isInsideSettings={true} />
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <Bell className="w-6 h-6 text-primary" />,
      description: 'Choose what alerts you want to receive',
      content: (
        <div className="space-y-4">
          {['Email Notifications', 'Push Alerts', 'SMS Alerts', 'New Listings Alerts'].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 glass-card">
              <span className="font-medium">{item}</span>
              <div className="w-12 h-6 bg-primary/20 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-primary rounded-full shadow-lg"></div>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'security',
      title: 'Security',
      icon: <Shield className="w-6 h-6 text-green-400" />,
      description: 'Manage passwords and account security',
      content: (
        <div className="space-y-6">
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">Two-factor authentication is active.</div>
          <button className="w-full py-4 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-colors">Change Password</button>
          <button className="w-full py-4 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-colors">Manage Devices</button>
        </div>
      )
    },
    {
      id: 'language',
      title: 'Language Preferences',
      icon: <Globe className="w-6 h-6 text-blue-400" />,
      description: 'Choose your preferred language',
      content: (
        <div className="grid grid-cols-1 gap-3">
          {['English', 'Hindi (हिंदी)', 'Tamil (தமிழ்)', 'Punjabi (ਪੰਜਾਬੀ)', 'Marathi (मराठी)', 'Gujarati (ગુજરાતી)', 'Bengali (বাংলা)', 'Telugu (తెలుగు)'].map((lang, i) => (
            <div key={i} className={`p-5 glass-card flex items-center justify-between cursor-pointer border-transparent hover:border-blue-400/50 transition-all ${i === 0 ? 'border-blue-400 bg-blue-400/5' : ''}`}>
              <span className="font-bold">{lang}</span>
              {i === 0 && <div className="w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>}
            </div>
          ))}
        </div>
      )
    }
  ];

  const activeSectionData = settingSections.find(s => s.id === activeSection) || settingSections.find(s => s.id === 'profile');

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 md:px-8 min-h-[70vh]">
      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeSectionData?.id || 'detail'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="glass-card p-6 md:p-10">
            <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-white/5">
              <div className="p-4 bg-white/5 rounded-2xl flex-shrink-0">
                {activeSectionData?.icon}
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">{activeSectionData?.title}</h2>
                <p className="text-gray-400 text-sm">{activeSectionData?.description}</p>
              </div>
            </div>
            
            <div>
              {activeSectionData?.content}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Settings;
