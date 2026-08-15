// src/pages/admin/Users.jsx
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Edit,
  Trash2,
  Shield,
  Mail,
  Phone,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  RefreshCw,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axios';

const AdminUsers = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [wallets, setWallets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Wallet update form state
  const [walletForm, setWalletForm] = useState({
    balance: 0,
    profit: 0,
    kyc: false
  });

  const fetchWallets = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      
      const { data } = await axiosInstance.get("/api/admin/users");
      setWallets(data.wallets || []);

      if (showToast) toast.success("Users list updated");
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const handleViewWallet = (wallet) => {
    setSelectedWallet(wallet);
    setIsViewModalOpen(true);
  };

  const handleEditWallet = (wallet) => {
    setSelectedWallet(wallet);
    setWalletForm({
      balance: wallet.balance || 0,
      profit: wallet.profit || 0,
      kyc: wallet.kyc || false
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateWallet = async (e) => {
    e.preventDefault();
    
    try {
      const { data } = await axiosInstance.put(`/api/admin/wallets/${selectedWallet._id}`, walletForm);
      
      toast.success(data.message || "Wallet updated successfully");
      fetchWallets(true);
      setIsEditModalOpen(false);
      setSelectedWallet(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleToggleKYC = async (walletId, currentStatus) => {
    try {
      const { data } = await axiosInstance.put(`/api/admin/wallets/${walletId}/kyc`, {
        kyc: !currentStatus
      });
      toast.success(data.message || `KYC ${!currentStatus ? 'approved' : 'rejected'}`);
      fetchWallets();
    } catch (err) {
      toast.error("Failed to update KYC status");
    }
  };

  // Filter wallets based on search
  const filteredWallets = wallets.filter(wallet => {
    const user = wallet.user || {};
    return (
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm) ||
      user.country?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentWallets = filteredWallets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredWallets.length / itemsPerPage);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 text-sm mt-1">
              Total Users: {wallets.length} | Total Balance: {formatCurrency(wallets.reduce((sum, w) => sum + (w.balance || 0), 0))}
            </p>
          </div>
          <button
            onClick={() => fetchWallets(true)}
            disabled={refreshing}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">KYC</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentWallets.map((wallet) => {
                  const user = wallet.user || {};
                  return (
                    <tr key={wallet._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.fullName?.charAt(0) || 'U'}
                          </div>
                          <div className="ml-3">
                            <div className="font-medium text-gray-900">{user.fullName || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">{user.email || 'No email'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {user.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            {user.phone}
                          </div>
                        )}
                        {user.country && (
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                            {user.country}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{formatCurrency(wallet.balance)}</div>
                          <div className={`text-xs ${wallet.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            Profit: {wallet.profit >= 0 ? '+' : ''}{formatCurrency(wallet.profit)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {wallet.kyc ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <XCircle className="w-3 h-3 mr-1" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleToggleKYC(wallet._id, wallet.kyc)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            title={wallet.kyc ? 'Revoke KYC' : 'Approve KYC'}
                          >
                            <Shield className={`w-4 h-4 ${wallet.kyc ? 'text-green-600' : 'text-gray-400'}`} />
                          </button>
                          <button
                            onClick={() => handleEditWallet(wallet)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            title="Edit Wallet"
                          >
                            <Edit className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleViewWallet(wallet)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredWallets.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No users found</p>
            </div>
          )}

          {/* Pagination */}
          {filteredWallets.length > 0 && (
            <div className="px-6 py-4 border-t flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredWallets.length)} of {filteredWallets.length}
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-sm">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Wallet Modal */}
      {isViewModalOpen && selectedWallet && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsViewModalOpen(false)} />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">User Details</h3>
                <button onClick={() => setIsViewModalOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {selectedWallet.user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h4 className="font-semibold">{selectedWallet.user?.fullName || 'Unknown'}</h4>
                    <p className="text-sm text-gray-500">{selectedWallet.user?.email || 'No email'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedWallet.user?.phone || 'Not Added'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Country</p>
                    <p className="font-medium">{selectedWallet.user?.country || 'Not Added'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Balance</p>
                    <p className="font-medium text-blue-600">{formatCurrency(selectedWallet.balance)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Profit</p>
                    <p className={`font-medium ${selectedWallet.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedWallet.profit >= 0 ? '+' : ''}{formatCurrency(selectedWallet.profit)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">KYC</p>
                    <p className="font-medium">{selectedWallet.kyc ? 'Verified' : 'Pending'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Joined</p>
                    <p className="font-medium">{formatDate(selectedWallet.user?.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Wallet Modal */}
      {isEditModalOpen && selectedWallet && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsEditModalOpen(false)} />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Update Wallet</h3>
                <button onClick={() => setIsEditModalOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateWallet} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User: {selectedWallet.user?.fullName}
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Balance (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      value={walletForm.balance}
                      onChange={(e) => setWalletForm({...walletForm, balance: parseFloat(e.target.value) || 0})}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profit (USD)</label>
                  <div className="relative">
                    <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      value={walletForm.profit}
                      onChange={(e) => setWalletForm({...walletForm, profit: parseFloat(e.target.value) || 0})}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="kyc"
                    checked={walletForm.kyc}
                    onChange={(e) => setWalletForm({...walletForm, kyc: e.target.checked})}
                    className="w-4 h-4 text-red-600 rounded"
                  />
                  <label htmlFor="kyc" className="text-sm text-gray-700">KYC Approved</label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl"
                  >
                    Update Wallet
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;