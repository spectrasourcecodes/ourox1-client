import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDownload, FaTimes, FaMobileAlt, FaCheckCircle } from 'react-icons/fa';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // ✅ Check if app is already installed (standalone mode)
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://');

    setIsStandalone(standalone);
    if (standalone) {
      setIsInstalled(true);
      return;
    }

    // ✅ Detect iOS (install prompt not supported natively)
    const iOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);

    // ✅ Check if user dismissed the prompt recently
    const dismissedAt = localStorage.getItem('pwa_prompt_dismissed_at');
    if (dismissedAt) {
      const daysSince = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) {
        // Don't show again for 7 days
        return;
      }
    }

    // ✅ Listen for the browser's install prompt event (Android/Chrome/Edge)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show our custom prompt after a short delay
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // ✅ Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.removeItem('pwa_prompt_dismissed_at');
      console.log('✅ PWA installed successfully');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // ✅ For iOS, show prompt after delay (no native prompt available)
    if (iOS && !standalone) {
      const timer = setTimeout(() => setShowPrompt(true), 5000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // iOS or unsupported browser – show instructions
      if (isIOS) {
        alert(
          '📱 Para instalar no iPhone/iPad:\n\n1. Toque no botão "Compartilhar" no Safari\n2. Role para baixo e toque em "Adicionar à Tela de Início"\n3. Toque em "Adicionar"'
        );
      }
      return;
    }

    // Show the native install prompt
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('✅ User accepted the install prompt');
      setIsInstalled(true);
    } else {
      console.log('❌ User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Remember dismissal for 7 days
    localStorage.setItem('pwa_prompt_dismissed_at', Date.now().toString());
  };

  // Don't render if already installed or standalone
  if (isInstalled || isStandalone) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-20 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-6 lg:max-w-md z-[60]"
        >
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              {/* App Icon */}
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <FaMobileAlt className="text-white text-xl" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-sm mb-1">
                  Instalar Aplicativo
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-3">
                  {isIOS
                    ? 'Adicione à tela de início para acesso rápido e experiência em tela cheia.'
                    : 'Instale nosso app para acesso mais rápido, notificações e experiência offline.'}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleInstallClick}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition"
                  >
                    <FaDownload className="text-xs" />
                    Instalar
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-4 py-2 bg-slate-700/50 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-700 transition"
                  >
                    Depois
                  </button>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-1 text-slate-500 hover:text-slate-300 transition"
                aria-label="Fechar"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            {/* iOS Instructions */}
            {isIOS && (
              <div className="mt-3 pt-3 border-t border-slate-700">
                <p className="text-slate-400 text-xs flex items-start gap-2">
                  <FaCheckCircle className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>
                    Toque em <strong className="text-white">Compartilhar</strong> e depois em{' '}
                    <strong className="text-white">Adicionar à Tela de Início</strong>.
                  </span>
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;