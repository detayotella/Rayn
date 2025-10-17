import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types for our app state
export interface User {
  username: string;
  walletAddress?: string;
  profileImage?: string;
  balance: number;
}

export interface Transaction {
  id: number;
  amount: number;
  description: string;
  time: string;
  avatar: string;
  type: 'sent' | 'received';
  recipient?: string;
  sender?: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: Date;
}

interface AppContextType {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  
  // Navigation state
  currentPage: string;
  setCurrentPage: (page: string) => void;
  
  // Transactions
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  
  // Modals
  activeModal: string | null;
  openModal: (modalName: string) => void;
  closeModal: () => void;
  
  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('/');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize user from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedWallet = localStorage.getItem('walletAddress');
    const storedProfile = localStorage.getItem('raynProfileImage');
    
    if (storedUsername) {
      setUserState({
        username: storedUsername,
        walletAddress: storedWallet || undefined,
        profileImage: storedProfile || undefined,
        balance: 1250.75, // Mock balance, should come from blockchain
      });
    }

    // Initialize with mock transactions
    setTransactions([
      {
        id: 1,
        amount: 250.00,
        description: "Received from Sarah",
        time: "2d ago",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        type: 'received',
        sender: '@sarah'
      },
      {
        id: 2,
        amount: 150.00,
        description: "Sent to David",
        time: "3d ago",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        type: 'sent',
        recipient: '@david'
      },
      {
        id: 3,
        amount: 300.00,
        description: "Received from Michael",
        time: "5d ago",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
        type: 'received',
        sender: '@michael'
      },
      {
        id: 4,
        amount: 200.00,
        description: "Sent to Jessica",
        time: "7d ago",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
        type: 'sent',
        recipient: '@jessica'
      }
    ]);
  }, []);

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem('username', newUser.username);
      if (newUser.walletAddress) {
        localStorage.setItem('walletAddress', newUser.walletAddress);
      }
      if (newUser.profileImage) {
        localStorage.setItem('raynProfileImage', newUser.profileImage);
      }
    } else {
      localStorage.removeItem('username');
      localStorage.removeItem('walletAddress');
      localStorage.removeItem('raynProfileImage');
    }
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
    };
    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const openModal = (modalName: string) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const isAuthenticated = user !== null;

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        currentPage,
        setCurrentPage,
        transactions,
        addTransaction,
        notifications,
        addNotification,
        removeNotification,
        activeModal,
        openModal,
        closeModal,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
