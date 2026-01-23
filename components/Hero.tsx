import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Moon, Sun } from 'lucide-react';

export const Hero: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // On mount, check local storage. Default to light mode unless 'dark' is explicitly saved.
    // We intentionally ignore window.matchMedia('(prefers-color-scheme: dark)') to make Light the default.
    if (localStorage.theme === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  };

  return (
    <div className="w-full h-64 md:h-96 overflow-hidden bg-gray-100 dark:bg-brand-dark mb-12 relative group transition-colors duration-500">
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

      {/* Top Right Controls */}
      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-20 flex items-center gap-6">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="text-white/80 hover:text-white transition-colors duration-300 focus:outline-none"
          aria-label="Toggle Dark Mode"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Portfolio Link */}
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