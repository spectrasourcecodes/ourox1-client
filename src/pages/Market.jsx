// src/pages/Market.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Star, 
  Search, 
  Filter,
  RefreshCw,
  AlertCircle,
  Globe,
  BarChart3,
  Activity,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  Bookmark,
  Bell
} from 'lucide-react';
import { toast } from 'react-toastify';

const Market = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState(['BTC', 'ETH', 'SOL']);
  const [marketData, setMarketData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'market_cap', direction: 'desc' });

  const categories = [
    { id: 'all', name: 'Todas Moedas', icon: Globe, color: 'from-blue-500 to-indigo-500' },
    { id: 'large', name: 'Large Cap', icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
    { id: 'mid', name: 'Mid Cap', icon: BarChart3, color: 'from-green-500 to-emerald-500' },
    { id: 'small', name: 'Small Cap', icon: Activity, color: 'from-orange-500 to-red-500' },
  ];

  // Mock market data with icons and colors
  const mockMarketData = [
    {
      id: 'bitcoin',
      symbol: 'BTC',
      name: 'Bitcoin',
      icon: '₿',
      current_price: 52345,
      market_cap: 1023456789000,
      market_cap_rank: 1,
      total_volume: 28456789000,
      price_change_percentage_24h: 5.2,
      circulating_supply: 19500000,
      color: 'from-orange-500 to-yellow-500',
      bg: 'bg-orange-50',
      textColor: 'text-orange-600',
      sparkline: [45, 48, 52, 51, 53, 55, 58, 57, 59, 62, 61, 63]
    },
    {
      id: 'ethereum',
      symbol: 'ETH',
      name: 'Ethereum',
      icon: 'Ξ',
      current_price: 3234,
      market_cap: 389456789000,
      market_cap_rank: 2,
      total_volume: 15678900000,
      price_change_percentage_24h: 3.8,
      circulating_supply: 120000000,
      color: 'from-blue-500 to-indigo-500',
      bg: 'bg-blue-50',
      textColor: 'text-blue-600',
      sparkline: [32, 34, 33, 35, 36, 38, 37, 39, 40, 38, 41, 42]
    },
    {
      id: 'solana',
      symbol: 'SOL',
      name: 'Solana',
      icon: 'SOL',
      current_price: 142.50,
      market_cap: 61234567890,
      market_cap_rank: 5,
      total_volume: 3456789000,
      price_change_percentage_24h: 7.2,
      circulating_supply: 430000000,
      color: 'from-purple-500 to-pink-500',
      bg: 'bg-purple-50',
      textColor: 'text-purple-600',
      sparkline: [12, 14, 13, 15, 16, 18, 20, 22, 24, 26, 28, 30]
    },
    {
      id: 'cardano',
      symbol: 'ADA',
      name: 'Cardano',
      icon: 'ADA',
      current_price: 0.45,
      market_cap: 15789000000,
      market_cap_rank: 8,
      total_volume: 890123000,
      price_change_percentage_24h: 1.5,
      circulating_supply: 35000000000,
      color: 'from-blue-400 to-cyan-400',
      bg: 'bg-blue-50',
      textColor: 'text-blue-600',
      sparkline: [4, 5, 4.5, 4.8, 5.2, 4.9, 5.1, 5.3, 5.0, 4.7, 4.9, 5.1]
    },
    {
      id: 'ripple',
      symbol: 'XRP',
      name: 'XRP',
      icon: 'XRP',
      current_price: 0.89,
      market_cap: 47890123456,
      market_cap_rank: 6,
      total_volume: 2345678900,
      price_change_percentage_24h: -1.2,
      circulating_supply: 54000000000,
      color: 'from-gray-500 to-gray-600',
      bg: 'bg-gray-50',
      textColor: 'text-gray-600',
      sparkline: [9, 8.8, 9.2, 8.9, 8.7, 8.5, 8.8, 9.0, 8.6, 8.4, 8.7, 8.9]
    },
    {
      id: 'dogecoin',
      symbol: 'DOGE',
      name: 'Dogecoin',
      icon: 'Ð',
      current_price: 0.12,
      market_cap: 16789012345,
      market_cap_rank: 9,
      total_volume: 1234567890,
      price_change_percentage_24h: -3.4,
      circulating_supply: 140000000000,
      color: 'from-yellow-500 to-amber-500',
      bg: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      sparkline: [1.2, 1.1, 1.3, 1.0, 1.2, 1.4, 1.3, 1.1, 1.2, 1.0, 0.9, 0.8]
    },
    {
      id: 'polkadot',
      symbol: 'DOT',
      name: 'Polkadot',
      icon: 'DOT',
      current_price: 7.23,
      market_cap: 8901234567,
      market_cap_rank: 12,
      total_volume: 456789012,
      price_change_percentage_24h: -0.8,
      circulating_supply: 1234567890,
      color: 'from-pink-500 to-rose-500',
      bg: 'bg-pink-50',
      textColor: 'text-pink-600',
      sparkline: [7.5, 7.3, 7.1, 7.4, 7.2, 7.0, 7.3, 7.5, 7.1, 6.9, 7.2, 7.4]
    },
    {
      id: 'avalanche',
      symbol: 'AVAX',
      name: 'Avalanche',
      icon: 'AVAX',
      current_price: 34.56,
      market_cap: 12345678901,
      market_cap_rank: 11,
      total_volume: 789012345,
      price_change_percentage_24h: 9.2,
      circulating_supply: 357000000,
      color: 'from-red-500 to-orange-500',
      bg: 'bg-red-50',
      textColor: 'text-red-600',
      sparkline: [30, 32, 34, 33, 35, 37, 39, 42, 44, 46, 48, 50]
    },
  ];

  useEffect(() => {
    setMarketData(mockMarketData);
  }, []);

  const marketStats = {
    totalMarketCap: 2450000000000,
    totalVolume: 98300000000,
    btcDominance: 52.4,
    activeCoins: 8923,
    exchanges: 432
  };

  const toggleFavorite = (symbol) => {
    if (favorites.includes(symbol)) {
      setFavorites(favorites.filter(s => s !== symbol));
      toast.info(`${symbol} removido da lista de observação`);
    } else {
      setFavorites([...favorites, symbol]);
      toast.success(`${symbol} adicionado à lista de observação`);
    }
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setMarketData(prev => 
        prev.map(coin => ({
          ...coin,
          current_price: coin.current_price * (1 + (Math.random() - 0.5) * 0.02),
          price_change_percentage_24h: coin.price_change_percentage_24h + (Math.random() - 0.5) * 2
        }))
      );
      setIsLoading(false);
      toast.success('Dados de mercado atualizados');
    }, 1000);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    
    const sortedData = [...marketData].sort((a, b) => {
      if (key === 'market_cap' || key === 'current_price' || key === 'total_volume' || key === 'price_change_percentage_24h') {
        return direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
      }
      return 0;
    });
    setMarketData(sortedData);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? 
        <ChevronUp className="w-4 h-4" /> : 
        <ChevronDown className="w-4 h-4" />;
    }
    return null;
  };

  const filteredData = marketData.filter(coin => 
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(coin => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'large') return coin.market_cap_rank <= 10;
    if (selectedCategory === 'mid') return coin.market_cap_rank > 10 && coin.market_cap_rank <= 50;
    if (selectedCategory === 'small') return coin.market_cap_rank > 50;
    return true;
  });

  const formatPrice = (price) => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    if (price < 10) return `$${price.toFixed(3)}`;
    if (price < 1000) return `$${price.toFixed(2)}`;
    return `$${price.toLocaleString('pt-BR')}`;
  };

  const formatMarketCap = (cap) => {
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
    return `$${cap.toLocaleString('pt-BR')}`;
  };

  const formatVolume = (vol) => {
    if (vol >= 1e9) return `$${(vol / 1e9).toFixed(2)}B`;
    if (vol >= 1e6) return `$${(vol / 1e6).toFixed(2)}M`;
    return `$${vol.toLocaleString('pt-BR')}`;
  };

  const topGainers = [...marketData].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0, 3);
  const topLosers = [...marketData].sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h).slice(0, 3);
  const mostActive = [...marketData].sort((a, b) => b.total_volume - a.total_volume).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Visão Geral do Mercado
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={refreshData}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-5 h-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Market Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Cap. de Mercado Total</p>
            <p className="text-xl font-bold text-gray-900">{formatMarketCap(marketStats.totalMarketCap)}</p>
            <span className="text-xs text-green-600">+2,4%</span>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Volume 24h</p>
            <p className="text-xl font-bold text-gray-900">{formatMarketCap(marketStats.totalVolume)}</p>
            <span className="text-xs text-green-600">+5,2%</span>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Dominância BTC</p>
            <p className="text-xl font-bold text-gray-900">{marketStats.btcDominance}%</p>
            <span className="text-xs text-blue-600">+0,8%</span>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Moedas Ativas</p>
            <p className="text-xl font-bold text-gray-900">{marketStats.activeCoins.toLocaleString('pt-BR')}</p>
            <span className="text-xs text-gray-500">{marketStats.exchanges} exchanges</span>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar moedas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          
          <div className="flex gap-2">
            <select className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Ordenar por: Cap. de Mercado</option>
              <option>Preço: Maior para Menor</option>
              <option>Preço: Menor para Maior</option>
              <option>Variação 24h</option>
              <option>Volume</option>
            </select>
            
            <button className="px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filtrar
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-2 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-xl whitespace-nowrap transition-all
                  ${selectedCategory === category.id 
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg` 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Market Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Moeda</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSort('current_price')}>
                    <div className="flex items-center justify-end">Preço {getSortIcon('current_price')}</div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSort('price_change_percentage_24h')}>
                    <div className="flex items-center justify-end">24h % {getSortIcon('price_change_percentage_24h')}</div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSort('market_cap')}>
                    <div className="flex items-center justify-end">Cap. de Mercado {getSortIcon('market_cap')}</div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSort('total_volume')}>
                    <div className="flex items-center justify-end">Volume {getSortIcon('total_volume')}</div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Observar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((coin, index) => (
                  <tr key={coin.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 ${coin.bg} rounded-lg flex items-center justify-center mr-3`}>
                          <span className={`text-sm font-bold ${coin.textColor}`}>{coin.icon}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{coin.name}</div>
                          <div className="text-sm text-gray-500">{coin.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                      {formatPrice(coin.current_price)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right font-medium ${
                      coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <div className="flex items-center justify-end">
                        {coin.price_change_percentage_24h >= 0 ? (
                          <ArrowUpRight className="w-4 h-4 mr-1" />
                        ) : (
                          <ArrowDownLeft className="w-4 h-4 mr-1" />
                        )}
                        {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {formatMarketCap(coin.market_cap)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {formatVolume(coin.total_volume)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button onClick={() => toggleFavorite(coin.symbol)}>
                        <Star className={`w-5 h-5 ${
                          favorites.includes(coin.symbol) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300 hover:text-gray-400'
                        }`} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma criptomoeda encontrada</p>
            </div>
          )}
        </div>

        {/* Market Movers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Top Gainers */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Maiores Altas (24h)</h3>
              <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">+12,4% média</span>
            </div>
            <div className="space-y-4">
              {topGainers.map((coin) => (
                <div key={coin.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${coin.bg} rounded-lg flex items-center justify-center`}>
                      <span className={`text-sm font-bold ${coin.textColor}`}>{coin.icon}</span>
                    </div>
                    <div>
                      <p className="font-medium">{coin.symbol}</p>
                      <p className="text-xs text-gray-500">{formatPrice(coin.current_price)}</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-semibold">+{coin.price_change_percentage_24h.toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Losers */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Maiores Baixas (24h)</h3>
              <span className="px-2 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium">-8,2% média</span>
            </div>
            <div className="space-y-4">
              {topLosers.map((coin) => (
                <div key={coin.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${coin.bg} rounded-lg flex items-center justify-center`}>
                      <span className={`text-sm font-bold ${coin.textColor}`}>{coin.icon}</span>
                    </div>
                    <div>
                      <p className="font-medium">{coin.symbol}</p>
                      <p className="text-xs text-gray-500">{formatPrice(coin.current_price)}</p>
                    </div>
                  </div>
                  <span className="text-red-600 font-semibold">{coin.price_change_percentage_24h.toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Most Active */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Mais Negociados</h3>
              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">Volume</span>
            </div>
            <div className="space-y-4">
              {mostActive.map((coin) => (
                <div key={coin.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${coin.bg} rounded-lg flex items-center justify-center`}>
                      <span className={`text-sm font-bold ${coin.textColor}`}>{coin.icon}</span>
                    </div>
                    <div>
                      <p className="font-medium">{coin.symbol}</p>
                      <p className="text-xs text-gray-500">{formatPrice(coin.current_price)}</p>
                    </div>
                  </div>
                  <span className="text-gray-900 font-medium">{formatVolume(coin.total_volume)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Watchlist Section */}
        {favorites.length > 0 && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
                  <Bookmark className="w-5 h-5 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Sua Lista de Observação</h3>
              </div>
              <span className="text-sm text-gray-500">{favorites.length} moedas</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {favorites.map((symbol) => {
                const coin = marketData.find(c => c.symbol === symbol);
                if (!coin) return null;
                return (
                  <div key={symbol} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${coin.bg} rounded-xl flex items-center justify-center`}>
                        <span className={`text-lg font-bold ${coin.textColor}`}>{coin.icon}</span>
                      </div>
                      <div>
                        <p className="font-semibold">{coin.symbol}</p>
                        <p className="text-sm text-gray-500">{formatPrice(coin.current_price)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`text-sm font-semibold ${
                        coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                        {coin.price_change_percentage_24h.toFixed(2)}%
                      </span>
                      <button onClick={() => toggleFavorite(symbol)}>
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Market Insights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold mb-1">Sentimento de Mercado</h4>
                <p className="text-sm text-white/80">Índice de Medo & Ganância</p>
              </div>
              <Sparkles className="w-8 h-8 text-white/50" />
            </div>
            <p className="text-4xl font-bold mb-2">72</p>
            <p className="text-lg mb-4">Ganância</p>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-white rounded-full"></div>
            </div>
            <div className="mt-4 flex justify-between text-sm text-white/80">
              <span>Medo Extremo</span>
              <span>Ganância Extrema</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold mb-1">Tendências</h4>
                <p className="text-sm text-gray-400">Moedas mais buscadas</p>
              </div>
              <Activity className="w-8 h-8 text-gray-400" />
            </div>
            <div className="space-y-3">
              {['SOL', 'AVAX', 'LINK'].map((symbol, index) => {
                const coin = marketData.find(c => c.symbol === symbol);
                return (
                  <div key={symbol} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">{index + 1}.</span>
                      <span>{symbol}</span>
                    </div>
                    <span className="text-green-400">+{Math.floor(Math.random() * 20 + 10)}%</span>
                  </div>
                );
              })}
            </div>
            <button className="mt-4 w-full bg-white/10 hover:bg-white/20 rounded-xl py-2 text-sm font-medium transition-colors">
              Ver Mais
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            Os dados são atualizados em tempo real via WebSocket. Os preços são apenas para referência e podem variar ligeiramente dos preços reais de mercado.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Market;