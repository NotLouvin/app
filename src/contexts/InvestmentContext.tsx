import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Project {
  id: string;
  name: string;
  description: string;
  apy: number;
  tenor: number;
  tenorType: 'days' | 'months';
  minInvestment: number;
  maxInvestment: number;
  targetAmount: number;
  currentAmount: number;
  status: 'Draft' | 'Open' | 'Funded' | 'Active' | 'Completed';
  category: string;
  image: string;
  startDate?: Date;
  endDate?: Date;
}

export interface Investment {
  id: string;
  userId: string;
  projectId: string;
  amount: number;
  date: Date;
  status: 'active' | 'completed';
  expectedReturn: number;
  payoutDate: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'topup' | 'investment' | 'payout';
  amount: number;
  date: Date;
  description: string;
  projectId?: string;
}

interface InvestmentContextType {
  projects: Project[];
  investments: Investment[];
  transactions: Transaction[];
  createProject: (project: Omit<Project, 'id' | 'currentAmount'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  investInProject: (projectId: string, amount: number, userId: string) => boolean;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  getUserInvestments: (userId: string) => Investment[];
  getUserTransactions: (userId: string) => Transaction[];
}

const InvestmentContext = createContext<InvestmentContextType | undefined>(undefined);

export const useInvestment = () => {
  const context = useContext(InvestmentContext);
  if (context === undefined) {
    throw new Error('useInvestment must be used within an InvestmentProvider');
  }
  return context;
};

export const InvestmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Initialize with mock data
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'Green Energy Solar Farm',
        description: 'Investasi dalam farm tenaga surya dengan teknologi terdepan untuk menghasilkan energi bersih dan berkelanjutan.',
        apy: 12.5,
        tenor: 12,
        tenorType: 'months',
        minInvestment: 1000000,
        maxInvestment: 50000000,
        targetAmount: 500000000,
        currentAmount: 350000000,
        status: 'Open',
        category: 'Renewable Energy',
        image: 'https://images.pexels.com/photos/9875428/pexels-photo-9875428.jpeg'
      },
      {
        id: '2',
        name: 'Tech Startup Series A',
        description: 'Investasi dalam startup teknologi fintech yang sedang berkembang pesat dengan proyeksi pertumbuhan tinggi.',
        apy: 18.0,
        tenor: 18,
        tenorType: 'months',
        minInvestment: 5000000,
        maxInvestment: 100000000,
        targetAmount: 1000000000,
        currentAmount: 750000000,
        status: 'Open',
        category: 'Technology',
        image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg'
      },
      {
        id: '3',
        name: 'Real Estate Development',
        description: 'Proyek pengembangan apartemen premium di kawasan strategis dengan tingkat okupansi tinggi.',
        apy: 15.2,
        tenor: 24,
        tenorType: 'months',
        minInvestment: 10000000,
        maxInvestment: 200000000,
        targetAmount: 2000000000,
        currentAmount: 1200000000,
        status: 'Active',
        category: 'Real Estate',
        image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg'
      }
    ];

    setProjects(mockProjects);
  }, []);

  const createProject = (project: Omit<Project, 'id' | 'currentAmount'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      currentAmount: 0
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const investInProject = (projectId: string, amount: number, userId: string): boolean => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return false;
    
    if (amount < project.minInvestment || amount > project.maxInvestment) {
      return false;
    }
    
    if (project.currentAmount + amount > project.targetAmount) {
      return false;
    }

    // Create investment
    const investment: Investment = {
      id: Date.now().toString(),
      userId,
      projectId,
      amount,
      date: new Date(),
      status: 'active',
      expectedReturn: amount * (project.apy / 100) * (project.tenor / 12),
      payoutDate: new Date(Date.now() + (project.tenor * (project.tenorType === 'months' ? 30 : 1) * 24 * 60 * 60 * 1000))
    };

    setInvestments(prev => [...prev, investment]);
    
    // Update project current amount
    updateProject(projectId, { 
      currentAmount: project.currentAmount + amount,
      status: project.currentAmount + amount >= project.targetAmount ? 'Funded' : 'Open'
    });

    // Add transaction
    addTransaction({
      userId,
      type: 'investment',
      amount: -amount,
      date: new Date(),
      description: `Investasi dalam ${project.name}`,
      projectId
    });

    return true;
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const getUserInvestments = (userId: string) => {
    return investments.filter(inv => inv.userId === userId);
  };

  const getUserTransactions = (userId: string) => {
    return transactions.filter(tx => tx.userId === userId).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  return (
    <InvestmentContext.Provider value={{
      projects,
      investments,
      transactions,
      createProject,
      updateProject,
      deleteProject,
      investInProject,
      addTransaction,
      getUserInvestments,
      getUserTransactions
    }}>
      {children}
    </InvestmentContext.Provider>
  );
};