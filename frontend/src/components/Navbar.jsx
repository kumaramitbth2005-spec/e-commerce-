import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Menu, X, LogOut, Heart, ShoppingCart, ShoppingBag, PlusCircle, Home, LayoutDashboard, Loader2, LogIn, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const Navbar = ({ isSidebarCollapsed }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // All searchable static pages
  const staticPages = [
    { id: 'p1', name: 'Home', type: 'page', path: '/', icon: '🏠' },
    { id: 'p2', name: 'Marketplace', type: 'page', path: '/marketplace', icon: '🛒' },
    { id: 'p3', name: 'Sell Resource', type: 'page', path: '/sell', icon: '📦' },
    { id: 'p4', name: 'My Cart', type: 'page', path: '/cart', icon: '🛍️' },
    { id: 'p5', name: 'My Listings', type: 'page', path: '/settings#listings', icon: '📋' },
    { id: 'p6', name: 'Settings', type: 'page', path: '/settings', icon: '⚙️' },
    { id: 'p7', name: 'About Us', type: 'page', path: '/about', icon: 'ℹ️' },
    { id: 'p8', name: 'Wishlist', type: 'page', path: '/wishlist', icon: '❤️' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(async () => {
      const q = searchQuery.toLowerCase();
      
      // Filter pages locally
      const matchedPages = staticPages.filter(page =>
        page.name.toLowerCase().includes(q)
      );

      try {
        // Fetch matching products from backend API
        const response = await API.get('/products', { params: { search: searchQuery } });
        const backendProducts = response.data.map(prod => ({
          id: prod._id,
          name: prod.name,
          type: 'product',
          price: `₹${prod.price}`,
          category: prod.category,
          image: prod.images?.[0] || 'https://via.placeholder.com/100',
          path: `/product/${prod._id}`
        }));

        const results = [...matchedPages, ...backendProducts];
        setSearchResults(results.slice(0, 8));
        setShowResults(true);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResults(matchedPages.slice(0, 8));
        setShowResults(true);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleResultClick = (item) => {
    setShowResults(false);
    setSearchQuery('');
    if (item.type === 'page') {
      navigate(item.path);
    } else {
      navigate(`/product/${item.id}`);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowResults(false);
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const sidebarWidth = isSidebarCollapsed ? '72px' : '15rem';

  return (
    <nav 
      className={`fixed top-0 right-0 z-40 h-16 flex items-center transition-all duration-300 ${
        isScrolled 
          ? 'bg-navy-900/80 backdrop-blur-2xl border-b border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.3)]' 
          : 'bg-navy-900/60 backdrop-blur-xl border-b border-white/[0.03]'
      }`}
      style={{ width: `calc(100% - ${sidebarWidth})` }}
    >
      <div className="w-full px-4 md:px-6 flex items-center justify-between">
        
        {/* Mobile Logo */}
        <Link to="/" className="md:hidden flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center font-bold text-lg text-white">
            E
          </div>
        </Link>

        {/* Search Bar */}
        <div className="flex-grow max-w-xl mx-4 lg:mx-8 relative" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim() && setShowResults(true)}
              placeholder="Search books, tools, notes, pages..." 
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/30 transition-all text-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            {isSearching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary animate-spin" />}
          </form>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {showResults && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                className="absolute top-full mt-2 w-full bg-navy-900/95 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-50"
              >
                <div className="p-3 border-b border-white/5">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold px-2">
                    {searchResults.length} results for "{searchQuery}"
                  </p>
                </div>
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  {searchResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleResultClick(item)}
                      className="flex items-center space-x-4 p-3 mx-2 my-1 rounded-xl cursor-pointer hover:bg-white/5 transition-all group"
                    >
                      {item.type === 'product' ? (
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-lg flex-shrink-0">
                          {item.icon}
                        </div>
                      )}
                      <div className="flex-grow min-w-0">
                        <p className="font-semibold text-sm group-hover:text-secondary transition-colors truncate">{item.name}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                          {item.type === 'product' ? item.category : 'Page'}
                          {item.price && <span className="ml-2 text-primary">{item.price}</span>}
                        </p>
                      </div>
                      <Search className="w-3.5 h-3.5 text-gray-600 group-hover:text-white transition-colors" />
                    </div>
                  ))}
                </div>
                <div 
                  onClick={handleSearchSubmit}
                  className="p-3 border-t border-white/5 text-center text-xs text-secondary font-bold cursor-pointer hover:bg-secondary/5 transition-all"
                >
                  View all results for "{searchQuery}" →
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile / Login */}
        <div className="hidden md:flex items-center space-x-3">
          {isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-10 h-10 rounded-full border-2 border-white/10 overflow-hidden hover:border-secondary/50 transition-all"
              >
                <img src={user?.profilePhoto ? (user.profilePhoto.startsWith('http') ? user.profilePhoto : `http://localhost:5000${user.profilePhoto}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'user'}`} alt="profile" className="w-full h-full object-cover" />
              </button>
              
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-52 rounded-2xl overflow-hidden bg-navy-900/95 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
                  >
                    <div className="p-4 bg-white/[0.02]">
                      <p className="font-bold text-white text-sm">{user?.name}</p>
                      <p className="text-[11px] text-gray-500">{user?.email}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-primary-light rounded-xl text-sm font-semibold hover:shadow-[0_0_15px_rgba(255,0,122,0.3)] transition-all">
              <LogIn className="w-4 h-4" /><span>Login</span>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 bg-white/5 rounded-lg border border-white/10" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-navy-900/95 backdrop-blur-3xl border-b border-white/10 overflow-hidden absolute top-full w-full"
          >
            <div className="px-4 py-6 space-y-2">
              <Link to="/" className="flex items-center space-x-3 p-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
                <Home className="w-5 h-5 text-gray-400" /><span>Home</span>
              </Link>
              <Link to="/marketplace" className="flex items-center space-x-3 p-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
                <ShoppingBag className="w-5 h-5 text-secondary" /><span>Marketplace</span>
              </Link>
              <Link to="/sell" className="flex items-center space-x-3 p-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
                <PlusCircle className="w-5 h-5 text-primary" /><span>Sell Product</span>
              </Link>
              <Link to="/settings#listings" className="flex items-center space-x-3 p-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
                <List className="w-5 h-5 text-purple-400" /><span>My Listings</span>
              </Link>
              <div className="flex space-x-4 pt-4 mt-2 border-t border-white/10">
                <Link to="/wishlist" className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors" onClick={() => setIsMobileMenuOpen(false)}><Heart className="w-5 h-5 text-pink-500"/></Link>
                <Link to="/cart" className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors" onClick={() => setIsMobileMenuOpen(false)}><ShoppingCart className="w-5 h-5 text-blue-400"/></Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
