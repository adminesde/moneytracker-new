import React, { useState } from 'react';
import { X, Download, Calendar, FileText } from 'lucide-react';
import { Transaction } from '../types/Transaction';
import { generateMonthlyReport, generateYearlyReport } from '../utils/pdfGenerator';
import { useTheme } from '../context/ThemeContext';
import { useTransactions } from '../hooks/useTransactions'; // Import useTransactions

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // transactions: Transaction[]; // No longer needed as prop, will use context
}

const ReportsModal: React.FC<ReportsModalProps> = ({
  isOpen,
  onClose,
  // transactions // No longer needed as prop
}) => {
  const { theme } = useTheme();
  const { transactions } = useTransactions(); // Get transactions from context
  const [reportType, setReportType] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const handleDownload = () => {
    if (reportType === 'monthly') {
      generateMonthlyReport(transactions, selectedMonth, selectedYear);
    } else {
      generateYearlyReport(transactions, selectedYear);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md text-gray-900 dark:text-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold">Laporan Keuangan</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Report Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Jenis Laporan
            </label>
            <div className="flex space-x-3">
              <button
                onClick={() => setReportType('monthly')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl border-2 transition-all ${
                  reportType === 'monthly'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Calendar size={18} />
                <span className="font-medium">Bulanan</span>
              </button>
              <button
                onClick={() => setReportType('yearly')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl border-2 transition-all ${
                  reportType === 'yearly'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <FileText size={18} />
                <span className="font-medium">Tahunan</span>
              </button>
            </div>
          </div>

          {/* Month Selection (for monthly reports) */}
          {reportType === 'monthly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pilih Bulan
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Year Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pilih Tahun
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-semibold transition-colors shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <Download size={20} />
            <span>Download Laporan PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsModal;