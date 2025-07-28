import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group'; // Import for animations
import BottomNavigation from './components/BottomNavigation';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Profile from './components/Profile';
import TransactionModal from './components/TransactionModal';
import ReportsModal from './components/ReportsModal';
import { useTransactions } from './hooks/useTransactions';
import { Transaction } from './types/Transaction';
import { useTheme } from './context/ThemeContext';
import { useSession } from './context/SessionContext';
import Login from './pages/Login';
import SignUp from './pages/SignUp'; // Import SignUp component
import Statistics from './pages/Statistics';
import Goals from './pages/Goals';

function App() {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  
  const { transactions, addTransaction, updateTransaction } = useTransactions();
  const { theme } = useTheme();
  const { session, isLoading } = useSession();
  const navigate = useNavigate();
  const location = useLocation(); // Get current location for transitions

  // Redirect jika tidak ada sesi dan bukan di halaman login atau sign-up
  useEffect(() => {
    if (!isLoading && !session && location.pathname !== '/login' && location.pathname !== '/signup') {
      navigate('/login');
    } else if (!isLoading && session && (location.pathname === '/login' || location.pathname === '/signup')) {
      navigate('/'); // Redirect ke home jika sudah login dan mencoba akses /login atau /signup
    }
  }, [session, isLoading, navigate, location.pathname]);

  const handleAddTransaction = () => {
    setEditingTransaction(undefined);
    setIsTransactionModalOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const handleSubmitTransaction = async (transactionData: Omit<Transaction, 'id' | 'user_id'>) => { // Updated type
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, transactionData);
    } else {
      await addTransaction(transactionData);
    }
    setIsTransactionModalOpen(false);
    setEditingTransaction(undefined);
  };

  // Tentukan apakah BottomNavigation harus ditampilkan
  const showNav = session && location.pathname !== '/login' && location.pathname !== '/signup';

  // Tentukan active tab untuk BottomNavigation berdasarkan path saat ini
  const getActiveTabFromPath = (pathname: string) => {
    if (pathname === '/') return 'home';
    if (pathname === '/history') return 'history';
    if (pathname === '/statistics') return 'statistics';
    if (pathname === '/goals') return 'goals';
    if (pathname === '/profile') return 'profile';
    return 'home'; // Default
  };

  const activeTab = getActiveTabFromPath(location.pathname);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        Memuat aplikasi...
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col ${theme} relative`}>
      <TransitionGroup component={null}>
        <CSSTransition
          key={location.key} // Key changes on navigation, triggering transition
          classNames="page-transition" // CSS classes for transition
          timeout={300} // Match CSS transition duration
        >
          <div className="absolute inset-0 w-full h-full"> {/* Wrapper for animated content */}
            <Routes location={location}> {/* Pass location to Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} /> {/* New route for Sign Up */}
              {session ? (
                <>
                  <Route path="/" element={<Dashboard onShowReports={() => setIsReportsModalOpen(true)} onAddTransaction={handleAddTransaction} />} />
                  <Route path="/history" element={<History onEditTransaction={handleEditTransaction} />} />
                  <Route path="/statistics" element={<Statistics />} />
                  <Route path="/goals" element={<Goals />} />
                  <Route path="/profile" element={<Profile />} />
                </>
              ) : (
                <>
                  {/* Catch-all for unauthenticated users not on login/signup page */}
                  <Route path="*" element={null} />
                </>
              )}
            </Routes>
          </div>
        </CSSTransition>
      </TransitionGroup>

      {showNav && (
        <>
          <BottomNavigation activeTab={activeTab} />
        </>
      )}

      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => {
          setIsTransactionModalOpen(false);
          setEditingTransaction(undefined);
        }}
        onSubmit={handleSubmitTransaction}
        editTransaction={editingTransaction}
      />
      
      <ReportsModal
        isOpen={isReportsModalOpen}
        onClose={() => setIsReportsModalOpen(false)}
        // transactions={transactions} // Removed this prop
      />
    </div>
  );
}

export default App;