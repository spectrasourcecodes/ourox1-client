// src/pages/KycReceipts.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FileText, Download, User, DollarSign, Calendar, CreditCard, X, Shield, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

const KycReceipts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receiptType, setReceiptType] = useState('pending'); // 'pending' or 'success'
  const [isLoading, setIsLoading] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    clientName: '',
    clientDoc: '',
    amount: '280.00',
    invoiceNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'PIX',
    paymentDate: new Date().toISOString().split('T')[0],
  });
  
  // Generated receipts HTML
  const [pendingHTML, setPendingHTML] = useState('');
  const [successHTML, setSuccessHTML] = useState('');
  
  // Refs for preview iframes (optional)
  const pendingIframeRef = useRef(null);
  const successIframeRef = useRef(null);

  // Generate invoice number on mount
  useEffect(() => {
    const generateInvoiceNumber = () => {
      const year = new Date().getFullYear();
      const random = Math.floor(Math.random() * 900 + 100);
      return `INV-${year}-${random}`;
    };
    setFormData(prev => ({
      ...prev,
      invoiceNumber: generateInvoiceNumber()
    }));
    
    // Load default receipts
    generateDefaultReceipts();
  }, []);

  const generateDefaultReceipts = () => {
    const defaultData = {
      clientName: 'Elivaido Neves dos Santos',
      clientDoc: '***.123.456-**',
      amount: '280.00',
      invoiceNumber: 'INV-2026-046',
      issueDate: '2026-03-24',
      paymentMethod: 'PIX',
      paymentDate: '2026-03-24'
    };
    setPendingHTML(generatePendingReceipt(defaultData));
    setSuccessHTML(generateSuccessReceipt(defaultData));
  };

  const generatePendingReceipt = (data) => {
    return `<!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Fatura Pendente - ARK Investment</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                background: #f2f4f8;
                font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
                margin: 0;
                padding: 40px 20px;
            }
            .invoice {
                max-width: 820px;
                margin: 0 auto;
                background: #fff;
                padding: 40px;
                border-radius: 16px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.08);
            }
            .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #eef2f7; padding-bottom: 24px; margin-bottom: 16px; flex-wrap: wrap; gap: 16px; }
            .logo { font-size: 40px; font-weight: 800; color: #0a3cff; letter-spacing: -0.5px; }
            .logo span { color: #1bbf6b; }
            .company-details { text-align: right; font-size: 14px; color: #4a5568; }
            .company-details strong { font-size: 15px; color: #1a2c3e; display: block; }
            h1 { color: #0a3cff; font-size: 28px; margin: 24px 0 20px 0; font-weight: 600; }
            .meta { display: flex; justify-content: space-between; background: #f8fafc; padding: 16px 20px; border-radius: 12px; margin: 16px 0 24px 0; flex-wrap: wrap; gap: 12px; }
            .meta div { font-size: 14px; }
            .meta strong { font-weight: 600; color: #1e293b; }
            .section { margin-top: 28px; }
            .section-title { font-weight: 700; color: #0a3cff; border-left: 4px solid #0a3cff; padding-left: 12px; margin-bottom: 16px; font-size: 18px; }
            .client-info { background: #f9f9fc; padding: 12px 16px; border-radius: 10px; font-size: 15px; }
            .client-info strong { color: #1e293b; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; border-radius: 12px; overflow: hidden; }
            th, td { border: 1px solid #e2e8f0; padding: 12px 16px; text-align: left; }
            th { background: #f1f5f9; font-weight: 600; color: #1e2a3e; }
            .total { text-align: right; font-size: 22px; font-weight: 800; margin-top: 20px; padding-top: 16px; border-top: 2px solid #eef2f7; color: #0f172a; }
            .status { margin-top: 12px; font-weight: 700; color: #d9534f; background: #fff5f5; display: inline-block; padding: 6px 14px; border-radius: 30px; font-size: 14px; }
            .notice { margin-top: 32px; background: #fffbeb; padding: 18px 20px; border-left: 5px solid #f59e0b; border-radius: 12px; font-size: 14px; color: #78350f; }
            .footer { text-align: center; margin-top: 48px; font-size: 12px; color: #94a3b8; border-top: 1px solid #eef2f7; padding-top: 24px; }
            @media (max-width: 600px) {
                .invoice { padding: 24px; }
                .header { flex-direction: column; align-items: flex-start; }
                .company-details { text-align: left; }
                .meta { flex-direction: column; }
                th, td { padding: 8px; }
            }
        </style>
    </head>
    <body>
    <div class="invoice">
        <div class="header">
            <div class="logo">ARK<span>INVEST</span></div>
            <div class="company-details">
                <strong>ARK Investment</strong>
                Empresa de Investimentos em Criptomoedas<br>
                CNPJ: 00.000.000/0001-00
            </div>
        </div>
        <h1>FATURA PENDENTE</h1>
        <div class="meta">
            <div><strong>Nº da Fatura:</strong> ${data.invoiceNumber}</div>
            <div><strong>Data de Emissão:</strong> ${data.issueDate}</div>
            <div><strong>Vencimento:</strong> ${data.issueDate}</div>
        </div>
        <div class="section">
            <div class="section-title">Faturado Para</div>
            <div class="client-info">
                <strong>Cliente:</strong> ${data.clientName}
                ${data.clientDoc ? `<br><strong>Documento:</strong> ${data.clientDoc}` : ''}
            </div>
        </div>
        <div class="section">
            <div class="section-title">Detalhes da Transação</div>
            <table>
                <thead>
                    <tr><th>Descrição</th><th>Qtd</th><th>Preço Unit.</th><th>Total</th></tr>
                </thead>
                <tbody>
                    <tr><td>Ativação de Código KYC (verificação de identidade)</td><td>1</td><td>R$ ${data.amount}</td><td>R$ ${data.amount}</td></tr>
                </tbody>
            </table>
            <div class="total">Total a Pagar: R$ ${data.amount}</div>
            <div class="status">⏳ Status: PENDENTE</div>
        </div>
        <div class="notice">
            <strong>⚠️ Atenção:</strong> Esta fatura encontra-se pendente de pagamento. 
            Seu saque e funcionalidades da conta serão ativados somente após a confirmação do pagamento.
        </div>
        <div class="footer">
            © 2026 ARK Investment — Todos os direitos reservados.<br>
            Este documento é uma fatura comercial e não requer assinatura.
        </div>
    </div>
    </body>
    </html>`;
  };

  const generateSuccessReceipt = (data) => {
    return `<!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Recibo de Pagamento - ARK Investment</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                background: #f2f4f8;
                font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
                margin: 0;
                padding: 40px 20px;
            }
            .receipt {
                max-width: 820px;
                margin: 0 auto;
                background: #ffffff;
                padding: 40px;
                border-radius: 16px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.08);
            }
            .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #eef2f7; padding-bottom: 24px; margin-bottom: 16px; flex-wrap: wrap; gap: 16px; }
            .logo { font-size: 40px; font-weight: 800; color: #0a3cff; letter-spacing: -0.5px; }
            .logo span { color: #1bbf6b; }
            .company-details { text-align: right; font-size: 14px; color: #4a5568; }
            .company-details strong { font-size: 15px; color: #1a2c3e; display: block; }
            h1 { color: #1bbf6b; font-size: 28px; margin: 24px 0 20px 0; font-weight: 600; }
            .meta-row { display: flex; justify-content: space-between; background: #f8fafc; padding: 16px 20px; border-radius: 12px; margin: 16px 0 24px 0; flex-wrap: wrap; gap: 12px; }
            .meta-row div { font-size: 14px; }
            .meta-row strong { font-weight: 600; color: #1e293b; }
            .section { margin-top: 28px; }
            .section-title { font-weight: 700; color: #0a3cff; border-left: 4px solid #0a3cff; padding-left: 12px; margin-bottom: 16px; font-size: 18px; }
            .info-card { background: #f9f9fc; padding: 16px 20px; border-radius: 12px; }
            .info-row { display: flex; margin-bottom: 12px; flex-wrap: wrap; }
            .info-label { font-weight: 600; width: 140px; color: #334155; }
            .info-value { color: #0f172a; }
            .amount-box { background: #e6f7ec; border-radius: 12px; padding: 16px 20px; margin-top: 8px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; }
            .amount-label { font-weight: 600; font-size: 16px; color: #166534; }
            .amount-value { font-size: 28px; font-weight: 800; color: #1bbf6b; }
            .status-success { margin-top: 12px; font-weight: 700; color: #2b6e3b; background: #e6f7ec; display: inline-block; padding: 6px 14px; border-radius: 30px; font-size: 14px; }
            .declaration { margin-top: 32px; line-height: 1.6; background: #fefce8; padding: 18px 20px; border-radius: 12px; font-size: 14px; color: #854d0e; }
            .signature { margin-top: 40px; display: flex; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
            .signature div { flex: 1; border-top: 1px solid #cbd5e1; padding-top: 12px; text-align: center; font-size: 13px; color: #475569; min-width: 180px; }
            .footer { text-align: center; margin-top: 48px; font-size: 12px; color: #94a3b8; border-top: 1px solid #eef2f7; padding-top: 24px; }
            @media (max-width: 600px) {
                .receipt { padding: 24px; }
                .header { flex-direction: column; align-items: flex-start; }
                .company-details { text-align: left; }
                .meta-row { flex-direction: column; }
                .info-row { flex-direction: column; margin-bottom: 8px; }
                .info-label { width: auto; margin-bottom: 4px; }
            }
        </style>
    </head>
    <body>
    <div class="receipt">
        <div class="header">
            <div class="logo">ARK<span>INVEST</span></div>
            <div class="company-details">
                <strong>ARK Investment</strong>
                Empresa de Investimentos em Criptomoedas<br>
                CNPJ: 00.000.000/0001-00
            </div>
        </div>
        <h1>✅ RECIBO DE PAGAMENTO</h1>
        <div class="meta-row">
            <div><strong>Número do Recibo:</strong> RCP-${data.invoiceNumber}</div>
            <div><strong>Data de Pagamento:</strong> ${data.paymentDate || data.issueDate}</div>
            <div><strong>Fatura Referente:</strong> ${data.invoiceNumber}</div>
        </div>
        <div class="section">
            <div class="section-title">Dados do Cliente</div>
            <div class="info-card">
                <div class="info-row"><span class="info-label">Nome Completo:</span><span class="info-value">${data.clientName}</span></div>
                ${data.clientDoc ? `<div class="info-row"><span class="info-label">Documento:</span><span class="info-value">${data.clientDoc}</span></div>` : ''}
            </div>
        </div>
        <div class="section">
            <div class="section-title">Detalhes do Pagamento</div>
            <div class="info-card">
                <div class="info-row"><span class="info-label">Finalidade:</span><span class="info-value">Compra e ativação de Código KYC</span></div>
                <div class="info-row"><span class="info-label">Forma de Pagamento:</span><span class="info-value">${data.paymentMethod || 'PIX'}</span></div>
                <div class="info-row"><span class="info-label">Status:</span><span class="info-value" style="color:#1bbf6b; font-weight:600;">Confirmado / Pago</span></div>
            </div>
            <div class="amount-box">
                <span class="amount-label">Valor Pago:</span>
                <span class="amount-value">R$ ${data.amount}</span>
            </div>
            <div class="status-success">✔️ Pagamento aprovado com sucesso</div>
        </div>
        <div class="declaration">
            <strong>📄 Declaração Oficial:</strong> A <strong>ARK Investment</strong> declara que recebeu o valor acima descrito referente à 
            <strong>Esta é sua confirmação oficial de pagamento. Sua conta está agora totalmente desbloqueada para saques e negociações. Compre o token pin para desbloquear todo o seu lucro.</strong>. Sua conta está totalmente desbloqueada para saques e operações.
        </div>
        <div class="signature">
            <div>Assinatura da Empresa<br><strong>ARK Investment</strong></div>
            <div>Responsável Financeiro<br><strong>Cathie Wood</strong></div>
        </div>
        <div class="footer">
            © 2026 ARK Investment — Todos os direitos reservados.<br>
            Comprovante emitido eletronicamente e válido em todo território nacional.
        </div>
    </div>
    </body>
    </html>`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (type) => {
    setReceiptType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Reset form to default values
    setFormData(prev => ({
      ...prev,
      clientName: '',
      clientDoc: '',
      amount: '280.00',
      paymentMethod: 'PIX',
      paymentDate: new Date().toISOString().split('T')[0],
    }));
  };

  const generateReceipts = () => {
    if (!formData.clientName.trim()) {
      toast.error('Por favor, insira o nome do cliente.');
      return;
    }

    setIsLoading(true);
    
    // Generate both receipts
    const newPendingHTML = generatePendingReceipt(formData);
    const newSuccessHTML = generateSuccessReceipt(formData);
    
    setPendingHTML(newPendingHTML);
    setSuccessHTML(newSuccessHTML);
    
    setTimeout(() => {
      setIsLoading(false);
      closeModal();
      toast.success(`Recibos gerados para ${formData.clientName}!`);
    }, 500);
  };

  const downloadReceipt = (type) => {
    let htmlContent = '';
    let filename = '';
    
    if (type === 'pending') {
      if (!pendingHTML) {
        toast.error('Primeiro gere um recibo.');
        return;
      }
      htmlContent = pendingHTML;
      const clientName = formData.clientName || 'cliente';
      filename = `fatura_pendente_${clientName.replace(/\s/g, '_')}.html`;
    } else {
      if (!successHTML) {
        toast.error('Primeiro gere um recibo.');
        return;
      }
      htmlContent = successHTML;
      const clientName = formData.clientName || 'cliente';
      filename = `recibo_pago_${clientName.replace(/\s/g, '_')}.html`;
    }
    
    // Create download link
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    
    toast.success(`${filename} baixado!`);
  };

  // Render preview using iframe for safe HTML rendering
  const renderPreview = (htmlContent, ref) => {
    return (
      <iframe
        ref={ref}
        srcDoc={htmlContent}
        title="Receipt Preview"
        className="w-full h-[500px] border-0 rounded-lg"
        sandbox="allow-same-origin allow-scripts"
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FileText className="text-blue-600" />
          Gerador de Recibos KYC
        </h1>
        <p className="text-gray-500 mt-1">Crie faturas pendentes e recibos de pagamento para seus clientes</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => openModal('pending')}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
        >
          <FileText size={20} />
          Gerar Fatura PENDENTE
        </button>
        <button
          onClick={() => openModal('success')}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
        >
          <CreditCard size={20} />
          Gerar Recibo PAGO
        </button>
      </div>

      {/* Receipts Preview Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Receipt Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-red-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <FileText size={20} />
                <h2 className="font-semibold text-lg">Fatura Pendente</h2>
              </div>
              <button
                onClick={() => downloadReceipt('pending')}
                className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 rounded-lg font-medium hover:bg-gray-100 transition-all"
              >
                <Download size={18} />
                Baixar
              </button>
            </div>
          </div>
          <div className="p-4 bg-gray-50">
            {renderPreview(pendingHTML, pendingIframeRef)}
          </div>
        </div>

        {/* Success Receipt Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-green-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <CreditCard size={20} />
                <h2 className="font-semibold text-lg">Recibo de Pagamento</h2>
              </div>
              <button
                onClick={() => downloadReceipt('success')}
                className="flex items-center gap-2 px-4 py-2 bg-white text-green-600 rounded-lg font-medium hover:bg-gray-100 transition-all"
              >
                <Download size={18} />
                Baixar
              </button>
            </div>
          </div>
          <div className="p-4 bg-gray-50">
            {renderPreview(successHTML, successIframeRef)}
          </div>
        </div>
      </div>

      {/* Modal for Client Details */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                {receiptType === 'pending' ? '📝 Dados da Fatura Pendente' : '✅ Dados do Recibo de Pagamento'}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded-full transition"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); generateReceipts(); }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Nome Completo do Cliente *
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleInputChange}
                        placeholder="Ex: Elivaido Neves dos Santos"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Documento (CPF/CNPJ)
                    </label>
                    <input
                      type="text"
                      name="clientDoc"
                      value={formData.clientDoc}
                      onChange={handleInputChange}
                      placeholder="***.123.456-**"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      <DollarSign size={16} className="inline mr-1" />
                      Valor (R$)
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Número da Fatura
                    </label>
                    <input
                      type="text"
                      name="invoiceNumber"
                      value={formData.invoiceNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      <Calendar size={16} className="inline mr-1" />
                      Data de Emissão
                    </label>
                    <input
                      type="date"
                      name="issueDate"
                      value={formData.issueDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  
                  {receiptType === 'success' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Forma de Pagamento
                        </label>
                        <select
                          name="paymentMethod"
                          value={formData.paymentMethod}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                          <option value="PIX">PIX</option>
                          <option value="Transferência Bancária">Transferência Bancária</option>
                          <option value="Cartão de Crédito">Cartão de Crédito</option>
                          <option value="Criptomoeda">Criptomoeda</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Data de Pagamento
                        </label>
                        <input
                          type="date"
                          name="paymentDate"
                          value={formData.paymentDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                    <Shield size={16} className="inline mr-2" />
                    Os recibos serão gerados com os dados informados para ativação do código KYC.
                  </div>
                </div>
                
                <div className="mt-6 flex gap-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {isLoading ? (
                      <RefreshCw size={20} className="animate-spin mx-auto" />
                    ) : (
                      'Gerar Recibos'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Security Footer */}
      <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
        <Shield size={16} />
        Sistema seguro e verificado | ARK Investment
      </div>
    </div>
  );
};

export default KycReceipts;