import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="w-full h-64 md:h-96 overflow-hidden bg-gray-100 mb-12 relative group">
      <img 
        src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=2000" 
        alt="Classic Camera Mamiya 645" 
        className="w-full h-full object-cover object-center grayscale opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out"
      />
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <h1 className="text-white font-signature text-7xl md:text-9xl opacity-95 selection:bg-transparent">
          Mwabonje
        </h1>
      </div>

      {/* Portfolio Link */}
      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-20">
        <a
          href="https://mwabonje.carrd.co/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-white/90 hover:text-white transition-all duration-300 group/link"
        >
          <span className="text-xs font-bold tracking-widest uppercase border-b border-transparent group-hover/link:border-white pb-0.5 shadow-sm">
            Portfolio
          </span>
          <ArrowUpRight size={16} className="transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
};