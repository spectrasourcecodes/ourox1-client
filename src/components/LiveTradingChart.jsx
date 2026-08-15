// src/components/LiveTradingChart.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2, RefreshCw, Settings, Download } from 'lucide-react';

const LiveTradingChart = ({ symbol = 'BTCUSDT', interval = '1h' }) => {
  const chartContainerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInterval, setSelectedInterval] = useState(interval);
  const [selectedSymbol, setSelectedSymbol] = useState(symbol);

  // Available trading pairs
  const symbols = [
    { id: 'BTCUSDT', name: 'BTC/USDT', icon: '₿' },
    { id: 'ETHUSDT', name: 'ETH/USDT', icon: 'Ξ' },
    { id: 'BNBUSDT', name: 'BNB/USDT', icon: 'BNB' },
    { id: 'SOLUSDT', name: 'SOL/USDT', icon: 'SOL' },
    { id: 'ADAUSDT', name: 'ADA/USDT', icon: 'ADA' },
    { id: 'DOGEUSDT', name: 'DOGE/USDT', icon: 'Ð' },
  ];

  // Available time intervals
  const intervals = [
    { id: '1m', name: '1m' },
    { id: '5m', name: '5m' },
    { id: '15m', name: '15m' },
    { id: '30m', name: '30m' },
    { id: '1h', name: '1h' },
    { id: '4h', name: '4h' },
    { id: '1d', name: '1D' },
    { id: '1w', name: '1W' },
  ];

  // Load TradingView widget
  useEffect(() => {
    // Load TradingView script if not already loaded
    if (!document.getElementById('tradingview-script')) {
      const script = document.createElement('script');
      script.id = 'tradingview-script';
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = initChart;
      document.body.appendChild(script);
    } else {
      initChart();
    }

    function initChart() {
      if (!window.TradingView || !chartContainerRef.current) return;

      // Clear previous widget
      chartContainerRef.current.innerHTML = '';

      // Create new TradingView widget with Binance data
      new window.TradingView.widget({
        // Container
        container: chartContainerRef.current,
        width: '100%',
        height: isFullscreen ? '100%' : '500px',
        
        // Symbol and data
        symbol: `BINANCE:${selectedSymbol}`,
        interval: selectedInterval,
        timezone: 'exchange',
        theme: 'dark',
        style: '1', // Candlestick style
        locale: 'en',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: true,
        
        // Data feed
        datafeed: new window.TradingView.UDFCompatibleDatafeed(
          `https://demo_feed.tradingview.com/v5/`
        ),
        
        // Chart settings
        studies: [
          'RSI@tv-basicstudies',
          'MACD@tv-basicstudies',
          'MASimple@tv-basicstudies'
        ],
        
        // Appearance
        backgroundColor: '#0B0F1C',
        gridColor: '#1E2635',
        textColor: '#D1D4DC',
        
        // Features
        enabled_features: [
          'study_templates',
          'create_volume_indicator',
          'volume_force_overlay'
        ],
        disabled_features: [
          'use_localstorage_for_settings',
          'header_widget_dom_node',
          'left_toolbar'
        ],
        
        // Chart style overrides
        overrides: {
          'mainSeriesProperties.candleStyle.upColor': '#22c55e',
          'mainSeriesProperties.candleStyle.downColor': '#ef4444',
          'mainSeriesProperties.candleStyle.wickUpColor': '#22c55e',
          'mainSeriesProperties.candleStyle.wickDownColor': '#ef4444',
          'mainSeriesProperties.candleStyle.borderUpColor': '#22c55e',
          'mainSeriesProperties.candleStyle.borderDownColor': '#ef4444',
        },
        
        // Loading callback
        loading_screen: {
          backgroundColor: '#0B0F1C',
          foregroundColor: '#3B82F6'
        },
        
        onChartReady: () => {
          setIsLoading(false);
        }
      });
    }

    return () => {
      // Clean up widget on unmount
      if (chartContainerRef.current) {
        chartContainerRef.current.innerHTML = '';
      }
    };
  }, [selectedSymbol, selectedInterval, isFullscreen]);

  // Handle symbol change
  const handleSymbolChange = (newSymbol) => {
    setIsLoading(true);
    setSelectedSymbol(newSymbol);
  };

  // Handle interval change
  const handleIntervalChange = (newInterval) => {
    setIsLoading(true);
    setSelectedInterval(newInterval);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Export chart as image
  const exportChart = () => {
    // TradingView has built-in export functionality
    const widget = document.querySelector('.tradingview-widget-container iframe');
    if (widget) {
      // Trigger TradingView's save image
      const event = new KeyboardEvent('keydown', {
        key: 's',
        ctrlKey: true,
        shiftKey: true
      });
      widget.contentWindow.dispatchEvent(event);
    }
  };

  return (
    <div className={`bg-[#0B0F1C] rounded-3xl border border-gray-800 overflow-hidden transition-all duration-300 ${
      isFullscreen ? 'fixed inset-4 z-50' : ''
    }`}>
      {/* Chart Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div className="flex items-center space-x-6">
          {/* Symbol Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Pair:</span>
            <select
              value={selectedSymbol}
              onChange={(e) => handleSymbolChange(e.target.value)}
              className="bg-[#1E2635] text-white text-sm rounded-xl px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {symbols.map((sym) => (
                <option key={sym.id} value={sym.id}>
                  {sym.name}
                </option>
              ))}
            </select>
          </div>

          {/* Interval Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Interval:</span>
            <div className="flex bg-[#1E2635] rounded-xl p-1">
              {intervals.map((int) => (
                <button
                  key={int.id}
                  onClick={() => handleIntervalChange(int.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    selectedInterval === int.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {int.name}
                </button>
              ))}
            </div>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
              <span className="text-xs text-gray-400">Loading chart...</span>
            </div>
          )}
        </div>

        {/* Chart Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={exportChart}
            className="p-2 hover:bg-[#1E2635] rounded-lg transition-colors"
            title="Export as image"
          >
            <Download className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-[#1E2635] rounded-lg transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5 text-gray-400" />
            ) : (
              <Maximize2 className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div 
        ref={chartContainerRef} 
        className="tradingview-widget-container"
        style={{ height: isFullscreen ? 'calc(100% - 73px)' : '500px' }}
      />

      {/* Real-time Price Ticker */}
      <div className="border-t border-gray-800 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Last Price:</span>
              <span className="text-lg font-bold text-white" id="last-price">
                ---
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">24h Change:</span>
              <span className="text-sm font-semibold text-green-500" id="price-change">
                ---
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">24h High:</span>
              <span className="text-sm text-white" id="high-price">
                ---
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">24h Low:</span>
              <span className="text-sm text-white" id="low-price">
                ---
              </span>
            </div>
          </div>

          {/* WebSocket Connection Status */}
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-gray-400">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTradingChart;