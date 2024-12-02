import React from 'react';
import { Github, Linkedin, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/10 backdrop-blur-sm py-4">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center">
        <div className="flex items-center space-x-4 mb-2">
          <a 
            href="https://github.com/Devyn-Miller" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="GitHub Profile"
          >
            <Github size={24} />
          </a>
          <a 
            href="https://linkedin.com/in/devyn-c-miller/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="LinkedIn Profile"
          >
            <Linkedin size={24} />
          </a>
        </div>
        
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            Built with <Heart className="inline-block w-3 h-3 text-red-500 mx-1 fill-current" style={{ transform: 'translateY(-1px)' }} /> by <a href="https://devyn-miller.github.io/profile-/" className="font-bold text-blue-600 hover:text-blue-800 transition-colors">Devyn Miller</a>
          </p>
          <p className="text-xs"> {currentYear} All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
