// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, Globe, Bitcoin, Zap, BarChart3, Users, Award, Activity } from 'lucide-react';

const Home = () => {
  const stats = [
    { label: 'Volume 24h', value: '$2.4B', change: '+12.5%', icon: Activity },
    { label: 'Usuários Ativos', value: '125K+', change: '+8.2%', icon: Users },
    { label: 'Total Investido', value: '$8.1B', change: '+15.3%', icon: BarChart3 },
  ];

  const features = [
    { 
      icon: TrendingUp, 
      title: 'Investimentos Inteligentes', 
      description: 'Estratégias de investimento com IA para máximos retornos',
      color: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      icon: Shield, 
      title: 'Segurança Bancária', 
      description: 'Seus ativos protegidos com segurança de nível empresarial',
      color: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    { 
      icon: Globe, 
      title: 'Acesso Global', 
      description: 'Invista de qualquer lugar do mundo, 24/7',
      color: 'from-green-500 to-green-600',
      bgLight: 'bg-green-50',
      textColor: 'text-green-600'
    },
  ];

  const cryptocurrencies = [
    { 
      name: 'Bitcoin', 
      symbol: 'BTC', 
      price: '$52.345', 
      change: '+5.2%', 
      icon: Bitcoin,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
      graph: [40, 45, 42, 48, 52, 55, 58]
    },
    { 
      name: 'Ethereum', 
      symbol: 'ETH', 
      price: '$3.234', 
      change: '+3.8%', 
      icon: TrendingUp,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      graph: [30, 35, 38, 42, 45, 48, 52]
    },
    { 
      name: 'Litecoin', 
      symbol: 'LTC', 
      price: '$189', 
      change: '-1.2%', 
      icon: Zap,
      color: 'text-gray-500',
      bg: 'bg-gray-50',
      graph: [25, 28, 26, 24, 22, 20, 19]
    },
    { 
      name: 'Ripple', 
      symbol: 'XRP', 
      price: '$0.89', 
      change: '+2.1%', 
      icon: Activity,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50',
      graph: [15, 18, 20, 22, 24, 26, 28]
    },
  ];

  const testimonials = [
    {
      name: 'Ana Souza',
      role: 'Investidora Crypto',
      content: 'A Ouro Invest transformou como invisto em criptomoedas. Os retornos são impressionantes e a plataforma é incrivelmente fácil de usar.',
      rating: 5,
      avatar: 'AS'
    },
    {
      name: 'Carlos Mendes',
      role: 'Day Trader',
      content: 'Melhor plataforma de investimento que já usei. Os recursos de segurança me dão tranquilidade ao negociar grandes volumes.',
      rating: 5,
      avatar: 'CM'
    },
    {
      name: 'Juliana Santos',
      role: 'Investidora de Longo Prazo',
      content: 'As estratégias com IA superam consistentemente minhas negociações manuais. Altamente recomendado!',
      rating: 5,
      avatar: 'JS'
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }} />
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
          <div className="text-center text-white">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></span>
              <span className="text-sm font-medium">Dados de Mercado Ao Vivo • Atualizados em Tempo Real</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Invista no Futuro dos
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                Ativos Digitais
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 text-gray-100 max-w-2xl mx-auto opacity-90">
              Junte-se a mais de 125.000 investidores que confiam na Ouro Invest para sua jornada de investimentos em cripto
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="group bg-white text-blue-600 font-semibold py-4 px-8 rounded-xl hover:bg-gray-100 transition-all hover:scale-105 hover:shadow-2xl flex items-center justify-center"
              >
                Comece Agora
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/login" 
                className="bg-white/10 backdrop-blur-sm text-white font-semibold py-4 px-8 rounded-xl hover:bg-white/20 transition-all border border-white/30"
              >
                Entrar
              </Link>
            </div>

            {/* Floating stats */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="w-5 h-5 text-white/80" />
                      <span className={`text-sm font-semibold ${
                        stat.change.startsWith('+') ? 'text-green-300' : 'text-red-300'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-white/70">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Curved bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Stats Section - Modern Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Crescimento da Plataforma</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Confiado por investidores mundialmente com bilhões em ativos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index} 
                  className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                >
                  {/* Background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                    <p className="text-lg text-gray-600 mb-4">{stat.label}</p>
                    
                    <div className="flex items-center">
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        stat.change.startsWith('+') 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {stat.change} este mês
                      </span>
                    </div>

                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-2xl group-hover:opacity-30 transition-opacity" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cryptocurrency Prices - Glassmorphism Cards */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ativos Populares</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Negocie as principais criptomoedas com taxas competitivas
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cryptocurrencies.map((crypto, index) => {
              const Icon = crypto.icon;
              return (
                <div 
                  key={index} 
                  className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${crypto.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                        <Icon className={`w-6 h-6 ${crypto.color}`} />
                      </div>
                      <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                        crypto.change.startsWith('+') 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {crypto.change}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{crypto.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{crypto.symbol}</p>
                    
                    {/* Price */}
                    <div className="flex items-end justify-between mb-4">
                      <span className="text-2xl font-bold text-gray-900">{crypto.price}</span>
                      <span className="text-sm text-gray-400">24h</span>
                    </div>

                    {/* Mini Chart */}
                    <div className="flex items-end space-x-1 h-12">
                      {crypto.graph.map((height, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-t-lg transition-all duration-300 group-hover:scale-y-110 ${
                            crypto.change.startsWith('+') 
                              ? 'bg-green-400 group-hover:bg-green-500' 
                              : 'bg-red-400 group-hover:bg-red-500'
                          }`}
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>

                    {/* Trade button on hover */}
                    <button className="absolute bottom-6 right-6 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 hover:bg-blue-700">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section - Modern Cards with Icons */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Por que Escolher a Ouro Invest?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experimente a próxima geração de investimentos em cripto
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index} 
                  className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden"
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Icon with gradient */}
                  <div className={`relative w-16 h-16 ${feature.bgLight} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className={`w-8 h-8 ${feature.textColor}`} />
                  </div>

                  {/* Decorative circle */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} rounded-full opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`} />

                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Learn more link */}
                  <div className="mt-6 flex items-center text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span>Saiba mais</span>
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">O Que Nossos Usuários Dizem</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Junte-se a milhares de investidores satisfeitos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
              >
                {/* Quote mOuro Invest */}
                <div className="text-6xl font-serif text-blue-200 mb-4">"</div>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {testimonial.content}
                </p>

                {/* Rating */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>

                {/* User info */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Modern Card */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 shadow-2xl overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }} />

            <div className="relative text-center text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Pronto para Começar Sua Jornada de Investimentos?
              </h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                Junte-se a milhares de investidores que confiam na Ouro Invest para seus investimentos em cripto e comece a ganhar hoje
              </p>
              
              <Link 
                to="/register" 
                className="group inline-flex items-center bg-white text-blue-600 font-semibold py-4 px-10 rounded-xl hover:bg-gray-100 transition-all hover:scale-105 hover:shadow-2xl text-lg"
              >
                Criar Conta Grátis
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <p className="text-sm text-white/80 mt-6">
                Cartão de crédito não necessário • Conta gratuita • Suporte 24/7
              </p>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;