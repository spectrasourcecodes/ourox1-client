// src/pages/KYC.jsx
import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle, Clock, XCircle, X, Send, AlertCircle, Shield, Lock, User, Mail, Calendar, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const KYC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, kycStatus, setKycStatus } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    dateOfBirth: '',
    documentType: 'passport',
    documentNumber: '',
    country: '',
  });

  const [documentFile, setDocumentFile] = useState(null);

  // Estado do modal e verificação
  const [showModal, setShowModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Buscar códigos KYC do ambiente
  const getKycCodes = () => {
    const codesString = import.meta.env.VITE_KYC_CODES || '';
    return codesString.split(',').map(code => code.trim()).filter(code => code.length > 0);
  };

  const KYC_CODES = getKycCodes();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setLoading(false);
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('O arquivo deve ter no máximo 5MB');
        return;
      }
      
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('Formato inválido. Use JPG, PNG ou PDF');
        return;
      }
      
      setDocumentFile(file);
      toast.success('Documento enviado com sucesso!');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = ['fullName', 'email', 'dateOfBirth', 'documentNumber', 'country'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (!documentFile) {
      toast.error('Por favor, envie uma foto do seu documento');
      return;
    }

    if (typeof setKycStatus !== 'function') {
      console.error('setKycStatus is not a function!');
      toast.error('Erro interno. Por favor, recarregue a página.');
      return;
    }

    if (kycStatus === 'pending') {
      setShowModal(true);
      return;
    }

    if (kycStatus === 'approved') {
      toast.info('Seu KYC já está verificado!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      setKycStatus('pending');
      
      setTimeout(() => {
        setIsSubmitting(false);
        setShowModal(true);
        toast.success('Documentos enviados com sucesso! Insira o código de verificação.');
      }, 800);
    } catch (error) {
      console.error('Error submitting KYC:', error);
      setIsSubmitting(false);
      toast.error('Erro ao enviar documentos. Tente novamente.');
    }
  };

  const handleVerifyCode = () => {
    const code = verificationCode.trim();
    if (!code) {
      setErrorMessage('Por favor, insira o código de verificação');
      return;
    }

    if (typeof setKycStatus !== 'function') {
      console.error('setKycStatus is not a function!');
      toast.error('Erro interno. Por favor, recarregue a página.');
      return;
    }

    setIsVerifying(true);
    setErrorMessage('');

    setTimeout(() => {
      if (KYC_CODES.includes(code)) {
        setKycStatus('approved');
        toast.success('Verificação KYC concluída com sucesso! 🎉');
        setShowModal(false);
        setVerificationCode('');
        setAttempts(0);
        setErrorMessage('');
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          setErrorMessage('Código inválido. Você excedeu o número máximo de tentativas.');
          toast.error('Muitas tentativas falhas. Clique em "Enviar Documentos KYC" para recomeçar.');
          setAttempts(0);
          setShowModal(false);
          setKycStatus('rejected');
          setVerificationCode('');
        } else {
          setErrorMessage(`Código inválido. ${3 - newAttempts} tentativa(s) restante(s).`);
          setVerificationCode('');
        }
      }
      setIsVerifying(false);
    }, 1000);
  };

  const getStatusBadge = () => {
    switch (kycStatus) {
      case 'approved':
        return (
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">Verificado</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg">
            <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">Rejeitado – envie novamente</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">Aguardando Código</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2 text-gray-600 bg-gray-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">Não Verificado</span>
          </div>
        );
    }
  };

  const isSubmitDisabled = kycStatus === 'approved' || isSubmitting;

  const openVerificationModal = () => {
    if (kycStatus === 'pending') {
      setShowModal(true);
    } else if (kycStatus === 'approved') {
      toast.info('Seu KYC já está verificado!');
    } else {
      toast.info('Envie os documentos primeiro para obter o código de verificação.');
    }
  };

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Verificação KYC
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Verifique sua identidade para desbloquear todos os recursos
              </p>
            </div>
            {getStatusBadge()}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Informações Pessoais */}
            <div>
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Informações Pessoais</h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                      placeholder="João Silva"
                      required
                      disabled={kycStatus === 'approved'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    E-mail <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                      placeholder="voce@exemplo.com"
                      required
                      disabled={kycStatus === 'approved'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Data de Nascimento <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                      required
                      disabled={kycStatus === 'approved'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    País <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                      placeholder="Brasil"
                      required
                      disabled={kycStatus === 'approved'}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tipo de Documento */}
            <div>
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Documento de Identidade</h2>
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                {[
                  { type: 'passport', label: 'Passaporte' },
                  { type: 'id_card', label: 'RG / CNH' },
                  { type: 'drivers_license', label: 'Carteira de Motorista' },
                ].map((doc) => (
                  <button
                    key={doc.type}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, documentType: doc.type }))}
                    className={`p-2 sm:p-3 rounded-xl border-2 transition-all duration-300 text-center text-xs sm:text-sm
                      ${formData.documentType === doc.type 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'}
                      ${kycStatus === 'approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={kycStatus === 'approved'}
                  >
                    <span>{doc.label}</span>
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Número do Documento <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="documentNumber"
                  value={formData.documentNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                  placeholder="Digite o número do documento"
                  required
                  disabled={kycStatus === 'approved'}
                />
              </div>
            </div>

            {/* Upload do Documento */}
            <div>
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Enviar Documento</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Foto do Documento (frente) <span className="text-red-500">*</span>
                </label>
                <div className={`border-2 border-dashed border-gray-300 rounded-xl p-6 sm:p-8 text-center transition-colors ${kycStatus === 'approved' ? 'opacity-50' : 'hover:border-blue-400'}`}>
                  <input
                    type="file"
                    id="document"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={kycStatus === 'approved'}
                  />
                  <label
                    htmlFor="document"
                    className={`cursor-pointer flex flex-col items-center ${kycStatus === 'approved' ? 'cursor-not-allowed' : ''}`}
                  >
                    <Upload className={`w-8 h-8 sm:w-10 sm:h-10 ${documentFile ? 'text-green-500' : 'text-gray-400'} mb-2 transition-colors`} />
                    <span className="text-sm sm:text-base text-gray-600">
                      {documentFile ? (
                        <span className="text-green-600 font-medium">✓ {documentFile.name}</span>
                      ) : (
                        'Clique para enviar a foto do documento'
                      )}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      JPG, PNG ou PDF (máx. 5MB)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Status Messages */}
            {kycStatus === 'pending' && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 rounded-lg">
                <div className="flex items-start">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Aguardando Código de Verificação</p>
                    <p className="text-xs sm:text-sm text-yellow-700 mt-1">
                      Seus documentos foram enviados. Insira o código de verificação fornecido pelo suporte.
                    </p>
                    <button
                      type="button"
                      onClick={openVerificationModal}
                      className="mt-2 text-xs sm:text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
                    >
                      Inserir Código Agora →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {kycStatus === 'rejected' && (
              <div className="bg-red-50 border-l-4 border-red-400 p-3 sm:p-4 rounded-lg">
                <div className="flex items-start">
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Verificação Rejeitada</p>
                    <p className="text-xs sm:text-sm text-red-700 mt-1">
                      Sua verificação foi rejeitada. Por favor, envie novamente.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {kycStatus === 'approved' && (
              <div className="bg-green-50 border-l-4 border-green-400 p-3 sm:p-4 rounded-lg">
                <div className="flex items-start">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Verificação Aprovada! ✅</p>
                    <p className="text-xs sm:text-sm text-green-700 mt-1">
                      Sua identidade foi verificada com sucesso. Todos os recursos estão desbloqueados.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Botão de Envio */}
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2.5 sm:py-3 px-6 rounded-xl transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner />
                  Enviando...
                </>
              ) : kycStatus === 'approved' ? (
                '✅ Já Verificado'
              ) : kycStatus === 'pending' ? (
                '🔑 Inserir Código de Verificação'
              ) : (
                '📤 Enviar Documentos KYC'
              )}
            </button>

            <p className="text-[10px] sm:text-xs text-gray-500 text-center">
              Suas informações e documentos são criptografados com segurança e serão usados apenas para fins de verificação.
            </p>
          </form>
        </div>

        {/* Modal de Código de Verificação KYC */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-md mx-4 shadow-2xl">
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Verificação KYC</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Insira o código de verificação fornecido pela nossa equipe de suporte para concluir a verificação.
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                </button>
              </div>

              <div className="my-3 sm:my-4">
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Código de Verificação
                </label>
                <input
                  id="verificationCode"
                  type="text"
                  placeholder="Digite o código de 6 dígitos"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border ${errorMessage ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base`}
                  autoFocus
                />
                {errorMessage && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-xs sm:text-sm">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
                {attempts > 0 && attempts < 3 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Tentativas restantes: {3 - attempts}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={handleVerifyCode}
                  disabled={isVerifying || attempts >= 3}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {isVerifying ? (
                    <>
                      <LoadingSpinner />
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
                  onClick={() => setShowModal(false)}
                  className="px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Cancelar
                </button>
              </div>

              {attempts >= 3 && (
                <div className="mt-3 p-3 bg-red-50 rounded-lg">
                  <p className="text-center text-xs sm:text-sm text-red-600">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1" />
                    Muitas tentativas falhas. Clique em "Enviar Documentos KYC" para recomeçar.
                  </p>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KYC;