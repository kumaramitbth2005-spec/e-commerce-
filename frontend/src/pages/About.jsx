import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, Zap, Globe, Mail, Phone } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto py-20 px-4 md:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-20"
      >
        <h1 className="text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-secondary">
          Edu-स्त्रोत
        </h1>
        <p className="text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          The ultimate student-to-student marketplace. Built by students, for students, to make campus life more affordable and sustainable.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 mb-20">
        <motion.div 
          whileHover={{ y: -10 }}
          className="glass-card p-10 bg-white/5 border-white/10"
        >
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 text-primary">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-white">Trust & Safety</h3>
          <p className="text-gray-400 leading-relaxed">
            Every user on Edu-स्त्रोत is verified through their official college email. No random outsiders, no scams—just your campus community.
          </p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -10 }}
          className="glass-card p-10 bg-white/5 border-white/10"
        >
          <div className="w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center mb-6 text-secondary">
            <Zap className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-white">Instant Exchange</h3>
          <p className="text-gray-400 leading-relaxed">
            Need a drafter for a day? Or a calculator for an exam? Rent or exchange items instantly with people in your own hostel or canteen.
          </p>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-20">
        <div className="md:col-span-2 glass-card p-12 bg-gradient-to-br from-primary/5 to-secondary/5 border-white/5 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <h2 className="text-3xl font-bold mb-8 relative z-10 flex items-center">
            <Globe className="w-8 h-8 mr-4 text-secondary animate-pulse" />
            Our Mission
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed relative z-10 mb-12">
            Academic resources shouldn't cost a fortune. Our mission is to reduce financial stress for students by enabling a circular economy within campuses. By sharing books, tools, and notes, we don't just save money—we save the environment.
          </p>
          
          <div className="grid grid-cols-3 gap-8 relative z-10">
            <div className="text-center">
              <p className="text-4xl font-black text-white">50+</p>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Colleges</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-white">10K+</p>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Students</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-white">₹2M+</p>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Saved</p>
            </div>
          </div>
        </div>

        {/* Live Feed from Footer */}
        <div className="glass-card p-8 bg-black/40 border-white/10 flex flex-col">
          <h4 className="text-lg font-bold mb-6 flex items-center space-x-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
            <span>Live Community Activity</span>
          </h4>
          <div className="space-y-4 flex-grow">
            {[
              { type: 'NEW LISTING', item: 'Thomas Calculus', time: '2m ago', color: 'text-secondary' },
              { type: 'SOLD', item: 'Lab Coat - Medium', time: '15m ago', color: 'text-primary' },
              { type: 'NEW USER', item: 'Rahul from DTU', time: '1h ago', color: 'text-green-400' },
              { type: 'AUCTION', item: 'Drafter', time: '3h ago', color: 'text-yellow-400' },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between text-xs border-b border-white/5 pb-3 last:border-0">
                <div className="flex flex-col">
                  <span className={`${log.color} font-black tracking-tighter text-[8px]`}>{log.type}</span>
                  <span className="text-gray-400">{log.item}</span>
                </div>
                <span className="text-gray-600 font-bold">{log.time}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-[10px] font-bold text-green-500/80 uppercase tracking-widest">System Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Details from Footer */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card p-12 bg-white/5 border-white/10 text-center"
      >
        <h2 className="text-3xl font-bold mb-10">Get in Touch</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-12">
          <div className="flex flex-col items-center">
            <div className="p-4 bg-secondary/10 rounded-full mb-4 text-secondary">
              <Mail className="w-8 h-8" />
            </div>
            <p className="text-gray-500 text-sm mb-1 uppercase font-bold tracking-widest">Email Us</p>
            <p className="text-xl font-bold">sharmaak517@gmail.com</p>
          </div>
          <div className="w-px h-20 bg-white/10 hidden md:block"></div>
          <div className="flex flex-col items-center">
            <div className="p-4 bg-primary/10 rounded-full mb-4 text-primary">
              <Phone className="w-8 h-8" />
            </div>
            <p className="text-gray-500 text-sm mb-1 uppercase font-bold tracking-widest">Call Us</p>
            <p className="text-xl font-bold">+91 8969401902</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
