import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useInvestment } from '../contexts/InvestmentContext';
import { 
  Wallet, 
  TrendingUp, 
  Calendar, 
  ArrowUpRight,
  PiggyBank,
  Target,
  Clock
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { projects, getUserInvestments, getUserTransactions } = useInvestment();

  const userInvestments = getUserInvestments(user?.id || '');
  const userTransactions = getUserTransactions(user?.id || '');
  
  const totalInvested = userInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const expectedReturns = userInvestments.reduce((sum, inv) => sum + inv.expectedReturn, 0);
  const activeProjects = userInvestments.filter(inv => inv.status === 'active').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const openProjects = projects.filter(p => p.status === 'Open').slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Selamat datang, {user?.name} 👋
        </h1>
        <p className="text-gray-600">Kelola investasi Anda dan pantau perkembangan portofolio</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-100 p-3 rounded-xl">
              <Wallet className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Saldo Dompet</h3>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(user?.balance || 0)}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <PiggyBank className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Investasi</h3>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalInvested)}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <Target className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Expected Returns</h3>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(expectedReturns)}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Proyek Aktif</h3>
          <p className="text-2xl font-bold text-gray-900">{activeProjects}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Available Projects */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Proyek Tersedia</h2>
                <button 
                  onClick={() => onNavigate('projects')}
                  className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center space-x-1 transition-colors"
                >
                  <span>Lihat Semua</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {openProjects.map((project) => (
                <div 
                  key={project.id}
                  className="border border-gray-200 rounded-xl p-4 hover:border-emerald-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => onNavigate('projects')}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-600">{formatPercentage(project.apy)}</div>
                      <div className="text-xs text-gray-500">APY</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Target: {formatCurrency(project.targetAmount)}
                    </span>
                    <span className="text-emerald-600 font-medium">
                      {project.tenor} {project.tenorType === 'months' ? 'bulan' : 'hari'}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(project.currentAmount / project.targetAmount) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{formatCurrency(project.currentAmount)}</span>
                      <span>{((project.currentAmount / project.targetAmount) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {openProjects.length === 0 && (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Tidak ada proyek tersedia saat ini</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Transaksi Terbaru</h2>
                <button 
                  onClick={() => onNavigate('wallet')}
                  className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center space-x-1 transition-colors"
                >
                  <span>Detail</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                {userTransactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === 'topup' 
                          ? 'bg-blue-100 text-blue-600' 
                          : transaction.type === 'investment'
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-green-100 text-green-600'
                      }`}>
                        <Wallet className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.date).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                    </span>
                  </div>
                ))}
                
                {userTransactions.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Belum ada transaksi</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 space-y-3">
            <button 
              onClick={() => onNavigate('wallet')}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <Wallet className="h-5 w-5" />
              <span>Top Up Dompet</span>
            </button>
            
            <button 
              onClick={() => onNavigate('projects')}
              className="w-full bg-white text-emerald-600 py-4 rounded-xl font-semibold shadow-md border-2 border-emerald-200 hover:bg-emerald-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <TrendingUp className="h-5 w-5" />
              <span>Jelajahi Proyek</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;