import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Repeat, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section — Full width with library background */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/library-bg.png" 
            alt="" 
            className="w-full h-full object-cover"
          />
          {/* Dark overlay with blue-purple gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy-900/75 to-navy-900/50"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-navy-900/30"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full px-6 md:px-12 lg:px-16 grid lg:grid-cols-2 gap-8 items-center">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-6 tracking-tight">
              Unlock{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-primary to-purple-500">
                Value.
              </span>
              <br />
              Share
              <br />
              Knowledge.
            </h1>

            <p className="text-gray-300 text-base md:text-lg max-w-md leading-relaxed mb-10">
              Buy, Sell, Rent or Exchange Academic Books & Tools
              Securely Within Your Campus Community
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/marketplace"
                className="px-7 py-3.5 bg-gradient-to-r from-primary to-primary-light rounded-xl font-bold text-sm flex items-center space-x-2 hover:shadow-[0_0_30px_rgba(255,0,122,0.4)] transition-all transform hover:-translate-y-0.5"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/sell"
                className="px-7 py-3.5 bg-white/10 border border-white/20 rounded-xl font-bold text-sm hover:bg-white/15 transition-all transform hover:-translate-y-0.5 backdrop-blur-sm"
              >
                Sell Your Resource
              </Link>
            </div>
          </motion.div>

          {/* Right — Student Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:flex justify-end"
          >
            <div className="relative">
              <div className="w-[420px] h-[320px] rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                <img 
                  src="/images/students.png" 
                  alt="Students collaborating" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative glow behind image */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl blur-2xl -z-10"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Simple trust strip */}
      <section className="border-t border-white/5 bg-navy-900">
        <div className="px-6 md:px-12 lg:px-16 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="w-11 h-11 bg-blue-500/15 rounded-xl flex items-center justify-center text-blue-400 flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-sm text-white">Campus Verified</p>
                <p className="text-xs text-gray-500">Only verified students can trade</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="w-11 h-11 bg-pink-500/15 rounded-xl flex items-center justify-center text-pink-400 flex-shrink-0">
                <Repeat className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-sm text-white">Rent & Exchange</p>
                <p className="text-xs text-gray-500">Flexible options for every budget</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="w-11 h-11 bg-cyan-500/15 rounded-xl flex items-center justify-center text-cyan-400 flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-sm text-white">Campus Pickup</p>
                <p className="text-xs text-gray-500">Meet at library, canteen or hostel</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
