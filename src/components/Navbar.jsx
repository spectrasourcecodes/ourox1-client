// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Home, TrendingUp, Wallet, User, LogOut, 
  CreditCard, LayoutDashboard, MessageCircle, 
  Bell, Settings, RefreshCw, Eye, EyeOff
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const location = useLocation();

  // Check if current page is dashboard
  const isDashboard = location.pathname === '/dashboard';

  const supportLink = import.meta.env.VITE_SUPPORT_LINK

  const navLinks = isAuthenticated ? [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
    { path: '/market', label: 'Market', icon: TrendingUp, id: 'market' },
    { path: '/invest', label: 'Invest', icon: TrendingUp, id: 'invest' },
    { path: '/withdraw', label: 'Withdraw', icon: Wallet, id: 'withdraw' },
    { path: '/profile', label: 'Profile', icon: User, id: 'profile' },
    { 
      path: supportLink, 
      label: 'Support', 
      icon: MessageCircle, 
      external: true,
      id: 'support'
    },
  ] : [
    { path: '/', label: 'Home', icon: Home, id: 'home' },
    { path: '/market', label: 'Market', icon: TrendingUp, id: 'market' },
    { path: '/login', label: 'Login', icon: User, id: 'login' },
    { path: '/register', label: 'Register', icon: CreditCard, id: 'register' },
    { 
      path: supportLink, 
      label: 'Support', 
      icon: MessageCircle, 
      external: true,
      id: 'support'
    },
  ];

  const handleLogout = async () => {
    try {
      logout();
      toast.success("Logout successful");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  // Format currency for balance display
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value || 0);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.fullName) {
      return user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return 'U';
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 shadow-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Always show app name on desktop */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">Ouro</span>
              <span className="text-sm text-gray-500">Invest</span>
            </Link>
            
            <div className="flex items-center space-x-8">
              {navLinks.map((link) => {
                const Icon = link.icon;

                if (link.external) {
                  return (
                    <a
                      key={link.id}
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-blue-600"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </a>
                  );
                }

                return (
                  <Link
                    key={link.id}
                    to={link.path}
                    className={`flex items-center space-x-1 text-sm font-medium transition-colors
                      ${location.pathname === link.path 
                        ? 'text-blue-600' 
                        : 'text-gray-600 hover:text-blue-600'}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {isAuthenticated && (
                <>
                  {/* Balance toggle on desktop */}
                  {isDashboard && (
                    <button 
                      onClick={() => setShowBalance(!showBalance)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title={showBalance ? "Ocultar saldo" : "Mostrar saldo"}
                    >
                      {showBalance ? <Eye className="w-4 h-4 text-gray-600" /> : <EyeOff className="w-4 h-4 text-gray-600" />}
                    </button>
                  )}
                  
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                  
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar - Always shows app name */}
      <nav className="md:hidden fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
        <div className="px-4 py-3 flex justify-between items-center">
          {/* Left side - Always show app name */}
          <Link to="/" className="flex items-center space-x-1">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">Ouro Invest</span>
          </Link>

          {/* Right side - Controls */}
          <div className="flex items-center space-x-2">
            {isAuthenticated && isDashboard && (
              <button 
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {showBalance ? <Eye className="w-5 h-5 text-gray-600" /> : <EyeOff className="w-5 h-5 text-gray-600" />}
              </button>
            )}
            
            {isAuthenticated && (
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            )}
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="bg-white border-t max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-2 space-y-1">
              {/* User info */}
              {isAuthenticated && (
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                    {getUserInitials()}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{user?.fullName || 'Usuário'}</p>
                    <p className="text-xs text-gray-500">Membro desde {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'N/A'}</p>
                  </div>
                </div>
              )}
              
              {navLinks.map((link) => {
                const Icon = link.icon;

                if (link.external) {
                  return (
                    <a
                      key={link.id}
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{link.label}</span>
                    </a>
                  );
                }

                return (
                  <Link
                    key={link.id}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors
                      ${location.pathname === link.path 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'hover:bg-gray-50'}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}

              {isAuthenticated && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-red-600 mt-2 border-t border-gray-100 pt-3"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      {isAuthenticated && (
        <div className="md:hidden fixed bottom-0 w-full bg-white border-t z-40">
          <div className="flex justify-around items-center py-2">
            {navLinks.slice(0, 5).map((link) => {
              const Icon = link.icon;

              if (link.external) {
                return (
                  <a
                    key={link.id + '-bottom'}
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-2 text-gray-600"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs mt-1">{link.label}</span>
                  </a>
                );
              }

              return (
                <Link
                  key={link.id + '-bottom'}
                  to={link.path}
                  className={`flex flex-col items-center p-2 transition-colors
                    ${location.pathname === link.path 
                      ? 'text-blue-600' 
                      : 'text-gray-600'}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs mt-1">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;