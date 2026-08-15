// src/components/InstallPrompt.jsx
import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    });
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Install Ouro Invest App</h3>
              <p className="text-sm text-gray-600">Get faster access and offline support</p>
            </div>
          </div>
          <button
            onClick={() => setShowPrompt(false)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <button
          onClick={handleInstall}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 px-6 rounded-xl transition-all hover:scale-105"
        >
          Install App
        </button>
        
        <p className="text-xs text-center text-gray-400 mt-2">
          No ads • Free • Secure
        </p>
      </div>
    </div>
  );
};

export default InstallPrompt;