import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { formatCurrency } from '../utils/dateUtils';
import { format, parse, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, getMonth, getYear } from 'date-fns';
import { id } from 'date-fns/locale';
import { useTheme } from '../context/ThemeContext';
import { useTransactions } from '../hooks/useTransactions';

// Define colors for the Pie Chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#a4de6c'];

interface FinancialChartsProps {
  onRefresh: () => void; // New prop for refresh
}

const FinancialCharts: React.FC<FinancialChartsProps> = ({ onRefresh }) => {
  const { transactions } = useTransactions();
  const { theme } = useTheme();

  const textColor = theme === 'dark' ? '#E5E7EB' : '#1F2937';
  const gridColor = theme === 'dark' ? '#4B5563' : '#E5E7EB';

  const getMonthlyTrendData = () => {
    const monthlyDataMap = new Map<string, { income: number; expense: number }>();

    transactions.forEach(t => {
      const monthYear = format(parseISO(t.date), 'MMM yyyy', { locale: id });
      if (!monthlyDataMap.has(monthYear)) {
        monthlyDataMap.set(monthYear, { income: 0, expense: 0 });
      }
      const data = monthlyDataMap.get(monthYear)!;
      if (t.type === 'income') {
        data.income += t.amount;
      } else {
        data.expense += t.amount;
      }
    });

    const sortedData = Array.from(monthlyDataMap.entries())
      .map(([name, values]) => ({ name, ...values }))
      .sort((a, b) => {
        const dateA = parse(a.name, 'MMM yyyy', new Date(), { locale: id });
        const dateB = parse(b.name, 'MMM yyyy', new Date(), { locale: id });
        return dateA.getTime() - dateB.getTime();
      });

    return sortedData;
  };

  const monthlyTrendData = getMonthlyTrendData();

  const getDailyTrendData = () => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    const daysInMonth = eachDayOfInterval({ start, end });

    const dailyDataMap = new Map<string, { income: number; expense: number }>();

    daysInMonth.forEach(day => {
      const dateKey = format(day, 'dd/MM', { locale: id });
      dailyDataMap.set(dateKey, { income: 0, expense: 0 });
    });

    transactions.forEach(t => {
      const transactionDate = parseISO(t.date);
      if (getMonth(transactionDate) === getMonth(now) && getYear(transactionDate) === getYear(now)) {
        const dateKey = format(transactionDate, 'dd/MM', { locale: id });
        const data = dailyDataMap.get(dateKey);
        if (data) {
          if (t.type === 'income') {
            data.income += t.amount;
          } else {
            data.expense += t.amount;
          }
        }
      }
    });

    return Array.from(dailyDataMap.entries()).map(([name, values]) => ({ name, ...values }));
  };

  const dailyTrendData = getDailyTrendData();

  const getCategoryData = () => {
    const categoryMap = new Map<string, number>();

    transactions.filter(t => t.type === 'expense').forEach(t => {
      categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
    });

    return Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
  };

  const categoryData = getCategoryData();

  return (
    <div className="space-y-8 mb-8">
      {/* Monthly Trend Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-50 dark:border-gray-700">
        <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-gray-100">Tren Bulanan</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={monthlyTrendData} margin={{ left: 40, right: 0, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={textColor} />
            <YAxis stroke={textColor} tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#10B981" name="Pemasukan" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="expense" stroke="#EF4444" name="Pengeluaran" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Trend Chart (Current Month) */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-50 dark:border-gray-700">
        <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-gray-100">Tren Harian (Bulan Ini)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={dailyTrendData} margin={{ left: 40, right: 0, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={textColor} />
            <YAxis stroke={textColor} tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#10B981" name="Pemasukan" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="expense" stroke="#EF4444" name="Pengeluaran" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown Pie Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-50 dark:border-gray-700">
        <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-gray-100">Pengeluaran per Kategori</h3>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ color: textColor }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">Tidak ada data pengeluaran untuk ditampilkan.</p>
        )}
      </div>
    </div>
  );
};

export default FinancialCharts;