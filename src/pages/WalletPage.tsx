import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useInvestment } from '../contexts/InvestmentContext';
import { 
  Wallet, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  CreditCard,
  Building2,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

interface WalletPageProps {
  onNavigate: (page: string) => void;
}

const WalletPage: React.FC<WalletPageProps> = ({ onNavigate }) => {
  const { user, updateBalance } = useAuth();
  const { addTransaction, getUserTransactions } = useInvestment();
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const transactions = getUserTransactions(user?.id || '');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleTopUp = () => {
    const amount = parseInt(topUpAmount.replace(/\D/g, ''));
    
    if (!amount || amount < 10000) {
      setNotification({ 
        type: 'error', 
        message: 'Minimal top up IDR 10.000' 
      });
      return;
    }

    // Simulate payment gateway success
    updateBalance(amount);
    addTransaction({
      userId: user?.id || '',
      type: 'topup',
      amount: amount,
      date: new Date(),
      description: 'Top up dompet via Bank Transfer'
    });

    setNotification({ 
      type: 'success', 
      message: `Top up berhasil! Saldo Anda bertambah ${formatCurrency(amount)}` 
    });
    
    setShowTopUpModal(false);
    setTopUpAmount('');

    setTimeout(() => setNotification(null), 5000);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'topup':
        return <ArrowDownRight className="h-5 w-5 text-green-600" />;
      case 'investment':
        return <ArrowUpRight className="h-5 w-5 text-orange-600" />;
      case 'payout':
        return <ArrowDownRight className="h-5 w-5 text-blue-600" />;
      default:
        return <Wallet className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'topup':
        return 'bg-green-100';
      case 'investment':
        return 'bg-orange-100';
      case 'payout':
        return 'bg-blue-100';
      default:
        return 'bg-gray-100';
    }
  };

  const quickAmounts = [100000, 500000, 1000000, 5000000];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dompet Digital</h1>
        <p className="text-gray-600">Kelola saldo dan riwayat transaksi Anda</p>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`mb-6 p-4 rounded-xl border flex items-center space-x-3 animate-slide-down ${
          notification.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Balance Card */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Saldo Dompet</h2>
              <Wallet className="h-8 w-8 text-white/80" />
            </div>
            
            <div className="mb-6">
              <p className="text-4xl font-bold mb-2">{formatCurrency(user?.balance || 0)}</p>
              <p className="text-emerald-100">Total saldo tersedia</p>
            </div>

            <button
              onClick={() => setShowTopUpModal(true)}
              className="w-full bg-white/20 backdrop-blur-sm text-white py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Top Up Saldo</span>
            </button>
          </div>
        </div>

        {/* Transactions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Riwayat Transaksi</h2>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {transactions.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl ${getTransactionColor(transaction.type)}`}>
                          {getTransactionIcon(transaction.type)}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <span className={`text-lg font-bold ${
                            transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                          </span>
                          <p className="text-xs text-gray-500 capitalize">{transaction.type}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Belum ada transaksi</h3>
                  <p className="text-gray-500 mb-4">Mulai dengan top up saldo atau investasi pertama Anda</p>
                  <button
                    onClick={() => setShowTopUpModal(true)}
                    className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-emerald-600 transition-colors"
                  >
                    Top Up Sekarang
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Top Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Top Up Dompet</h3>
            
            {/* Quick Amounts */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Pilih Nominal Cepat</label>
              <div className="grid grid-cols-2 gap-3">
                {quickAmounts.map(amount => (
                  <button
                    key={amount}
                    onClick={() => setTopUpAmount(amount.toString())}
                    className="p-3 border-2 border-gray-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 text-center"
                  >
                    <span className="font-semibold text-gray-900">{formatCurrency(amount)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Atau Masukkan Nominal Custom
              </label>
              <input
                type="text"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                placeholder="Minimal IDR 10.000"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 transition-all duration-200"
              />
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Metode Pembayaran</label>
              <div className="space-y-3">
                <div className="flex items-center p-4 border-2 border-emerald-200 bg-emerald-50 rounded-xl">
                  <Building2 className="h-6 w-6 text-emerald-600 mr-3" />
                  <div>
                    <p className="font-semibold text-emerald-700">Bank Transfer</p>
                    <p className="text-sm text-emerald-600">Gratis biaya admin</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowTopUpModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
              >
                Batal
              </button>
              <button
                onClick={handleTopUp}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-300"
              >
                Top Up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;