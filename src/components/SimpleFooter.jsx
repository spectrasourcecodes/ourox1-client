// src/components/SimpleFooter.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const SimpleFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t mt-auto py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
          <div className="flex items-center space-x-1 mb-2 sm:mb-0">
            <span>© {currentYear} Ouro Investment.</span>
            <span className="hidden sm:inline">All rights reserved.</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link to="/dashboard" className="hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <a href="#" className="hover:text-blue-600 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors">
              Privacy
            </a>
          </div>

          <div className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>by Ouro Invest Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SimpleFooter;