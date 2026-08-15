// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft,
  Eye,
  EyeOff,
  PieChart,
  Activity,
  Sparkles,
  Clock,
  MoreHorizontal,
  Download,
  Send,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import BinanceWebSocket from '../utils/binanceWebSocket';
import axiosInstance from '../utils/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');
  const [livePrices, setLivePrices] = useState({});
  const [wallet, setWallet] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock holdings data
  const mockHoldings = [
    {
      asset: 'Bitcoin',
      symbol: 'BTC',
      amount: 2.45,
      value: 128345,
      change24h: 5.2,
      allocation: 42,
    },
    {
      asset: 'Ethereum',
      symbol: 'ETH',
      amount: 15.8,
      value: 51097,
      change24h: 3.8,
      allocation: 28,
    },
    {
      asset: 'Solana',
      symbol: 'SOL',
      amount: 425,
      value: 60250,
      change24h: 7.2,
      allocation: 18,
    },
    {
      asset: 'Cardano',
      symbol: 'ADA',
      amount: 12500,
      value: 5625,
      change24h: -1.2,
      allocation: 8,
    },
    {
      asset: 'Polkadot',
      symbol: 'DOT',
      amount: 850,
      value: 6135,
      change24h: 2.1,
      allocation: 4,
    },
  ];

  // Mock transactions data
  const mockTransactions = [
    {
      _id: '1',
      type: 'buy',
      asset: 'Bitcoin',
      amount: 0.5,
      value: 26172.50,
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'completed'
    },
    {
      _id: '2',
      type: 'sell',
      asset: 'Ethereum',
      amount: 2.0,
      value: 6468.00,
      date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      status: 'completed'
    },
    {
      _id: '4',
      type: 'deposit',
      asset: 'USDC',
      amount: 10000,
      value: 10000.00,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed'
    },
    {
      _id: '3',
      type: 'buy',
      asset: 'Solana',
      amount: 50,
      value: 7125.00,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending'
    },
  ];

  // Asset helpers
  const getAssetIcon = (symbol) => {
    const icons = {
      'BTC': '₿', 'ETH': 'Ξ', 'SOL': 'SOL', 'ADA': 'ADA', 'DOT': 'DOT',
      'AVAX': 'AVAX', 'USDT': 'R$', 'USDC': 'R$', 'BRL': 'R$', 'BNB': 'BNB',
      'XRP': 'XRP', 'DOGE': 'Ð', 'LINK': 'LINK', 'MATIC': 'MATIC', 'ATOM': 'ATOM'
    };
    return icons[symbol] || symbol.charAt(0);
  };

  const getAssetColor = (symbol) => {
    const colors = {
      'BTC': 'from-orange-500 to-yellow-500', 'ETH': 'from-blue-500 to-indigo-500',
      'SOL': 'from-purple-500 to-pink-500', 'ADA': 'from-blue-400 to-cyan-400',
      'DOT': 'from-pink-500 to-rose-500', 'AVAX': 'from-red-500 to-orange-500',
      'USDT': 'from-green-500 to-emerald-500', 'USDC': 'from-green-500 to-emerald-500',
      'BRL': 'from-green-500 to-emerald-500', 'BNB': 'from-yellow-500 to-amber-500',
      'XRP': 'from-gray-500 to-gray-600', 'DOGE': 'from-yellow-500 to-amber-500',
      'LINK': 'from-blue-500 to-indigo-500', 'MATIC': 'from-purple-500 to-indigo-500',
      'ATOM': 'from-blue-400 to-indigo-400'
    };
    return colors[symbol] || 'from-gray-500 to-gray-600';
  };

  const getAssetBg = (symbol) => {
    const bgs = {
      'BTC': 'bg-orange-50', 'ETH': 'bg-blue-50', 'SOL': 'bg-purple-50',
      'ADA': 'bg-blue-50', 'DOT': 'bg-pink-50', 'AVAX': 'bg-red-50',
      'USDT': 'bg-green-50', 'USDC': 'bg-green-50', 'BRL': 'bg-green-50',
      'BNB': 'bg-yellow-50', 'XRP': 'bg-gray-50', 'DOGE': 'bg-yellow-50',
      'LINK': 'bg-blue-50', 'MATIC': 'bg-purple-50', 'ATOM': 'bg-blue-50'
    };
    return bgs[symbol] || 'bg-gray-50';
  };

  const getAssetTextColor = (symbol) => {
    const colors = {
      'BTC': 'text-orange-600', 'ETH': 'text-blue-600', 'SOL': 'text-purple-600',
      'ADA': 'text-blue-600', 'DOT': 'text-pink-600', 'AVAX': 'text-red-600',
      'USDT': 'text-green-600', 'USDC': 'text-green-600', 'BRL': 'text-green-600',
      'BNB': 'text-yellow-600', 'XRP': 'text-gray-600', 'DOGE': 'text-yellow-600',
      'LINK': 'text-blue-600', 'MATIC': 'text-purple-600', 'ATOM': 'text-blue-600'
    };
    return colors[symbol] || 'text-gray-600';
  };

  // Fetch dashboard data
  const fetchDashboard = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      
      const response = await axiosInstance.get('/api/user/dashboard');
      const { wallet: walletData } = response.data;
      
      setWallet(walletData);
      
      const formattedHoldings = mockHoldings.map(holding => ({
        ...holding,
        icon: getAssetIcon(holding.symbol),
        color: getAssetColor(holding.symbol),
        bg: getAssetBg(holding.symbol),
        textColor: getAssetTextColor(holding.symbol)
      }));
      setHoldings(formattedHoldings);
      
      const sortedTransactions = [...mockTransactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
      setRecentTransactions(sortedTransactions);

      if (showToast) {
        toast.success('Dashboard atualizado');
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      toast.error(err.response?.data?.message || 'Falha ao carregar dados do dashboard');
      navigate('/login');
      setWallet(null);
      setHoldings([]);
      setRecentTransactions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchDashboard();
  }, [isAuthenticated]);

  // Live price WebSocket
  useEffect(() => {
    const symbols = ['btcusdt', 'ethusdt', 'solusdt'];
    const connections = [];

    symbols.forEach(symbol => {
      const ws = new BinanceWebSocket(symbol, (data) => {
        const asset = symbol.replace('usdt', '').toUpperCase();
        setLivePrices(prev => ({
          ...prev,
          [asset]: data.close
        }));
      });
      ws.connect();
      connections.push(ws);
    });

    return () => {
      connections.forEach(ws => ws.disconnect());
    };
  }, []);

  const handleRefresh = () => {
    fetchDashboard(true);
  };

  // KYC Status Badge
  const KYCStatusBadge = ({ status }) => {
    if (status) {
      return (
        <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs">
          <CheckCircle className="w-3 h-3" />
          <span>KYC Verificado</span>
        </div>
      );
    }
    return (
      <Link to="/kyc" className="flex items-center space-x-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full text-xs hover:bg-yellow-100 transition-colors">
        <AlertCircle className="w-3 h-3" />
        <span>KYC Necessário</span>
      </Link>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seu dashboard...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours} h atrás`;
    if (diffDays < 7) return `${diffDays} d atrás`;
    return date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' });
  };

  const timeframeOptions = ['1D', '1S', '1M', '3M', '1A', 'TODOS'];

  // Calculate portfolio metrics
  const portfolioData = {
    totalBalance: wallet?.balance || 0,
    dailyChange: wallet?.balance ? wallet.balance * 0.0189 : 0,
    dailyChangePercent: 1.89,
    totalProfit: wallet?.profit || 0,
    profitPercent: wallet?.balance ? (wallet.profit / wallet.balance) * 100 : 0,
    availableForWithdrawal: wallet?.kyc ? wallet?.balance * 0.8 : 0,
    investedAmount: wallet?.balance ? wallet.balance - (wallet?.balance * 0.2) : 0,
  };

  const weeklyReturn = portfolioData.dailyChange * 5;
  const monthlyReturn = portfolioData.dailyChange * 22;
  const winRate = 68;
  const bestTrade = 4567.89;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Dashboard Title */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">Visão geral do seu portfólio e investimentos</p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {timeframeOptions.map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                  selectedTimeframe === timeframe
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Welcome Section with KYC Status */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Bem-vindo de volta, {user?.fullName?.split(' ')[0] || 'Investidor'} 👋
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Veja o que está acontecendo com seu portfólio hoje</p>
          </div>
          <div className="mt-3 sm:mt-0">
            <KYCStatusBadge status={wallet?.kyc} />
          </div>
        </div>

        {/* Rest of the dashboard content remains the same... */}
        {/* Portfolio Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Main Balance Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <pattern id="grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
                <rect width="100" height="100" fill="url(#grid)" />
              </svg>
            </div>
            
            <div className="absolute -top-20 -right-20 w-48 sm:w-64 h-48 sm:h-64 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-48 sm:w-64 h-48 sm:h-64 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>

            <div className="relative">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-300">Valor Total do Portfólio</span>
                </div>
                <button 
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {showBalance ? <Eye className="w-3 h-3 sm:w-4 sm:h-4" /> : <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" />}
                </button>
              </div>

              <div className="mb-3 sm:mb-4">
                <span className="text-2xl sm:text-4xl font-bold">
                  {showBalance ? formatCurrency(portfolioData.totalBalance) : '••••••'}
                </span>
              </div>

              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="flex items-center space-x-1 bg-white/10 px-2 sm:px-3 py-1 rounded-full">
                  <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                  <span className="text-xs sm:text-sm font-medium">
                    {showBalance ? `+${formatCurrency(portfolioData.dailyChange)}` : '••••'}
                  </span>
                  <span className="text-[10px] sm:text-xs text-green-400">({portfolioData.dailyChangePercent}%)</span>
                </div>
                <span className="text-xs sm:text-sm text-gray-400">Hoje</span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-4 sm:mt-6">
                <div className="bg-white/5 rounded-xl p-2 sm:p-3">
                  <p className="text-[10px] sm:text-xs text-gray-400 mb-1">Lucro Total</p>
                  <p className="text-sm sm:text-lg font-semibold text-green-400">
                    {showBalance ? `+${formatCurrency(portfolioData.totalProfit)}` : '••••'}
                  </p>
                  <p className="text-[10px] sm:text-xs text-green-400/70">+{portfolioData.profitPercent.toFixed(2)}% desde o início</p>
                </div>
                <div className="bg-white/5 rounded-xl p-2 sm:p-3">
                  <p className="text-[10px] sm:text-xs text-gray-400 mb-1">Disponível</p>
                  <p className="text-sm sm:text-lg font-semibold">
                    {showBalance ? formatCurrency(portfolioData.availableForWithdrawal) : '••••'}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-400">
                    {wallet?.kyc ? 'Pronto para sacar' : 'KYC necessário'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <span className="font-semibold text-gray-900 text-sm sm:text-base">Performance</span>
              </div>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <div className="flex justify-between text-xs sm:text-sm mb-1 sm:mb-2">
                  <span className="text-gray-600">Retorno de Hoje</span>
                  <span className="font-semibold text-green-600 text-xs sm:text-sm">
                    +{formatCurrency(portfolioData.dailyChange)}
                  </span>
                </div>
                <div className="h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                    style={{ width: `${Math.min(Math.abs(portfolioData.dailyChangePercent) * 10, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs sm:text-sm mb-1 sm:mb-2">
                  <span className="text-gray-600">Retorno Semanal</span>
                  <span className="font-semibold text-green-600 text-xs sm:text-sm">
                    +{formatCurrency(weeklyReturn)}
                  </span>
                </div>
                <div className="h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"
                    style={{ width: `${Math.min(Math.abs(portfolioData.dailyChangePercent) * 20, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs sm:text-sm mb-1 sm:mb-2">
                  <span className="text-gray-600">Retorno Mensal</span>
                  <span className="font-semibold text-green-600 text-xs sm:text-sm">
                    +{formatCurrency(monthlyReturn)}
                  </span>
                </div>
                <div className="h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-400 to-purple-500 rounded-full"
                    style={{ width: `${Math.min(Math.abs(portfolioData.profitPercent) * 3, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Taxa de Acerto</span>
                <span className="font-semibold text-gray-900">{winRate}%</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm mt-1 sm:mt-2">
                <span className="text-gray-600">Melhor Trade</span>
                <span className="font-semibold text-green-600">+{formatCurrency(bestTrade)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Holdings and Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Portfolio Allocation */}
          <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                  <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Alocação do Portfólio</h3>
              </div>
              <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium">
                Ver Tudo
              </button>
            </div>

            {holdings.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {holdings.map((holding, index) => (
                  <div key={index} className="group hover:bg-gray-50 rounded-xl p-2 sm:p-3 transition-all">
                    <div className="flex items-center justify-between mb-1 sm:mb-2">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 ${holding.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <span className={`text-base sm:text-lg font-bold ${holding.textColor}`}>{holding.icon}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">{holding.asset}</p>
                          <p className="text-xs sm:text-sm text-gray-500">{holding.amount} {holding.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">{formatCurrency(holding.value)}</p>
                        <div className="flex items-center space-x-1 sm:space-x-2 justify-end">
                          <span className={`text-xs sm:text-sm ${
                            (holding.change24h || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {(holding.change24h || 0) >= 0 ? '+' : ''}{holding.change24h || 0}%
                          </span>
                          <span className="text-[10px] sm:text-xs text-gray-400">
                            {holding.allocation || 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="h-1 sm:h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${holding.color || 'from-blue-500 to-purple-500'} rounded-full`}
                        style={{ width: `${holding.allocation || 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
                Nenhum ativo ainda. Comece a investir para construir seu portfólio.
              </div>
            )}
          </div>

          {/* Quick Actions & Stats */}
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-3 sm:mb-4">Ações Rápidas</h3>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <Link to="/invest" className="group p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl hover:shadow-md transition-all">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mb-1 sm:mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-semibold text-gray-900 text-xs sm:text-sm">Investir</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">Comece a ganhar</p>
                </Link>
                <Link to="/withdraw" className="group p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-all">
                  <Download className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mb-1 sm:mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-semibold text-gray-900 text-xs sm:text-sm">Sacar</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">Resgatar</p>
                </Link>
                <Link to="/market" className="group p-3 sm:p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition-all">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mb-1 sm:mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-semibold text-gray-900 text-xs sm:text-sm">Mercado</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">Ver preços</p>
                </Link>
                <Link to="/profile" className="group p-3 sm:p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl hover:shadow-md transition-all">
                  <Send className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 mb-1 sm:mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-semibold text-gray-900 text-xs sm:text-sm">Transferir</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">Enviar crypto</p>
                </Link>
              </div>
            </div>

            {/* Portfolio Stats */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-3 sm:mb-4">Estatísticas do Portfólio</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs sm:text-sm text-gray-600">Total Investido</span>
                  <span className="font-semibold text-gray-900 text-xs sm:text-sm">{formatCurrency(portfolioData.investedAmount)}</span>
                </div>
                <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs sm:text-sm text-gray-600">Lucro Total</span>
                  <span className="font-semibold text-green-600 text-xs sm:text-sm">+{formatCurrency(portfolioData.totalProfit)}</span>
                </div>
                <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs sm:text-sm text-gray-600">ROI</span>
                  <span className="font-semibold text-green-600 text-xs sm:text-sm">+{portfolioData.profitPercent.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs sm:text-sm text-gray-600">Investimentos Ativos</span>
                  <span className="font-semibold text-gray-900 text-xs sm:text-sm">{holdings.length}</span>
                </div>
              </div>
            </div>

            {/* KYC Status Card */}
            {!wallet?.kyc && (
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold mb-1">Complete o KYC</h4>
                    <p className="text-xs sm:text-sm text-white/80">Verifique sua identidade para desbloquear acesso total</p>
                  </div>
                  <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white/50" />
                </div>
                <p className="text-xs sm:text-sm mb-3 sm:mb-4">
                  A verificação KYC oferece limites de saque mais altos e suporte prioritário.
                </p>
                <Link 
                  to="/kyc" 
                  className="block w-full bg-white/20 hover:bg-white/30 text-center rounded-xl py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors"
                >
                  Verificar Agora →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Transações Recentes</h3>
            </div>
            <Link to="/transactions" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium">
              Ver Tudo
            </Link>
          </div>

          {recentTransactions.length > 0 ? (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-[600px] sm:min-w-full">
                <thead>
                  <tr className="text-left text-xs sm:text-sm text-gray-500">
                    <th className="pb-3 sm:pb-4 font-medium pl-4 sm:pl-0">Ativo</th>
                    <th className="pb-3 sm:pb-4 font-medium">Tipo</th>
                    <th className="pb-3 sm:pb-4 font-medium hidden sm:table-cell">Quantidade</th>
                    <th className="pb-3 sm:pb-4 font-medium">Valor</th>
                    <th className="pb-3 sm:pb-4 font-medium hidden md:table-cell">Data</th>
                    <th className="pb-3 sm:pb-4 font-medium">Status</th>
                    <th className="pb-3 sm:pb-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="text-xs sm:text-sm">
                  {recentTransactions.map((tx, index) => (
                    <tr key={tx._id || index} className="border-t border-gray-100">
                      <td className="py-3 sm:py-4 pl-4 sm:pl-0">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${
                            tx.type === 'buy' ? 'bg-green-50' : 
                            tx.type === 'sell' ? 'bg-red-50' : 'bg-blue-50'
                          }`}>
                            {tx.type === 'buy' ? <ArrowDownLeft className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" /> :
                             tx.type === 'sell' ? <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" /> :
                             <Wallet className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />}
                          </div>
                          <span className="font-medium text-gray-900 text-xs sm:text-sm">{tx.asset}</span>
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 capitalize text-xs sm:text-sm">
                        {tx.type === 'buy' ? 'Compra' : tx.type === 'sell' ? 'Venda' : 'Depósito'}
                      </td>
                      <td className="py-3 sm:py-4 font-medium text-xs sm:text-sm hidden sm:table-cell">{tx.amount} {tx.asset}</td>
                      <td className="py-3 sm:py-4 text-xs sm:text-sm">{formatCurrency(tx.value)}</td>
                      <td className="py-3 sm:py-4 text-gray-500 text-xs sm:text-sm hidden md:table-cell">{formatDate(tx.date)}</td>
                      <td className="py-3 sm:py-4">
                        <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                          tx.status === 'completed' ? 'bg-green-50 text-green-700' :
                          tx.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                          'bg-gray-50 text-gray-700'
                        }`}>
                          {tx.status === 'completed' ? 'Concluído' : 
                           tx.status === 'pending' ? 'Pendente' : 'Falhou'}
                        </span>
                      </td>
                      <td className="py-3 sm:py-4">
                        <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
              Nenhuma transação ainda. Comece a investir para ver sua atividade aqui.
            </div>
          )}
        </div>

        {/* Market Insights */}
        <div className="mt-4 sm:mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div>
                <h4 className="text-base sm:text-lg font-semibold mb-1">Insight de Mercado</h4>
                <p className="text-xs sm:text-sm text-white/80">Dominância do Bitcoin em 52,4%</p>
              </div>
              <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-white/50" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">R$ 2,45 T</p>
            <p className="text-xs sm:text-sm text-white/80">Capitalização Total de Mercado</p>
            <div className="mt-3 sm:mt-4 flex items-center space-x-2">
              <div className="flex-1 h-1.5 sm:h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-white rounded-full"></div>
              </div>
              <span className="text-[10px] sm:text-xs">Volume 24h R$ 98,3 B</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div>
                <h4 className="text-base sm:text-lg font-semibold mb-1">Recomendação IA</h4>
                <p className="text-xs sm:text-sm text-gray-400">Baseado no seu portfólio</p>
              </div>
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
            </div>
            <p className="text-sm sm:text-lg mb-1 sm:mb-2">Considere diversificar em</p>
            <p className="text-xl sm:text-2xl font-bold mb-1 sm:mb-3">Solana (SOL)</p>
            <div className="flex items-center space-x-2">
              <span className="text-green-400 text-sm sm:text-base">+7,2%</span>
              <span className="text-xs sm:text-sm text-gray-400">variação 24h</span>
            </div>
            <button className="mt-3 sm:mt-4 w-full bg-white/10 hover:bg-white/20 rounded-xl py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors">
              Ver Análise →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;