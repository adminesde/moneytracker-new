import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Target as TargetIcon, AlertCircle, X, Info, RefreshCcw } from 'lucide-react'; // Import RefreshCcw
import { useGoals } from '../hooks/useGoals';
import { useTransactions } from '../hooks/useTransactions';
import { Goal, GoalFormData } from '../types/Goal';
import { formatCurrency } from '../utils/dateUtils';
import { format, startOfMonth, endOfMonth, parseISO, startOfYear, endOfYear, isWithinInterval } from 'date-fns';
import { id } from 'date-fns/locale';
import { showError, showSuccess } from '../utils/toast';
import { useTheme } from '../context/ThemeContext';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: GoalFormData) => void;
  editGoal?: Goal;
}

const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose, onSubmit, editGoal }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<GoalFormData>({
    name: '',
    target_amount: '',
    type: 'spending_limit',
    period: 'monthly',
    start_date: format(new Date(), 'yyyy-MM-dd'),
    end_date: null,
  });

  useEffect(() => {
    if (editGoal) {
      setFormData({
        name: editGoal.name,
        target_amount: editGoal.target_amount.toString(),
        type: editGoal.type,
        period: editGoal.period,
        start_date: editGoal.start_date,
        end_date: editGoal.end_date || undefined,
      });
    } else {
      setFormData({
        name: '',
        target_amount: '',
        type: 'spending_limit',
        period: 'monthly',
        start_date: format(new Date(), 'yyyy-MM-dd'),
        end_date: null,
      });
    }
  }, [editGoal, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.target_amount || parseFloat(formData.target_amount) <= 0) {
      showError('Mohon lengkapi semua field yang wajib diisi dengan benar.');
      return;
    }

    const submittedData: GoalFormData = {
      ...formData,
      target_amount: parseFloat(formData.target_amount).toString(),
    };

    if (!editGoal) {
      const now = new Date();
      if (submittedData.period === 'monthly') {
        submittedData.start_date = format(startOfMonth(now), 'yyyy-MM-dd');
        submittedData.end_date = format(endOfMonth(now), 'yyyy-MM-dd');
      } else if (submittedData.period === 'yearly') {
        submittedData.start_date = format(startOfYear(now), 'yyyy-MM-dd');
        submittedData.end_date = format(endOfYear(now), 'yyyy-MM-dd');
      }
    }

    onSubmit(submittedData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md max-h-[95vh] overflow-y-auto text-gray-900 dark:text-gray-100 pb-20">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold">{editGoal ? 'Edit Target' : 'Tambah Target Baru'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nama Target *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
              placeholder="Contoh: Batas Pengeluaran Bulanan"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jumlah Target *</label>
            <input
              type="number"
              value={formData.target_amount}
              onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
              placeholder="0"
              min="0"
              step="1000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jenis Target</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'spending_limit' | 'saving_goal' })}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
            >
              <option value="spending_limit">Batas Pengeluaran</option>
              <option value="saving_goal">Target Tabungan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Periode</label>
            <select
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value as 'monthly' | 'yearly' | 'one-time' })}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
            >
              <option value="monthly">Bulanan</option>
              <option value="yearly">Tahunan</option>
              <option value="one-time">Satu Kali</option>
            </select>
          </div>

          {formData.period === 'one-time' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tanggal Mulai</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
              />
            </div>
          )}

          {formData.period === 'one-time' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tanggal Berakhir (Opsional)</label>
              <input
                type="date"
                value={formData.end_date || ''}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value || null })}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-semibold transition-colors shadow-lg hover:shadow-xl"
          >
            {editGoal ? 'Update Target' : 'Simpan Target'}
          </button>
        </form>
      </div>
    </div>
  );
};


