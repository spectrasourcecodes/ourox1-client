// src/components/InstallPrompt.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Download, X } from 'lucide-react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  // ✅ Store timer in ref so we can clean it up
  const showTimerRef = useRef(null);

  useEffect(() => {
    // ─── Already installed? Don't show ────────────────────
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (standalone) {
      setIsInstalled(true);
      return;
    }

    // ─── Respect 7-day dismissal ──────────────────────────
    const dismissedAt = localStorage.getItem('pwa_prompt_dismissed_at');
    if (dismissedAt) {
      const days = (Date.now() - parseInt(dismissedAt, 10)) / 86400000;
      if (days < 7) return;
    }

    // ─── Capture install prompt event ─────────────────────
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // ✅ Store timer ID so it can be cleared on unmount
      showTimerRef.current = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.removeItem('pwa_prompt_dismissed_at');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // ─── Cleanup ──────────────────────────────────────────
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);

      if (showTimerRef.current) {
        clearTimeout(showTimerRef.current);
        showTimerRef.current = null;
      }
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Remember dismissal for 7 days
    // localStorage.setItem('pwa_prompt_dismissed_at', Date.now().toString());
  };

  // ✅ Plain conditional — no AnimatePresence, no motion
  if (isInstalled || !showPrompt) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[60]">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 backdrop-blur-xl">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">
                Instalar App Ouro Invest
              </h3>
              <p className="text-sm text-slate-400">
                Acesso mais rápido e suporte offline
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-slate-700/50 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <button
          onClick={handleInstall}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 px-6 rounded-xl transition-all hover:opacity-90 hover:scale-[1.02]"
        >
          Instalar Aplicativo
        </button>

        <p className="text-xs text-center text-slate-500 mt-2">
          Sem anúncios • Grátis • Seguro
        </p>
      </div>
    </div>
  );
};

export default InstallPrompt;