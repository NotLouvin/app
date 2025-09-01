import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { InvestmentProvider } from './contexts/InvestmentContext';
import AppRouter from './components/AppRouter';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <InvestmentProvider>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
          <AppRouter />
        </div>
      </InvestmentProvider>
    </AuthProvider>
  );
}

export default App;