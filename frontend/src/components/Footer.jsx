import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, MessageCircle, Camera, Code, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-black border-t border-white/5 pt-20 pb-10 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[300px] bg-gradient-to-b from-primary/10 to-transparent blur-[80px] pointer-events-none"></div>
      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center font-bold text-xl">
                E
              </div>
              <span className="text-2xl font-bold">Edu-स्त्रोत</span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Empowering students to share resources efficiently. Join the movement of sustainable academic exchange within your campus.
            </p>
            <div className="pt-2">
              <div className="flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl w-fit group hover:border-green-500/50 transition-all duration-500 cursor-default">
                <div className="relative">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                  <div className="absolute inset-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-black tracking-widest text-gray-500">Platform Status</span>
                  <span className="text-xs font-bold text-green-400 group-hover:text-green-300 transition-colors">Live & Operational</span>
                </div>
              </div>
            </div>
          </div>



          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-secondary" />
                <span>sharmaak517@gmail.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary" />
                <span>+91 8969401902</span>
              </li>
              <li className="mt-6">
                <p className="text-sm font-bold mb-3">Subscribe to Newsletter</p>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Email" 
                    className="bg-white/5 border border-white/10 rounded-l-lg px-4 py-2 w-full focus:outline-none"
                  />
                  <button className="bg-primary px-4 py-2 rounded-r-lg hover:bg-primary-light transition-colors">
                    Join
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-10 text-center text-gray-500 text-sm">
          <p>© 2026 Edu-स्त्रोत. Made with for Campus Students.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
