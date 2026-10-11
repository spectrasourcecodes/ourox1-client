import { useState, useEffect } from 'react';
import { FaSearch, FaWallet, FaSave, FaTimes, FaSpinner, FaEdit, FaShieldAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import API from '../../utils/axios';

const WalletManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletData, setWalletData] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  // ═══════════════════════════════════════════════════════════
  // ✅ FULL FORM STATE — every wallet field
  // ═══════════════════════════════════════════════════════════
  const [walletForm, setWalletForm] = useState({
    // Balances
    balance: '',
    profitBalance: '',
    referralBalance: '',
    totalDeposits: '',
    totalWithdrawals: '',
    pendingDepositAmount: '',
    pendingWithdrawalAmount: '',

    // Crypto addresses
    cryptoBTC: '',
    cryptoETH: '',
    cryptoUSDT: '',
    cryptoBNB: '',
    cryptoTRX: '',

    // Withdrawal settings (top level)
    withdrawalLimit: '',
    thresholdLimit: '',
    minimumWithdrawal: '',
    bypassSecurityCheck: false,

    // IBAN
    ibanFeeAmount: '',
    ibanFeeWalletAddress: '',
    ibanFeeWalletLabel: '',
    ibanFeePaid: false,

    // CCP
    ccpFeeAmount: '',
    ccpFeeWalletAddress: '',
    ccpFeeWalletLabel: '',
    ccpFeePaid: false,

    // Reactivation
    reactivationRequired: true,
    reactivationLocked: false,
    reactivationUnlockCount: '',

    // Transaction stats
    statTotalTransactions: '',
    statTotalDepositCount: '',
    statTotalWithdrawalCount: '',

    // Account tier
    accountTier: 'standard',
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await API.get('/admin/users', {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm
        }
      });
      if (response.data.success) {
        setUsers(response.data.data);
        setPagination(response.data.pagination);
      } else {
        toast.error('Failed to load users');
      }
    } catch (error) {
      console.error('Users fetch error:', error);
      toast.error(error.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  // ✅ Populate the full form from the wallet object
  const populateForm = (data) => {
    const ws = data?.withdrawalSettings || {};
    const iban = ws.iban || {};
    const ccp = ws.ccp || {};
    const react = ws.reactivation || {};
    const stats = data?.transactionStats || {};
    const addrs = data?.cryptoAddresses || {};

    setWalletForm({
      // Balances
      balance: data?.balance ?? '',
      profitBalance: data?.profitBalance ?? '',
      referralBalance: data?.referralBalance ?? '',
      totalDeposits: data?.totalDeposits ?? '',
      totalWithdrawals: data?.totalWithdrawals ?? '',
      pendingDepositAmount: data?.pendingDepositAmount ?? '',
      pendingWithdrawalAmount: data?.pendingWithdrawalAmount ?? '',

      // Crypto addresses
      cryptoBTC: addrs.BTC ?? '',
      cryptoETH: addrs.ETH ?? '',
      cryptoUSDT: addrs.USDT ?? '',
      cryptoBNB: addrs.BNB ?? '',
      cryptoTRX: addrs.TRX ?? '',

      // Withdrawal settings
      withdrawalLimit: ws.withdrawalLimit ?? '',
      thresholdLimit: ws.thresholdLimit ?? '',
      minimumWithdrawal: ws.minimumWithdrawal ?? '',
      bypassSecurityCheck: ws.bypassSecurityCheck ?? false,

      // IBAN
      ibanFeeAmount: iban.feeAmount ?? '',
      ibanFeeWalletAddress: iban.feeWalletAddress ?? '',
      ibanFeeWalletLabel: iban.feeWalletLabel ?? '',
      ibanFeePaid: iban.feePaid ?? false,

      // CCP
      ccpFeeAmount: ccp.feeAmount ?? '',
      ccpFeeWalletAddress: ccp.feeWalletAddress ?? '',
      ccpFeeWalletLabel: ccp.feeWalletLabel ?? '',
      ccpFeePaid: ccp.feePaid ?? false,

      // Reactivation
      reactivationRequired: react.isRequired ?? true,
      reactivationLocked: react.isLocked ?? false,
      reactivationUnlockCount: react.unlockCount ?? '',

      // Transaction stats
      statTotalTransactions: stats.totalTransactions ?? '',
      statTotalDepositCount: stats.totalDepositCount ?? '',
      statTotalWithdrawalCount: stats.totalWithdrawalCount ?? '',

      // Account tier
      accountTier: data?.accountTier ?? 'standard',
    });
  };

  const handleViewWallet = async (userId) => {
    try {
      const userFromList = users.find(u => u._id === userId);
      if (!userFromList) {
        toast.error('User not found');
        return;
      }

      setSelectedUser({
        _id: userFromList._id,
        fullName: userFromList.fullName || userFromList.name || 'Unknown',
        email: userFromList.email || '',
        currency: userFromList.currency || 'USD',
        isActive: userFromList.isActive !== undefined ? userFromList.isActive : true,
      });

      // Fetch wallet
      try {
        const walletResponse = await API.get(`/admin/users/${userId}/wallet`);
        const data = walletResponse.data.data;
        setWalletData(data);
        populateForm(data);
        setShowWalletModal(true);
      } catch (e) {
        if (e.response?.status === 404) {
          toast.loading('Creating wallet...');
          try {
            const createResponse = await API.post(`/admin/users/${userId}/wallet`, {});
            const newWallet = createResponse.data.data;
            setWalletData(newWallet);
            populateForm(newWallet);
            toast.dismiss();
            toast.success('Wallet created successfully');
            setShowWalletModal(true);
          } catch (err) {
            toast.dismiss();
            toast.error('Failed to create wallet');
          }
        } else {
          toast.error('Failed to fetch wallet');
        }
      }
    } catch (error) {
      console.error('View wallet error:', error);
      toast.error('Failed to load user wallet');
    }
  };

  // ✅ Handle both text inputs and checkboxes
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setWalletForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // ✅ Build the full nested payload
  const handleUpdateWallet = async () => {
    if (!selectedUser || !selectedUser._id) {
      toast.error('No user selected');
      return;
    }

    const num = (v) => (v === '' || v === null || v === undefined ? undefined : parseFloat(v));
    const str = (v) => (v === undefined ? undefined : String(v));

    // ─── Build top-level balances ─────────────────────────
    const updateData = {};
    const balanceKeys = [
      'balance', 'profitBalance', 'referralBalance',
      'totalDeposits', 'totalWithdrawals',
      'pendingDepositAmount', 'pendingWithdrawalAmount',
    ];
    balanceKeys.forEach((k) => {
      const v = num(walletForm[k]);
      if (v !== undefined && !isNaN(v)) updateData[k] = v;
    });

    // ─── Crypto addresses ─────────────────────────────────
    const addrs = {};
    if (walletForm.cryptoBTC !== '') addrs.BTC = walletForm.cryptoBTC;
    if (walletForm.cryptoETH !== '') addrs.ETH = walletForm.cryptoETH;
    if (walletForm.cryptoUSDT !== '') addrs.USDT = walletForm.cryptoUSDT;
    if (walletForm.cryptoBNB !== '') addrs.BNB = walletForm.cryptoBNB;
    if (walletForm.cryptoTRX !== '') addrs.TRX = walletForm.cryptoTRX;
    if (Object.keys(addrs).length > 0) updateData.cryptoAddresses = addrs;

    // ─── Withdrawal settings ──────────────────────────────
    const ws = {};
    const wl = num(walletForm.withdrawalLimit);
    if (wl !== undefined && !isNaN(wl)) ws.withdrawalLimit = wl;
    const tl = num(walletForm.thresholdLimit);
    if (tl !== undefined && !isNaN(tl)) ws.thresholdLimit = tl;
    const mw = num(walletForm.minimumWithdrawal);
    if (mw !== undefined && !isNaN(mw)) ws.minimumWithdrawal = mw;
    ws.bypassSecurityCheck = !!walletForm.bypassSecurityCheck;

    // IBAN block
    const iban = {};
    const ifa = num(walletForm.ibanFeeAmount);
    if (ifa !== undefined && !isNaN(ifa)) iban.feeAmount = ifa;
    if (walletForm.ibanFeeWalletAddress) iban.feeWalletAddress = str(walletForm.ibanFeeWalletAddress);
    if (walletForm.ibanFeeWalletLabel) iban.feeWalletLabel = str(walletForm.ibanFeeWalletLabel);
    iban.feePaid = !!walletForm.ibanFeePaid;
    if (Object.keys(iban).length > 0) ws.iban = iban;

    // CCP block
    const ccp = {};
    const cfa = num(walletForm.ccpFeeAmount);
    if (cfa !== undefined && !isNaN(cfa)) ccp.feeAmount = cfa;
    if (walletForm.ccpFeeWalletAddress) ccp.feeWalletAddress = str(walletForm.ccpFeeWalletAddress);
    if (walletForm.ccpFeeWalletLabel) ccp.feeWalletLabel = str(walletForm.ccpFeeWalletLabel);
    ccp.feePaid = !!walletForm.ccpFeePaid;
    if (Object.keys(ccp).length > 0) ws.ccp = ccp;

    // Reactivation block
    const react = {};
    react.isRequired = !!walletForm.reactivationRequired;
    react.isLocked = !!walletForm.reactivationLocked;
    const uc = num(walletForm.reactivationUnlockCount);
    if (uc !== undefined && !isNaN(uc)) react.unlockCount = uc;
    ws.reactivation = react;

    if (Object.keys(ws).length > 0) updateData.withdrawalSettings = ws;

    // ─── Transaction stats ────────────────────────────────
    const stats = {};
    const tt = num(walletForm.statTotalTransactions);
    if (tt !== undefined && !isNaN(tt)) stats.totalTransactions = tt;
    const tdc = num(walletForm.statTotalDepositCount);
    if (tdc !== undefined && !isNaN(tdc)) stats.totalDepositCount = tdc;
    const twc = num(walletForm.statTotalWithdrawalCount);
    if (twc !== undefined && !isNaN(twc)) stats.totalWithdrawalCount = twc;
    if (Object.keys(stats).length > 0) updateData.transactionStats = stats;

    // ─── Account tier ─────────────────────────────────────
    if (walletForm.accountTier) updateData.accountTier = walletForm.accountTier;

    // Validate at least one field is provided
    if (Object.keys(updateData).length === 0) {
      toast.error('Please enter at least one value to update');
      return;
    }

    setUpdating(true);
    try {
      const response = await API.put(`/admin/users/${selectedUser._id}/wallet`, updateData);
      if (response.data.success) {
        toast.success('Wallet updated successfully');
        const newData = response.data.data;
        setWalletData(newData);
        populateForm(newData);

        // Update user list with new balances
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user._id === selectedUser._id
              ? {
                  ...user,
                  balance: newData.balance,
                  profitBalance: newData.profitBalance,
                  referralBalance: newData.referralBalance,
                }
              : user
          )
        );
      } else {
        toast.error(response.data.message || 'Failed to update wallet');
      }
    } catch (error) {
      console.error('Update wallet error:', error);
      toast.error(error.response?.data?.message || 'Failed to update wallet');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    return status ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10';
  };

  const getStatusText = (status) => {
    return status ? 'Active' : 'Inactive';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Wallet Management</h1>
        <p className="text-slate-400 mt-1">Manage user wallets, balances, and per-account settings</p>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition text-white"
          >
            Search
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-700">
                <th className="text-left py-3 px-4 text-slate-300 font-medium">User</th>
                <th className="text-left py-3 px-4 text-slate-300 font-medium">Email</th>
                <th className="text-left py-3 px-4 text-slate-300 font-medium">Status</th>
                <th className="text-center py-3 px-4 text-slate-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="border-b border-slate-700 hover:bg-slate-700/50 transition">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-white">{user.fullName || user.name}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.isActive)}`}>
                        {getStatusText(user.isActive)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleViewWallet(user._id)}
                          className="p-2 hover:bg-slate-600 rounded-lg transition"
                          title="Manage Wallet"
                        >
                          <FaWallet className="text-blue-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-400">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-between items-center p-4 border-t border-slate-700">
            <p className="text-sm text-slate-400">
              Showing {users.length} of {pagination.total} users
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page <= 1}
                className="px-3 py-1 bg-slate-700 rounded-lg text-white disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-slate-400">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.pages}
                className="px-3 py-1 bg-slate-700 rounded-lg text-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════ WALLET MODAL ═══════════════ */}
      {showWalletModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl">
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center rounded-t-2xl z-10">
              <div>
                <h2 className="text-xl font-bold text-white">Wallet Management</h2>
                <p className="text-sm text-slate-400">{selectedUser.fullName || 'User'}</p>
                <p className="text-xs text-slate-500">ID: {selectedUser._id}</p>
              </div>
              <button
                onClick={() => {
                  setShowWalletModal(false);
                  setSelectedUser(null);
                  setWalletData(null);
                }}
                className="p-2 hover:bg-slate-700 rounded-lg transition"
              >
                <FaTimes className="text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* ─── Overview Cards ─────────────────────────── */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
                  <p className="text-sm text-slate-400">Balance</p>
                  <p className="text-2xl font-bold text-white">
                    ${(walletData?.balance || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
                  <p className="text-sm text-slate-400">Profit Balance</p>
                  <p className="text-2xl font-bold text-green-400">
                    ${(walletData?.profitBalance || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
                  <p className="text-sm text-slate-400">Referral Balance</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    ${(walletData?.referralBalance || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* ─── SECTION 1: Balances ─────────────────────── */}
              <Section title="Balances" color="blue">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Balance" name="balance" form={walletForm} onChange={handleFormChange} type="number" />
                  <Field label="Profit Balance" name="profitBalance" form={walletForm} onChange={handleFormChange} type="number" />
                  <Field label="Referral Balance" name="referralBalance" form={walletForm} onChange={handleFormChange} type="number" />
                  <Field label="Total Deposits" name="totalDeposits" form={walletForm} onChange={handleFormChange} type="number" />
                  <Field label="Total Withdrawals" name="totalWithdrawals" form={walletForm} onChange={handleFormChange} type="number" />
                  <Field label="Pending Deposit Amount" name="pendingDepositAmount" form={walletForm} onChange={handleFormChange} type="number" />
                  <Field label="Pending Withdrawal Amount" name="pendingWithdrawalAmount" form={walletForm} onChange={handleFormChange} type="number" />
                </div>
              </Section>

              {/* ─── SECTION 2: Crypto Addresses ─────────────── */}
              <Section title="Crypto Addresses" color="purple">
                <div className="grid grid-cols-1 gap-3">
                  <Field label="BTC Address" name="cryptoBTC" form={walletForm} onChange={handleFormChange} type="text" placeholder="bc1q..." />
                  <Field label="ETH Address" name="cryptoETH" form={walletForm} onChange={handleFormChange} type="text" placeholder="0x..." />
                  <Field label="USDT Address" name="cryptoUSDT" form={walletForm} onChange={handleFormChange} type="text" placeholder="TX..." />
                  <Field label="BNB Address" name="cryptoBNB" form={walletForm} onChange={handleFormChange} type="text" placeholder="bnb..." />
                  <Field label="TRX Address" name="cryptoTRX" form={walletForm} onChange={handleFormChange} type="text" placeholder="T..." />
                </div>
              </Section>

              {/* ─── SECTION 3: Withdrawal Settings ──────────── */}
              <Section title="Withdrawal Settings (per account)" color="amber" icon={<FaShieldAlt className="text-amber-400" />}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Withdrawal Limit ($)" name="withdrawalLimit" form={walletForm} onChange={handleFormChange} type="number" />
                  <Field label="Threshold Limit ($)" name="thresholdLimit" form={walletForm} onChange={handleFormChange} type="number" />
                  <Field label="Minimum Withdrawal ($)" name="minimumWithdrawal" form={walletForm} onChange={handleFormChange} type="number" />
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Checkbox label="Bypass Security Check (skip admin approval)" name="bypassSecurityCheck" form={walletForm} onChange={handleFormChange} />
                  <Checkbox label="Account Locked (reactivation required)" name="reactivationLocked" form={walletForm} onChange={handleFormChange} />
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Checkbox label="Reactivation is Required" name="reactivationRequired" form={walletForm} onChange={handleFormChange} />
                  <Field label="Reactivation Unlock Count" name="reactivationUnlockCount" form={walletForm} onChange={handleFormChange} type="number" />
                </div>
              </Section>

              {/* ─── SECTION 4: IBAN Fee ──────────────────────── */}
              <Section title="IBAN Fee Settings" color="sky">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Fee Amount (€)" name="ibanFeeAmount" form={walletForm} onChange={handleFormChange} type="number" />
                  <Field label="Fee Wallet Label" name="ibanFeeWalletLabel" form={walletForm} onChange={handleFormChange} type="text" placeholder="USDT (TRC20)" />
                  <div className="md:col-span-2">
                    <Field label="Fee Wallet Address" name="ibanFeeWalletAddress" form={walletForm} onChange={handleFormChange} type="text" />
                  </div>
                </div>
                <div className="mt-3">
                  <Checkbox label="IBAN Fee Paid" name="ibanFeePaid" form={walletForm} onChange={handleFormChange} />
                </div>
              </Section>

              {/* ─── SECTION 5: CCP Fee ───────────────────────── */}
              <Section title="CCP Fee Settings (Algeria)" color="emerald">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Fee Amount (€)" name="ccpFeeAmount" form={walletForm} onChange={handleFormChange} type="number" />
                  <Field label="Fee Wallet Label" name="ccpFeeWalletLabel" form={walletForm} onChange={handleFormChange} type="text" placeholder="USDT (TRC20)" />
                  <div className="md:col-span-2">
                    <Field label="Fee Wallet Address" name="ccpFeeWalletAddress" form={walletForm} onChange={handleFormChange} type="text" />
                  </div>
                </div>
                <div className="mt-3">
                  <Checkbox label="CCP Fee Paid" name="ccpFeePaid" form={walletForm} onChange={handleFormChange} />
                </div>
              </Section>

              {/* ─── SECTION 6: Transaction Stats ─────────────── */}
              <Section title="Transaction Statistics" color="slate">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Total Transactions" name="statTotalTransactions" form={walletForm} onChange={handleFormChange} type="number" />
                  <Field label="Total Deposit Count" name="statTotalDepositCount" form={walletForm} onChange={handleFormChange} type="number" />
                  <Field label="Total Withdrawal Count" name="statTotalWithdrawalCount" form={walletForm} onChange={handleFormChange} type="number" />
                </div>
              </Section>

              {/* ─── SECTION 7: Account Tier ──────────────────── */}
              <Section title="Account Tier" color="violet">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Tier</label>
                  <select
                    name="accountTier"
                    value={walletForm.accountTier}
                    onChange={handleFormChange}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="basic">Basic</option>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>
              </Section>

              {/* ─── Save ─────────────────────────────────────── */}
              <button
                onClick={handleUpdateWallet}
                disabled={updating}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {updating ? <FaSpinner className="animate-spin" /> : <FaSave />}
                {updating ? 'Updating...' : 'Save All Wallet Changes'}
              </button>

              {/* ─── Read-only summary ─────────────────────────── */}
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-white mb-2">Wallet Metadata (Read-only)</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-slate-400">User ID:</span>
                    <span className="text-white ml-2 text-xs font-mono">{selectedUser._id}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Currency:</span>
                    <span className="text-white ml-2">{selectedUser.currency || 'USD'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Wallet Created:</span>
                    <span className="text-white ml-2">
                      {walletData?.createdAt ? new Date(walletData.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Last Updated:</span>
                    <span className="text-white ml-2">
                      {walletData?.updatedAt ? new Date(walletData.updatedAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// Reusable subcomponents
// ═══════════════════════════════════════════════════════════
const Section = ({ title, color = 'slate', icon, children }) => {
  const colorMap = {
    blue: 'border-blue-500/20 bg-blue-500/5',
    purple: 'border-purple-500/20 bg-purple-500/5',
    amber: 'border-amber-500/20 bg-amber-500/5',
    sky: 'border-sky-500/20 bg-sky-500/5',
    emerald: 'border-emerald-500/20 bg-emerald-500/5',
    slate: 'border-slate-500/20 bg-slate-500/5',
    violet: 'border-violet-500/20 bg-violet-500/5',
  };
  return (
    <div className={`rounded-lg p-4 border ${colorMap[color] || colorMap.slate}`}>
      <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
};

const Field = ({ label, name, form, onChange, type = 'text', placeholder }) => (
  <div>
    <label className="block text-xs text-slate-400 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={form[name] ?? ''}
      onChange={onChange}
      placeholder={placeholder}
      step={type === 'number' ? '0.01' : undefined}
      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
    />
  </div>
);

const Checkbox = ({ label, name, form, onChange }) => (
  <label className="flex items-center gap-2 p-2 bg-slate-700/40 rounded-lg cursor-pointer hover:bg-slate-700/70 transition">
    <input
      type="checkbox"
      name={name}
      checked={!!form[name]}
      onChange={onChange}
      className="w-4 h-4 accent-blue-500"
    />
    <span className="text-xs text-slate-300">{label}</span>
  </label>
);

export default WalletManagement;