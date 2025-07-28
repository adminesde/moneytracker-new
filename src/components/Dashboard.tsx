import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Wallet, FileText, Plus, Bell, RefreshCcw } from 'lucide-react';
import FinancialCard from './FinancialCard';
import { useTransactions } from '../hooks/useTransactions';
import { getGreeting, formatCurrency } from '../utils/dateUtils';
import { useTheme } from '../context/ThemeContext';
import { useSession } from '../context/SessionContext';
import { useProfile } from '../hooks/useProfile';
import { useGoals } from '../hooks/useGoals';
import { format, startOfMonth, endOfMonth, differenceInDays, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import NotificationModal from './NotificationModal';

interface DashboardProps {
  onShowReports: () => void;
  onAddTransaction: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onShowReports, onAddTransaction }) => {
  const { transactions, getBalance, getTotalIncome, getTotalExpense, refetchTransactions } = useTransactions();

  const [headerBgImage, setHeaderBgImage] = useState('');
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const { theme } = useTheme();
  const { session } = useSession();
  const { profile } = useProfile();
  const { goals, exceededSpendingGoal, currentSpendingForExceededGoal, refetchGoals } = useGoals();

  useEffect(() => {
    const hour = new Date().getHours();
    let imageUrl = '';
    if (hour >= 5 && hour < 12) {
      imageUrl = 'https://imglink.io/i/9eaf9402-b990-4d17-a710-c9b14672b0f2.jpg'; // Pagi
    } else if (hour >= 12 && hour < 18) {
      imageUrl = 'https://imglink.io/i/71f513d1-95da-4d7d-9f55-fb8939b76e06.jpg'; // Siang/Sore
    } else {
      imageUrl = 'https://imglink.io/i/9916a3ca-42da-4266-8672-1b55f584a38f.jpg'; // Malam
    }
    setHeaderBgImage(imageUrl);
  }, []);

  // Efek untuk memperbarui waktu setiap detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const displayName = profile?.first_name && profile?.last_name
    ? `${profile.first_name} ${profile.last_name}`
    : profile?.first_name || session?.user?.email || 'Pengguna';
  
  const balance = getBalance();
  const totalIncome = getTotalIncome();
  const totalExpense = getTotalExpense();

  console.log('Dashboard - Current Balance:', balance);
  console.log('Dashboard - Total Income:', totalIncome);
  console.log('Dashboard - Total Expense:', totalExpense);
  console.log('Dashboard - All Transactions:', transactions);

  const getMostFrequentCategory = () => {
    const expenseCategories: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      expenseCategories[t.category] = (expenseCategories[t.category] || 0) + 1;
    });

    let mostFrequent = 'N/A';
    let maxCount = 0;
    for (const category in expenseCategories) {
      if (expenseCategories[category] > maxCount) {
        maxCount = expenseCategories[category];
        mostFrequent = category;
      }
    }
    return mostFrequent;
  };

  const getDailyAverageSpending = () => {
    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    
    const currentMonthExpenses = transactions
      .filter(t => t.type === 'expense' &&
                   parseISO(t.date) >= startOfCurrentMonth &&
                   parseISO(t.date) <= now)
      .reduce((sum, t) => sum + t.amount, 0);

    const daysPassedInMonth = differenceInDays(now, startOfCurrentMonth) + 1;
    return daysPassedInMonth > 0 ? currentMonthExpenses / daysPassedInMonth : 0;
  };

  const getMonthlyGoalProgress = () => {
    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);

    const monthlySpendingGoal = goals.find(g => 
      g.type === 'spending_limit' && 
      g.period === 'monthly' &&
      parseISO(g.start_date) <= now &&
      (g.end_date ? parseISO(g.end_date) >= now : true)
    );

    if (!monthlySpendingGoal) return { percentage: 0, amount: 0, target: 0, hasGoal: false };

    const currentSpending = transactions
      .filter(t => t.type === 'expense' &&
                   parseISO(t.date) >= startOfCurrentMonth &&
                   parseISO(t.date) <= now)
      .reduce((sum, t) => sum + t.amount, 0);

    const percentage = (currentSpending / monthlySpendingGoal.target_amount) * 100;
    return { 
      percentage: Math.min(100, percentage), 
      amount: currentSpending, 
      target: monthlySpendingGoal.target_amount,
      hasGoal: true
    };
  };

  const mostFrequentCategory = getMostFrequentCategory();
  const dailyAverageSpending = getDailyAverageSpending();
  const monthlyGoal = getMonthlyGoalProgress();

  const handleRefresh = () => {
    refetchTransactions();
    refetchGoals();
  };

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 pb-28 text-gray-900 dark:text-gray-100 overflow-y-auto">
      {/* Header */}
      <div 
        className={`pt-6 pb-10 rounded-b-3xl text-white shadow-lg relative overflow-hidden`} 
        style={{ backgroundImage: `url(${headerBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="flex items-center justify-between mb-1 px-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              {getGreeting()}, {displayName}!
            </h1>
            {/* Jam Real-time dan deskripsi 'Kelola keuangan' */}
            <div className="flex flex-col items-start"> {/* Changed to flex-col items-start for left alignment */}
              <div className="text-sm font-medium mb-2 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md">
                {format(currentTime, 'HH:mm:ss', { locale: id })} WIB
              </div>
              <p className="text-sm bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md mt-1">Kelola keuangan pribadi Anda dengan mudah</p> {/* Removed ml-2, added mt-1 */}
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onAddTransaction}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-2xl shadow-lg transition-colors flex items-center justify-center"
              title="Tambah Transaksi Baru"
            >
              <Plus size={20} />
            </button>
            {exceededSpendingGoal && (
              <button
                onClick={() => setIsNotificationModalOpen(true)}
                className="bg-red-500/80 backdrop-blur-sm hover:bg-red-600/80 text-white p-3 rounded-2xl shadow-lg transition-colors flex items-center justify-center relative"
                title="Notifikasi Batas Pengeluaran Terlampaui"
              >
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping"></span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full"></span>
              </button>
            )}
            <button
              onClick={onShowReports}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-2xl shadow-lg transition-colors"
              title="Laporan Keuangan"
            >
              <FileText size={20} />
            </button>
            <button
              onClick={handleRefresh}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-2xl shadow-lg transition-colors flex items-center justify-center"
              title="Refresh Data"
            >
              <RefreshCcw size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Balance Card - moved outside the dynamic background header */}
      <div className="bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 rounded-3xl p-6 mt-[-40px] mx-4 mb-8 text-white shadow-xl relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-emerald-100 text-sm font-medium">Saldo Saat Ini</p>
            <h2 className="text-3xl font-bold">{formatCurrency(balance)}</h2>
            {/* "Update real-time" dipindahkan di sini */}
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 bg-emerald-200 rounded-full mr-2 animate-pulse"></div>
              <span className="text-emerald-100 text-sm font-medium">Update real-time</span>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
            <Wallet size={28} className="text-white" />
          </div>
        </div>
        
        <div className="flex justify-end text-emerald-100 text-sm">
          {new Date().toLocaleDateString('id-ID', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long',
            year: 'numeric' // Added year
          })}
        </div>
      </div>

      {/* Financial Summary */}
      <div className="mb-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Ringkasan Keuangan</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
            Bulan ini
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FinancialCard
            key="total-income-card"
            title="Total Pemasukan"
            amount={formatCurrency(totalIncome)}
            icon={TrendingUp}
            iconColor="text-green-600 dark:text-green-400"
            iconBgColor="bg-green-100 dark:bg-green-900"
          />
          <FinancialCard
            key="total-expense-card"
            title="Total Pengeluaran"
            amount={formatCurrency(totalExpense)}
            icon={TrendingDown}
            iconColor="text-red-500 dark:text-red-400"
            iconBgColor="bg-red-100 dark:bg-red-900"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-50 dark:border-gray-700 mx-4">
        <h3 className="text-lg font-bold mb-6">Statistik Cepat</h3>
        <div className="space-y-5">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600 dark:text-gray-400">Transaksi Terbanyak</span>
            <span className="font-bold bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
              {mostFrequentCategory}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600 dark:text-gray-400">Rata-rata Harian</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(dailyAverageSpending)}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600 dark:text-gray-400">Target Bulanan</span>
            {monthlyGoal.hasGoal ? (
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${monthlyGoal.percentage}%` }}></div>
                </div>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  {Math.round(monthlyGoal.percentage)}%
                </span>
              </div>
            ) : (
              <span className="text-gray-500 dark:text-gray-400 text-sm">Tidak ada target bulanan</span>
            )}
          </div>
        </div>
      </div>

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        exceededGoal={exceededSpendingGoal}
        currentSpending={currentSpendingForExceededGoal}
      />
    </div>
  );
};

export default Dashboard;