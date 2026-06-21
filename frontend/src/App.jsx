import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './context/AuthContext';

// Layout
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import SellProduct from './pages/SellProduct';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Settings from './pages/Settings';
import About from './pages/About';

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <Router>
      <AuthProvider>
        <div className="flex min-h-screen bg-navy-900 overflow-x-hidden">
          {/* Sidebar for Desktop */}
          <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
          
          {/* Spacer for fixed sidebar */}
          <div className={`hidden md:block flex-shrink-0 transition-all duration-300 ${isSidebarCollapsed ? 'w-[72px]' : 'w-60'}`} />
          
          {/* Main Content Area */}
          <div className="flex flex-col flex-1 min-h-screen min-w-0">
            <Navbar isSidebarCollapsed={isSidebarCollapsed} />
            
            {/* Main Router Content — pt-16 matches navbar h-16 */}
            <main className="flex-grow pt-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/sell" element={<SellProduct />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </main>
            
            <Footer />
          </div>
          
          <ToastContainer position="bottom-right" theme="dark" />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