const Goals: React.FC = () => {
  const { goals, isLoadingGoals, addGoal, updateGoal, deleteGoal, refetchGoals } = useGoals(); // Get refetchGoals
  const { transactions } = useTransactions();
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>(undefined);

  const handleAddGoal = () => {
    setEditingGoal(undefined);
    setIsGoalModalOpen(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsGoalModalOpen(true);
  };

  const handleSubmitGoal = async (formData: GoalFormData) => {
    const goalData: Omit<Goal, 'id' | 'user_id' | 'created_at'> = {
      name: formData.name,
      target_amount: parseFloat(formData.target_amount),
      type: formData.type,
      period: formData.period,
      start_date: formData.start_date,
      end_date: formData.end_date || null,
    };

    if (editingGoal) {
      await updateGoal(editingGoal.id, goalData);
    } else {
      await addGoal(goalData);
    }
    setIsGoalModalOpen(false);
    setEditingGoal(undefined);
  };

  const handleDeleteGoal = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus target ini?')) {
      await deleteGoal(id);
    }
  };

  const calculateCurrentProgress = (goal: Goal) => {
    const now = new Date();
    const goalStartDate = parseISO(goal.start_date);
    const goalEndDate = goal.end_date ? parseISO(goal.end_date) : null;

    let filteredTransactions = transactions;

    if (goal.period === 'monthly') {
      const startOfCurrentMonth = startOfMonth(now);
      const endOfCurrentMonth = endOfMonth(now);
      filteredTransactions = transactions.filter(t => 
        isWithinInterval(parseISO(t.date), { start: startOfCurrentMonth, end: endOfCurrentMonth })
      );
    } else if (goal.period === 'yearly') {
      const startOfCurrentYear = startOfYear(now);
      const endOfCurrentYear = endOfYear(now);
      filteredTransactions = transactions.filter(t => 
        isWithinInterval(parseISO(t.date), { start: startOfCurrentYear, end: endOfCurrentYear })
      );
    } else if (goal.period === 'one-time' && goalEndDate) {
      filteredTransactions = transactions.filter(t => 
        isWithinInterval(parseISO(t.date), { start: goalStartDate, end: goalEndDate })
      );
    }

    if (goal.type === 'spending_limit') {
      return filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    } else if (goal.type === 'saving_goal') {
      return filteredTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    }
    return 0;
  };

  useEffect(() => {
    goals.forEach(goal => {
      if (goal.type === 'spending_limit' && goal.period === 'monthly') {
        const currentSpending = calculateCurrentProgress(goal);
        if (currentSpending > goal.target_amount) {
          showError(`Peringatan: Anda telah melebihi batas pengeluaran "${goal.name}" sebesar ${formatCurrency(currentSpending - goal.target_amount)}!`);
        }
      }
    });
  }, [goals, transactions]);

  const handleRefresh = () => {
    refetchGoals();
  };

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 pb-28 px-4 text-gray-900 dark:text-gray-100 overflow-y-auto">
      {/* Header */}
      <div className="pt-12 pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Target Keuangan</h1>
          <p className="text-gray-600 dark:text-gray-400">Tetapkan dan lacak tujuan keuangan Anda</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleAddGoal}
            className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-full shadow-lg transition-colors flex items-center justify-center"
            title="Tambah Target Baru"
          >
            <Plus size={24} />
          </button>
          <button
            onClick={handleRefresh}
            className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 p-3 rounded-full shadow-sm border border-gray-50 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
            title="Refresh Data"
          >
            <RefreshCcw size={24} />
          </button>
        </div>
      </div>

      {isLoadingGoals ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">Memuat target...</div>
      ) : goals.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-50 dark:border-gray-700 text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">
            Belum ada target keuangan yang ditetapkan.
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Klik tombol '+' di atas untuk menambahkan target pertama Anda!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map(goal => {
            const isSpendingLimit = goal.type === 'spending_limit';
            const currentProgress = calculateCurrentProgress(goal);
            const progressPercentage = (currentProgress / goal.target_amount) * 100;
            const isExceeded = isSpendingLimit && currentProgress > goal.target_amount;
            const isGoalMet = !isSpendingLimit && currentProgress >= goal.target_amount;

            return (
              <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-50 dark:border-gray-700 flex flex-col hover:shadow-md transition-all duration-200 hover:scale-[1.01]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${isSpendingLimit ? 'bg-red-100 dark:bg-red-900' : 'bg-green-100 dark:bg-green-900'}`}>
                      <TargetIcon size={20} className={isSpendingLimit ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{goal.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{goal.period} {isSpendingLimit ? 'Batas Pengeluaran' : 'Target Tabungan'}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditGoal(goal)}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      title="Edit Target"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Hapus Target"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm font-medium mb-1">
                    <span className="text-gray-700 dark:text-gray-300">
                      {isSpendingLimit ? 'Pengeluaran Saat Ini' : 'Terkumpul'}
                    </span>
                    <span className={`${isExceeded ? 'text-red-600 dark:text-red-400' : (isGoalMet ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400')}`}>
                      {formatCurrency(currentProgress)} / {formatCurrency(goal.target_amount)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${isExceeded ? 'bg-red-500' : (isGoalMet ? 'bg-blue-500' : 'bg-emerald-500')}`}
                      style={{ width: `${Math.min(100, progressPercentage)}%` }}
                    ></div>
                  </div>
                  {isExceeded && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      Melebihi batas pengeluaran!
                    </p>
                  )}
                  {isGoalMet && (
                    <p className="text-blue-500 dark:text-blue-400 text-xs mt-1 flex items-center">
                      <Info size={14} className="mr-1" />
                      Target tabungan tercapai!
                    </p>
                  )}
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Periode: {format(parseISO(goal.start_date), 'dd MMM yyyy', { locale: id })}
                  {goal.end_date && ` - ${format(parseISO(goal.end_date), 'dd MMM yyyy', { locale: id })}`}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => {
          setIsGoalModalOpen(false);
          setEditingGoal(undefined);
        }}
        onSubmit={handleSubmitGoal}
        editGoal={editingGoal}
      />
    </div>
  );
};

export default Goals;