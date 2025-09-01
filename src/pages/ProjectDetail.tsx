import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useInvestment, Project } from '../contexts/InvestmentContext';
import { 
  ArrowLeft, 
  Calendar, 
  Target, 
  TrendingUp, 
  Clock, 
  Shield,
  DollarSign,
  Users,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface ProjectDetailProps {
  projectId: string | null;
  onNavigate: (page: string) => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId, onNavigate }) => {
  const { user, updateBalance } = useAuth();
  const { projects, investInProject, addTransaction } = useInvestment();
  const [investAmount, setInvestAmount] = useState('');
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Proyek tidak ditemukan</h2>
          <button 
            onClick={() => onNavigate('projects')}
            className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Kembali ke katalog proyek
          </button>
        </div>
      </div>
    );
  }

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

  const progressPercentage = (project.currentAmount / project.targetAmount) * 100;
  const remainingQuota = project.targetAmount - project.currentAmount;

  const handleInvest = () => {
    const amount = parseInt(investAmount.replace(/\D/g, ''));
    
    if (!amount || amount < project.minInvestment || amount > project.maxInvestment) {
      setNotification({ 
        type: 'error', 
        message: `Jumlah investasi harus antara ${formatCurrency(project.minInvestment)} - ${formatCurrency(project.maxInvestment)}` 
      });
      return;
    }

    if (amount > (user?.balance || 0)) {
      setNotification({ 
        type: 'error', 
        message: 'Saldo tidak mencukupi' 
      });
      return;
    }

    if (amount > remainingQuota) {
      setNotification({ 
        type: 'error', 
        message: 'Melebihi kuota yang tersedia' 
      });
      return;
    }

    const success = investInProject(project.id, amount, user?.id || '');
    
    if (success) {
      updateBalance(-amount);
      setNotification({ 
        type: 'success', 
        message: 'Investasi berhasil! Dana telah dialokasikan ke proyek.' 
      });
      setShowInvestModal(false);
      setInvestAmount('');
    } else {
      setNotification({ 
        type: 'error', 
        message: 'Investasi gagal. Silakan coba lagi.' 
      });
    }

    setTimeout(() => setNotification(null), 5000);
  };

  const formatInputValue = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return new Intl.NumberFormat('id-ID').format(parseInt(numbers) || 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => onNavigate('projects')}
        className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium mb-6 group transition-all duration-200"
      >
        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
        <span>Kembali ke Katalog</span>
      </button>

      {/* Notification */}
      {notification && (
        <div className={`mb-6 p-4 rounded-xl border flex items-center space-x-3 animate-slide-down ${
          notification.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Image */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in">
            <div className="relative h-64 md:h-80">
              <img 
                src={project.image} 
                alt={project.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <h1 className="text-3xl font-bold text-white mb-2">{project.name}</h1>
                <div className="flex items-center space-x-4">
                  <span className="bg-emerald-500 text-white px-4 py-2 rounded-full text-lg font-bold">
                    {formatPercentage(project.apy)} APY
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-medium">
                    {project.category}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Description */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tentang Proyek</h2>
            <p className="text-gray-700 leading-relaxed">{project.description}</p>
          </div>

          {/* Key Metrics */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Metrik Kunci</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-emerald-100 p-4 rounded-xl mb-3 mx-auto w-fit">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{formatPercentage(project.apy)}</div>
                <div className="text-sm text-gray-600">Annual Return</div>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-xl mb-3 mx-auto w-fit">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{project.tenor}</div>
                <div className="text-sm text-gray-600">{project.tenorType === 'months' ? 'Bulan' : 'Hari'}</div>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-xl mb-3 mx-auto w-fit">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-lg font-bold text-gray-900">{formatCurrency(project.minInvestment)}</div>
                <div className="text-sm text-gray-600">Min Investasi</div>
              </div>

              <div className="text-center">
                <div className="bg-orange-100 p-4 rounded-xl mb-3 mx-auto w-fit">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-lg font-bold text-gray-900">{formatCurrency(project.targetAmount)}</div>
                <div className="text-sm text-gray-600">Target Dana</div>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-gray-900">Progress Pendanaan</span>
                <span className="text-lg font-bold text-emerald-600">{progressPercentage.toFixed(1)}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-green-500 h-4 rounded-full transition-all duration-1000 shadow-sm"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>{formatCurrency(project.currentAmount)}</span>
                <span>{formatCurrency(project.targetAmount)}</span>
              </div>
              
              <div className="mt-3 text-center">
                <span className="text-sm text-gray-600">
                  Sisa kuota: <span className="font-semibold text-emerald-600">{formatCurrency(remainingQuota)}</span>
                </span>
              </div>
            </div>

            {/* Investment Range */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-3">Rentang Investasi</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Minimum:</span>
                  <span className="font-semibold">{formatCurrency(project.minInvestment)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Maksimum:</span>
                  <span className="font-semibold">{formatCurrency(project.maxInvestment)}</span>
                </div>
              </div>
            </div>

            {/* Investment Button */}
            <button
              onClick={() => setShowInvestModal(true)}
              disabled={progressPercentage >= 100}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              <TrendingUp className="h-5 w-5" />
              <span>{progressPercentage >= 100 ? 'Proyek Sudah Terpenuhi' : 'Investasi Sekarang'}</span>
            </button>

            {/* Saldo Info */}
            <div className="mt-4 p-4 bg-emerald-50 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-emerald-700">Saldo Anda:</span>
                <span className="font-bold text-emerald-700">{formatCurrency(user?.balance || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Modal */}
      {showInvestModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Investasi di {project.name}</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Investasi (IDR)
                </label>
                <input
                  type="text"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  placeholder="Masukkan nominal investasi"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 transition-all duration-200"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Min: {formatCurrency(project.minInvestment)}</span>
                  <span>Max: {formatCurrency(project.maxInvestment)}</span>
                </div>
              </div>

              {/* Investment Preview */}
              {investAmount && (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Investasi:</span>
                      <span className="font-semibold">{formatCurrency(parseInt(investAmount.replace(/\D/g, '')) || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Return:</span>
                      <span className="font-semibold text-emerald-600">
                        {formatCurrency(((parseInt(investAmount.replace(/\D/g, '')) || 0) * (project.apy / 100) * (project.tenor / 12)))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tenor:</span>
                      <span className="font-semibold">{project.tenor} {project.tenorType === 'months' ? 'bulan' : 'hari'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowInvestModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
              >
                Batal
              </button>
              <button
                onClick={handleInvest}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-300"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;