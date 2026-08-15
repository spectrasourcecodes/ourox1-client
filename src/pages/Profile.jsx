// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, Bell, Shield } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    twoFactorEnabled: false,
    emailNotifications: false,
    pushNotifications: false,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'security', label: 'Segurança', icon: Lock },
    { id: 'notifications', label: 'Notificações', icon: Bell },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await axiosInstance.get("/api/user/profile");
        
        setProfileData((prev) => ({
          ...prev,
          ...data,
        }));

        // Update user in context if fullName changed
        if (data.fullName && user?.fullName !== data.fullName) {
          updateUser({ ...user, fullName: data.fullName });
        }
      } catch (err) {
        toast.error("Falha ao carregar perfil");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, navigate]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axiosInstance.put("/api/user/profile", {
        fullName: profileData.fullName,
        phone: profileData.phone,
        country: profileData.country,
      });

      if (data.success) {
        toast.success(data.message);
        // Update user in context
        if (user) {
          updateUser({ ...user, fullName: profileData.fullName });
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Falha na atualização";
      toast.error(message);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("As novas senhas não coincidem");
      return;
    }

    try {
      const { data } = await axiosInstance.put("/api/user/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (data.success) {
        toast.success(data.message);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Falha ao atualizar senha";
      toast.error(message);
    }
  };

  const handleTwoFactorToggle = () => {
    setProfileData({
      ...profileData,
      twoFactorEnabled: !profileData.twoFactorEnabled
    });
    toast.info(
      profileData.twoFactorEnabled ? 
      'Autenticação de dois fatores desativada' : 
      'Autenticação de dois fatores ativada'
    );
  };

  const handleNotificationToggle = (type) => {
    if (type === 'email') {
      setProfileData({
        ...profileData,
        emailNotifications: !profileData.emailNotifications
      });
      toast.info(
        profileData.emailNotifications ? 
        'Notificações por e-mail desativadas' : 
        'Notificações por e-mail ativadas'
      );
    } else if (type === 'push') {
      setProfileData({
        ...profileData,
        pushNotifications: !profileData.pushNotifications
      });
      toast.info(
        profileData.pushNotifications ? 
        'Notificações push desativadas' : 
        'Notificações push ativadas'
      );
    }
  };

  const handleSaveNotifications = () => {
    toast.success('Preferências de notificação salvas!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Configurações do Perfil
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Gerencie suas preferências de conta
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
          {/* Sidebar */}
          <div className="md:w-64">
            <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4">
              <div className="flex flex-col space-y-1 sm:space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-3 p-2.5 sm:p-3 rounded-lg transition-all duration-300 text-sm sm:text-base
                        ${activeTab === tab.id 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileUpdate} className="space-y-4 sm:space-y-6">
                  <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Informações Pessoais</h2>
                  
                  <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                      {profileData.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                    </div>
                    <div>
                      <button 
                        type="button" 
                        className="bg-gray-100 text-gray-800 font-semibold py-1.5 sm:py-2 px-3 sm:px-4 rounded-xl hover:bg-gray-200 transition-all text-xs sm:text-sm"
                      >
                        Alterar Avatar
                      </button>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-1">JPG, PNG ou GIF (máx 2MB)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Nome Completo
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                        <input
                          type="text"
                          value={profileData.fullName}
                          onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        E-mail
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                        <input
                          type="email"
                          value={profileData.email}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base bg-gray-50"
                          disabled
                        />
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-1">O e-mail não pode ser alterado</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Telefone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        País
                      </label>
                      <input
                        type="text"
                        value={profileData.country}
                        onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                        placeholder="Brasil"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2.5 sm:py-3 px-6 rounded-xl transition-all hover:scale-105 hover:shadow-xl text-sm sm:text-base"
                  >
                    Salvar Alterações
                  </button>
                </form>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6 sm:space-y-8">
                  <form onSubmit={handlePasswordChange} className="space-y-4 sm:space-y-6">
                    <h2 className="text-lg sm:text-xl font-bold">Alterar Senha</h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Senha Atual
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Nova Senha
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                          required
                          minLength={8}
                        />
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-1">A senha deve ter pelo menos 8 caracteres</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Confirmar Nova Senha
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                          required
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2.5 sm:py-3 px-6 rounded-xl transition-all hover:scale-105 hover:shadow-xl text-sm sm:text-base"
                    >
                      Atualizar Senha
                    </button>
                  </form>

                  <div className="border-t pt-4 sm:pt-6">
                    <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Autenticação de Dois Fatores</h2>
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-sm sm:text-base">Status 2FA</p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {profileData.twoFactorEnabled ? 'Ativado' : 'Desativado'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleTwoFactorToggle}
                        className={`relative inline-flex h-5 w-10 sm:h-6 sm:w-11 items-center rounded-full transition-colors flex-shrink-0
                          ${profileData.twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform
                            ${profileData.twoFactorEnabled ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0.5 sm:translate-x-1'}`}
                        />
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2">
                      {profileData.twoFactorEnabled ? 
                        '2FA está ativado. Sua conta está mais segura.' : 
                        'Ative a autenticação de dois fatores para maior segurança.'}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Preferências de Notificação</h2>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-sm sm:text-base">Notificações por E-mail</p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            Receba atualizações sobre seus investimentos
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleNotificationToggle('email')}
                        className={`relative inline-flex h-5 w-10 sm:h-6 sm:w-11 items-center rounded-full transition-colors flex-shrink-0
                          ${profileData.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'}`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform
                            ${profileData.emailNotifications ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0.5 sm:translate-x-1'}`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-sm sm:text-base">Notificações Push</p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            Receba alertas instantâneos no seu dispositivo
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleNotificationToggle('push')}
                        className={`relative inline-flex h-5 w-10 sm:h-6 sm:w-11 items-center rounded-full transition-colors flex-shrink-0
                          ${profileData.pushNotifications ? 'bg-blue-600' : 'bg-gray-300'}`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform
                            ${profileData.pushNotifications ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0.5 sm:translate-x-1'}`}
                        />
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={handleSaveNotifications}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2.5 sm:py-3 px-6 rounded-xl transition-all hover:scale-105 hover:shadow-xl text-sm sm:text-base"
                  >
                    Salvar Preferências
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;