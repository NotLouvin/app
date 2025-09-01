import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthPage from '../pages/AuthPage';
import Dashboard from '../pages/Dashboard';
import ProjectCatalog from '../pages/ProjectCatalog';
import ProjectDetail from '../pages/ProjectDetail';
import WalletPage from '../pages/WalletPage';
import AdminPanel from '../pages/AdminPanel';
import Navigation from './Navigation';

const AppRouter: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = React.useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(null);

  if (!user) {
    return <AuthPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'projects':
        return <ProjectCatalog onNavigate={setCurrentPage} onSelectProject={setSelectedProjectId} />;
      case 'project-detail':
        return <ProjectDetail projectId={selectedProjectId} onNavigate={setCurrentPage} />;
      case 'wallet':
        return <WalletPage onNavigate={setCurrentPage} />;
      case 'admin':
        return user.role === 'admin' ? <AdminPanel onNavigate={setCurrentPage} /> : <Dashboard onNavigate={setCurrentPage} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="pt-16">
        {renderPage()}
      </main>
    </div>
  );
};

export default AppRouter;