import React, { useState } from 'react';
import { useInvestment } from '../contexts/InvestmentContext';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Clock, 
  Target,
  ArrowRight,
  Calendar
} from 'lucide-react';

interface ProjectCatalogProps {
  onNavigate: (page: string) => void;
  onSelectProject: (projectId: string) => void;
}

const ProjectCatalog: React.FC<ProjectCatalogProps> = ({ onNavigate, onSelectProject }) => {
  const { projects } = useInvestment();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('apy');

  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];
  
  const filteredProjects = projects
    .filter(project => 
      project.status === 'Open' &&
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === 'all' || project.category === selectedCategory)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'apy':
          return b.apy - a.apy;
        case 'tenor':
          return a.tenor - b.tenor;
        case 'target':
          return b.targetAmount - a.targetAmount;
        default:
          return 0;
      }
    });

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

  const handleProjectClick = (projectId: string) => {
    onSelectProject(projectId);
    onNavigate('project-detail');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Katalog Proyek</h1>
        <p className="text-gray-600">Temukan proyek investasi terbaik dengan return menguntungkan</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 animate-slide-up">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari proyek..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 transition-all duration-200"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 transition-all duration-200 bg-white"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'Semua Kategori' : category}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 transition-all duration-200 bg-white"
          >
            <option value="apy">Urutkan: APY Tertinggi</option>
            <option value="tenor">Urutkan: Tenor Terpendek</option>
            <option value="target">Urutkan: Target Terbesar</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <div 
            key={project.id}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group animate-slide-up"
            style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            onClick={() => handleProjectClick(project.id)}
          >
            {/* Project Image */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={project.image} 
                alt={project.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {formatPercentage(project.apy)} APY
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  {project.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                {project.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {project.tenor} {project.tenorType === 'months' ? 'bulan' : 'hari'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Min {formatCurrency(project.minInvestment)}
                  </span>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Progress Pendanaan</span>
                  <span className="text-sm font-semibold text-emerald-600">
                    {((project.currentAmount / project.targetAmount) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-green-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${Math.min((project.currentAmount / project.targetAmount) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{formatCurrency(project.currentAmount)}</span>
                  <span>{formatCurrency(project.targetAmount)}</span>
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 rounded-xl font-semibold group-hover:from-emerald-600 group-hover:to-green-700 transition-all duration-300 flex items-center justify-center space-x-2">
                <span>Lihat Detail</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Tidak ada proyek ditemukan</h3>
          <p className="text-gray-500">Coba ubah filter pencarian Anda</p>
        </div>
      )}
    </div>
  );
};

export default ProjectCatalog;