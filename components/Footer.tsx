import React from 'react';
import { Instagram, Youtube, Video } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 pb-12 pt-12 border-t border-gray-100 dark:border-neutral-800 flex flex-col items-center justify-center text-center space-y-6 transition-colors duration-500">
      <div className="flex space-x-8">
        <a 
          href="https://www.instagram.com/mwabonje_" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs font-bold tracking-widest uppercase hover:text-brand-blue transition-colors flex items-center gap-2 text-gray-900 dark:text-gray-300 dark:hover:text-brand-blue"
        >
          <Instagram size={14} /> Instagram
        </a>
        <a 
          href="https://www.tiktok.com/@mwabonje_?_r=1&_t=ZS-93HZdq4aD46" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs font-bold tracking-widest uppercase hover:text-brand-blue transition-colors flex items-center gap-2 text-gray-900 dark:text-gray-300 dark:hover:text-brand-blue"
        >
          <Video size={14} /> Tik Tok
        </a>
        <a 
          href="https://www.youtube.com/@mwabonje/shorts" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs font-bold tracking-widest uppercase hover:text-brand-blue transition-colors flex items-center gap-2 text-gray-900 dark:text-gray-300 dark:hover:text-brand-blue"
        >
          <Youtube size={14} /> Youtube
        </a>
      </div>
      <p className="text-gray-400 dark:text-gray-600 text-xs font-light">
        &copy; {new Date().getFullYear()} Mwabonje Photography, All Rights Reserved
      </p>
    </footer>
  );
};