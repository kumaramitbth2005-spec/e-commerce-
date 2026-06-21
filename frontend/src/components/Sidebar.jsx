import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, ShoppingBag, PlusCircle, ShoppingCart, Heart, LogOut, Settings, Truck, ChevronDown, ChevronLeft, ChevronRight as ChevronRightIcon, User, Bell, Shield, Info, Moon, Sun, Globe, List, Package, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const currentPath = location.pathname;
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved !== null) {
      return saved === 'dark';
    }
    return true; // Default to dark
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const menuItems = [
    { path: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { path: '/marketplace', label: 'Marketplace', icon: <ShoppingBag className="w-5 h-5" /> },
    { path: '/sell', label: 'Sell Resource', icon: <PlusCircle className="w-5 h-5" /> },
    { path: '/cart', label: 'My Cart', icon: <ShoppingCart className="w-5 h-5" /> },
    { path: '/wishlist', label: 'Wishlist', icon: <Heart className="w-5 h-5" /> },
    { path: '/about', label: 'About Us', icon: <Info className="w-5 h-5" /> },
  ];

  const settingSubItems = [
    { path: '/settings#listings', label: 'My Listings', icon: <List className="w-4 h-4" /> },
    { path: '/settings#orders', label: 'My Orders', icon: <Package className="w-4 h-4" /> },
    { path: '/settings#tracking', label: 'Track Parcel', icon: <Truck className="w-4 h-4" /> },
    { path: '/settings#messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4" /> },
    { path: '/settings#profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
    { path: '/settings#notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { path: '/settings#security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { path: '/settings#language', label: 'Language', icon: <Globe className="w-4 h-4" /> },
    { action: toggleTheme, label: isDarkMode ? 'Light Mode' : 'Dark Mode', icon: isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" /> },
  ];

  return (
    <aside 
      className={`hidden md:flex flex-col h-screen fixed top-0 left-0 z-50 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-[72px]' : 'w-60'
      }`}
      style={{
        background: 'linear-gradient(180deg, rgba(10,10,18,0.98) 0%, rgba(5,5,12,0.99) 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo Header — same height as navbar */}
      <div className="relative h-16 flex items-center border-b border-white/5 flex-shrink-0">
        <div className={`flex items-center w-full ${isCollapsed ? 'justify-center px-2' : 'px-5'}`}>
          <Link to="/" className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 bg-gradient-to-tr from-primary to-secondary rounded-xl flex items-center justify-center font-extrabold text-lg shadow-[0_0_15px_rgba(255,0,122,0.3)] flex-shrink-0 text-white">
              E
            </div>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 whitespace-nowrap truncate"
              >
                Edu-स्त्रोत
              </motion.span>
            )}
          </Link>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-navy-800 border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary/30 hover:border-primary/50 transition-all z-[60] shadow-lg"
        >
          {isCollapsed ? <ChevronRightIcon className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto custom-scrollbar overflow-x-hidden">
        {!isCollapsed && (
          <p className="px-3 text-[10px] font-bold text-gray-600 uppercase tracking-[0.15em] mb-3">Menu</p>
        )}
        
        {menuItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <div key={item.path} className="relative">
              <Link 
                to={item.path}
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`flex items-center rounded-xl transition-all duration-200 group relative ${
                  isCollapsed ? 'justify-center p-2.5 mx-1' : 'space-x-3 px-3 py-2'
                } ${
                  isActive 
                  ? 'bg-secondary/10 text-secondary font-semibold' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-secondary rounded-r-full shadow-[0_0_8px_rgba(0,242,255,0.5)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <div className={`flex-shrink-0 ${isActive ? 'text-secondary' : 'text-gray-500 group-hover:text-white'} transition-colors`}>
                  {item.icon}
                </div>

                {!isCollapsed && (
                  <span className="text-[13px]">{item.label}</span>
                )}
              </Link>

              {/* Tooltip */}
              {isCollapsed && hoveredItem === item.path && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-navy-800 border border-white/10 rounded-lg text-xs font-semibold text-white whitespace-nowrap z-[60] shadow-xl pointer-events-none">
                  {item.label}
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-navy-800 border-l border-b border-white/10 rotate-45"></div>
                </div>
              )}
            </div>
          );
        })}

        {/* Settings Section — Expanded */}
        {!isCollapsed && (
          <div className="pt-3 mt-3 border-t border-white/5">
            <p className="px-3 text-[10px] font-bold text-gray-600 uppercase tracking-[0.15em] mb-2">Preferences</p>
            <button 
              onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 group ${
                isSettingsExpanded || currentPath.includes('settings')
                ? 'text-white bg-white/5' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Settings className={`w-5 h-5 ${isSettingsExpanded ? 'text-primary' : 'text-gray-500'} transition-colors`} />
                <span className="text-[13px]">Settings</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isSettingsExpanded ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isSettingsExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden ml-3 mt-1 space-y-0.5 border-l border-white/5 pl-2"
                >
                  {settingSubItems.map((subItem, index) => {
                    if (subItem.action) {
                      return (
                        <button 
                          key={index}
                          onClick={subItem.action}
                          className="w-full flex items-center space-x-3 px-3 py-1.5 rounded-lg text-xs transition-all duration-200 text-gray-500 hover:text-gray-300 hover:bg-white/5"
                        >
                          {subItem.icon}
                          <span>{subItem.label}</span>
                        </button>
                      );
                    }

                    const isSubActive = (currentPath + location.hash) === subItem.path || (currentPath === subItem.path && !subItem.path.includes('#'));
                    return (
                      <Link 
                        key={subItem.path}
                        to={subItem.path}
                        className={`flex items-center space-x-3 px-3 py-1.5 rounded-lg text-xs transition-all duration-200 ${
                          isSubActive 
                          ? 'text-secondary font-semibold bg-secondary/5' 
                          : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                        }`}
                      >
                        {subItem.icon}
                        <span>{subItem.label}</span>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Collapsed settings icon */}
        {isCollapsed && (
          <div className="relative pt-3 mt-3 border-t border-white/5">
            <Link 
              to="/settings"
              onMouseEnter={() => setHoveredItem('settings')}
              onMouseLeave={() => setHoveredItem(null)}
              className={`flex items-center justify-center p-2.5 mx-1 rounded-xl transition-all ${
                currentPath.includes('settings') 
                ? 'bg-secondary/10 text-secondary' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Settings className="w-5 h-5" />
            </Link>
            {hoveredItem === 'settings' && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-navy-800 border border-white/10 rounded-lg text-xs font-semibold text-white whitespace-nowrap z-[60] shadow-xl pointer-events-none">
                Settings
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-navy-800 border-l border-b border-white/10 rotate-45"></div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Logout */}
      <div className={`border-t border-white/5 ${isCollapsed ? 'p-2' : 'px-3 py-3'}`}>
        <button onClick={() => { logout(); navigate('/login'); }} className={`flex items-center text-gray-400 hover:text-red-400 transition-colors w-full hover:bg-red-500/10 rounded-xl group ${
          isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
        }`}>
          <LogOut className="w-5 h-5 text-gray-500 group-hover:text-red-400 transition-colors flex-shrink-0" />
          {!isCollapsed && <span className="font-medium text-[13px]">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
