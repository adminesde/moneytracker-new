import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { Edit, Trash2, ArrowUpCircle, ArrowDownCircle, Filter, RefreshCcw } from 'lucide-react'; // Import RefreshCcw
import { useTransactions } from '../hooks/useTransactions';
import { Transaction } from '../types/Transaction';
import { formatCurrency } from '../utils/dateUtils';
import { useTheme } from '../context/ThemeContext';

interface HistoryProps {
  onEditTransaction: (transaction: Transaction) => void;
}

const History: React.FC<HistoryProps> = ({ onEditTransaction }) => {
  const { transactions, deleteTransaction, refetchTransactions } = useTransactions(); // Get refetchTransactions
  const { theme } = useTheme();
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const filteredTransactions = transactions.filter(t => {
    const transactionDate = parseISO(t.date);
    const matchesMonth = transactionDate.getMonth() === selectedMonth;
    const matchesYear = transactionDate.getFullYear() === selectedYear;
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesMonth && matchesYear && matchesType && matchesSearch;
  });

  const groupedTransactions = filteredTransactions.reduce((acc, transaction) => {
    const dateKey = format(parseISO(transaction.date), 'EEEE, dd MMMM yyyy', { locale: id });
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(transaction);
    return acc;
  }, {} as Record<string, Transaction[]>);

  const handleResetFilters = () => {
    setFilterType('all');
    setSearchTerm('');
    setSelectedMonth(new Date().getMonth());
    setSelectedYear(new Date().getFullYear());
  };

  const handleRefresh = () => {
    refetchTransactions();
  };

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 pb-28 px-4 text-gray-900 dark:text-gray-100 overflow-y-auto">
      {/* Header */}
      <div className="pt-12 pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Riwayat Transaksi</h1>
          <p className="text-gray-600 dark:text-gray-400">Lihat dan kelola semua transaksi Anda</p>
        </div>
        <button
          onClick={handleRefresh}
          className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 p-3 rounded-full shadow-sm border border-gray-50 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
          title="Refresh Data"
        >
          <RefreshCcw size={24} />
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6 shadow-sm border border-gray-50 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <Filter size={20} className="text-gray-500 dark:text-gray-400" />
          <span className="font-semibold">Filter Transaksi</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Cari transaksi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
            />
          </div>
          <div className="flex-1">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
            >
              <option value="all">Semua</option>
              <option value="income">Pemasukan</option>
              <option value="expense">Pengeluaran</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
          >
            {months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleResetFilters}
          className="w-full mt-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Reset Filter
        </button>
      </div>

      {/* Transaction List */}
      {Object.keys(groupedTransactions).length === 0 ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          <p>Tidak ada transaksi yang ditemukan.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTransactions).map(([date, transactionsForDate]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 px-2">{date}</h3>
              <div className="space-y-3">
                {transactionsForDate.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-50 dark:border-gray-700 flex items-center justify-between hover:shadow-md transition-all duration-200 hover:scale-[1.01]"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full ${
                        transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
                      }`}>
                        {transaction.type === 'income' ? (
                          <ArrowUpCircle size={20} className="text-green-600 dark:text-green-400" />
                        ) : (
                          <ArrowDownCircle size={20} className="text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold">{transaction.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`font-bold text-lg ${
                        transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === 'expense' && '-'}
                        {formatCurrency(transaction.amount)}
                      </span>
                      <button
                        onClick={() => onEditTransaction(transaction)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        title="Edit Transaksi"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => deleteTransaction(transaction.id)}
                        className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Hapus Transaksi"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;