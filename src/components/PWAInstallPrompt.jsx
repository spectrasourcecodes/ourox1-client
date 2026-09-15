import { useState, useEffect, useRef } from 'react';
import { FaDownload, FaTimes, FaMobileAlt } from 'react-icons/fa';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  // ✅ Store timers in refs so we can clean them up
  const showTimerRef = useRef(null);
  const iosTimerRef = useRef(null);

  useEffect(() => {
    // ─── Already installed? ───────────────────────────────
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://');

    if (standalone) {
      setIsInstalled(true);
      return;
    }

    // ─── iOS? ─────────────────────────────────────────────
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    // ─── Respect 7-day dismissal ──────────────────────────
    const dismissedAt = localStorage.getItem('pwa_prompt_dismissed_at');
    if (dismissedAt) {
      const days = (Date.now() - parseInt(dismissedAt, 10)) / 86400000;
      if (days < 7) return;
    }

    // ─── Event handlers ───────────────────────────────────
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // ✅ Store timer ID for cleanup
      showTimerRef.current = setTimeout(() => setShowPrompt(true), 3000);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.removeItem('pwa_prompt_dismissed_at');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // iOS: show after 5s (native prompt not available)
    if (iOS) {
      iosTimerRef.current = setTimeout(() => setShowPrompt(true), 5000);
    }

    // ─── Cleanup ──────────────────────────────────────────
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);

      // ✅ Clear BOTH timers
      if (showTimerRef.current) {
        clearTimeout(showTimerRef.current);
        showTimerRef.current = null;
      }
      if (iosTimerRef.current) {
        clearTimeout(iosTimerRef.current);
        iosTimerRef.current = null;
      }
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setIsInstalled(true);
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_prompt_dismissed_at', Date.now().toString());
  };

  // ✅ Plain conditional render — NO AnimatePresence, NO motion
  if (isInstalled || !showPrompt) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-6 lg:max-w-md z-[60]">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
            <FaMobileAlt className="text-white text-xl" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-sm mb-1">
              Instalar Aplicativo
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-3">
              Instale nosso app para acesso mais rápido e experiência offline.
            </p>

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

          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 text-slate-500 hover:text-slate-300 transition"
            aria-label="Fechar"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;