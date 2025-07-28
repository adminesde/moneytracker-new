import React from 'react';
import FinancialCharts from '../components/FinancialCharts';
import { useTransactions } from '../hooks/useTransactions';
import { RefreshCcw } from 'lucide-react'; // Import RefreshCcw

const Statistics: React.FC = () => {
  const { refetchTransactions } = useTransactions(); // Get refetchTransactions

  const handleRefresh = () => {
    refetchTransactions();
  };

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 pb-28 px-4 text-gray-900 dark:text-gray-100 overflow-y-auto">
      {/* Header */}
      <div className="pt-12 pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Statistik Keuangan</h1>
          <p className="text-gray-600 dark:text-gray-400">Analisis mendalam tentang keuangan Anda</p>
        </div>
        <button
          onClick={handleRefresh}
          className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 p-3 rounded-full shadow-sm border border-gray-50 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
          title="Refresh Data"
        >
          <RefreshCcw size={24} />
        </button>
      </div>

      {/* Financial Charts */}
      <FinancialCharts onRefresh={handleRefresh} />
    </div>
  );
};

export default Statistics;