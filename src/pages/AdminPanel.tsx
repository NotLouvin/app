import React, { useState } from 'react';
import { useInvestment, Project } from '../contexts/InvestmentContext';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Target,
  TrendingUp,
  Users,
  Settings,
  BarChart3
} from 'lucide-react';

interface AdminPanelProps {
  onNavigate: (page: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigate }) => {
  const { projects, createProject, updateProject, deleteProject, investments } = useInvestment();
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState('projects');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    apy: '',
    tenor: '',
    tenorType: 'months' as 'days' | 'months',
    minInvestment: '',
    maxInvestment: '',
    targetAmount: '',
    category: '',
    image: '',
    status: 'Draft' as Project['status']
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalInvestments = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'Open' || p.status === 'Active').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData = {
      ...formData,
      apy: parseFloat(formData.apy),
      tenor: parseInt(formData.tenor),
      minInvestment: parseInt(formData.minInvestment.replace(/\D/g, '')),
      maxInvestment: parseInt(formData.maxInvestment.replace(/\D/g, '')),
      targetAmount: parseInt(formData.targetAmount.replace(/\D/g, '')),
      image: formData.image || 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg'
    };

    if (editingProject) {
      updateProject(editingProject.id, projectData);
    } else {
      createProject(projectData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      apy: '',
      tenor: '',
      tenorType: 'months',
      minInvestment: '',
      maxInvestment: '',
      targetAmount: '',
      category: '',
      image: '',
      status: 'Draft'
    });
    setEditingProject(null);
    setShowProjectModal(false);
  };

  const handleEdit = (project: Project) => {
    setFormData({
      name: project.name,
      description: project.description,
      apy: project.apy.toString(),
      tenor: project.tenor.toString(),
      tenorType: project.tenorType,
      minInvestment: project.minInvestment.toString(),
      maxInvestment: project.maxInvestment.toString(),
      targetAmount: project.targetAmount.toString(),
      category: project.category,
      image: project.image,
      status: project.status
    });
    setEditingProject(project);
    setShowProjectModal(true);
  };

  const handleDelete = (projectId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus proyek ini?')) {
      deleteProject(projectId);
    }
  };

  const getStatusBadge = (status: Project['status']) => {
    const statusConfig = {
      Draft: 'bg-gray-100 text-gray-700',
      Open: 'bg-emerald-100 text-emerald-700',
      Funded: 'bg-blue-100 text-blue-700',
      Active: 'bg-purple-100 text-purple-700',
      Completed: 'bg-green-100 text-green-700'
    };
    
    return `px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[status]}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel Admin</h1>
        <p className="text-gray-600">Kelola proyek dan monitor platform InvestMate</p>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-100 p-3 rounded-xl">
              <BarChart3 className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Investasi</h3>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalInvestments)}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Proyek</h3>
          <p className="text-2xl font-bold text-gray-900">{totalProjects}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Proyek Aktif</h3>
          <p className="text-2xl font-bold text-gray-900">{activeProjects}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="border-b border-gray-100">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('projects')}
              className={`py-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'projects'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-emerald-600'
              }`}
            >
              Kelola Proyek
            </button>
            <button
              onClick={() => setActiveTab('investments')}
              className={`py-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'investments'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-emerald-600'
              }`}
            >
              Data Investasi
            </button>
          </nav>
        </div>

        {activeTab === 'projects' && (
          <div className="p-6">
            {/* Add Project Button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Manajemen Proyek</h2>
              <button
                onClick={() => setShowProjectModal(true)}
                className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Tambah Proyek</span>
              </button>
            </div>

            {/* Projects Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-2 font-semibold text-gray-700">Nama Proyek</th>
                    <th className="text-left py-4 px-2 font-semibold text-gray-700">APY</th>
                    <th className="text-left py-4 px-2 font-semibold text-gray-700">Tenor</th>
                    <th className="text-left py-4 px-2 font-semibold text-gray-700">Target</th>
                    <th className="text-left py-4 px-2 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-2 font-semibold text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="py-4 px-2">
                        <div>
                          <div className="font-medium text-gray-900">{project.name}</div>
                          <div className="text-sm text-gray-500">{project.category}</div>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <span className="font-semibold text-emerald-600">{project.apy}%</span>
                      </td>
                      <td className="py-4 px-2">
                        {project.tenor} {project.tenorType === 'months' ? 'bulan' : 'hari'}
                      </td>
                      <td className="py-4 px-2">
                        <div className="text-sm">
                          <div className="font-medium">{formatCurrency(project.targetAmount)}</div>
                          <div className="text-gray-500">
                            {((project.currentAmount / project.targetAmount) * 100).toFixed(1)}% tercapai
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <span className={getStatusBadge(project.status)}>{project.status}</span>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(project)}
                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'investments' && (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Data Investasi</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-2 font-semibold text-gray-700">Investor</th>
                    <th className="text-left py-4 px-2 font-semibold text-gray-700">Proyek</th>
                    <th className="text-left py-4 px-2 font-semibold text-gray-700">Jumlah</th>
                    <th className="text-left py-4 px-2 font-semibold text-gray-700">Tanggal</th>
                    <th className="text-left py-4 px-2 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-2 font-semibold text-gray-700">Expected Return</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {investments.map((investment) => {
                    const project = projects.find(p => p.id === investment.projectId);
                    return (
                      <tr key={investment.id} className="hover:bg-gray-50">
                        <td className="py-4 px-2">
                          <div className="font-medium text-gray-900">User #{investment.userId}</div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="font-medium text-gray-900">{project?.name}</div>
                        </td>
                        <td className="py-4 px-2">
                          <span className="font-semibold text-emerald-600">{formatCurrency(investment.amount)}</span>
                        </td>
                        <td className="py-4 px-2">
                          {new Date(investment.date).toLocaleDateString('id-ID')}
                        </td>
                        <td className="py-4 px-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            investment.status === 'active' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {investment.status === 'active' ? 'Aktif' : 'Selesai'}
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          <span className="font-semibold text-blue-600">{formatCurrency(investment.expectedReturn)}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingProject ? 'Edit Proyek' : 'Tambah Proyek Baru'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Proyek</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">APY (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.apy}
                    onChange={(e) => setFormData({ ...formData, apy: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tenor</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={formData.tenor}
                      onChange={(e) => setFormData({ ...formData, tenor: e.target.value })}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-200"
                      required
                    />
                    <select
                      value={formData.tenorType}
                      onChange={(e) => setFormData({ ...formData, tenorType: e.target.value as 'days' | 'months' })}
                      className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    >
                      <option value="days">Hari</option>
                      <option value="months">Bulan</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Investasi</label>
                  <input
                    type="text"
                    value={formData.minInvestment}
                    onChange={(e) => setFormData({ ...formData, minInvestment: e.target.value })}
                    placeholder="1000000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Investasi</label>
                  <input
                    type="text"
                    value={formData.maxInvestment}
                    onChange={(e) => setFormData({ ...formData, maxInvestment: e.target.value })}
                    placeholder="50000000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount</label>
                  <input
                    type="text"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    placeholder="500000000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Technology"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Open">Open</option>
                    <option value="Funded">Funded</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL Gambar</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.pexels.com/..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-300"
                >
                  {editingProject ? 'Update Proyek' : 'Buat Proyek'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;