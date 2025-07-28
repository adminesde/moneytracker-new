import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { Transaction, TransactionFormData } from '../types/Transaction';
import { useTheme } from '../context/ThemeContext'; // New import

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transaction: Omit<Transaction, 'id' | 'user_id'>) => void; // Updated type
  editTransaction?: Transaction;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editTransaction
}) => {
  const { theme } = useTheme(); // Use theme context
  const [formData, setFormData] = useState<TransactionFormData>({
    title: '',
    amount: '',
    category: '',
    type: 'expense',
    description: ''
  });
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);

  const predefinedCategories = {
    income: ['Gaji', 'Freelance', 'Investasi', 'Bonus'], // 'Lainnya' dihapus
    expense: ['Makanan', 'Transportasi', 'Hiburan', 'Belanja', 'Tagihan', 'Kesehatan'] // 'Lainnya' dihapus
  };

  useEffect(() => {
    if (editTransaction) {
      setFormData({
        title: editTransaction.title,
        amount: editTransaction.amount.toString(),
        category: editTransaction.category,
        type: editTransaction.type,
        description: editTransaction.description || ''
      });
      // Check if the category is custom
      if (!predefinedCategories[editTransaction.type].includes(editTransaction.category)) {
        setCustomCategory(editTransaction.category);
        setShowCustomCategoryInput(true);
      } else {
        setCustomCategory('');
        setShowCustomCategoryInput(false);
      }
    } else {
      setFormData({
        title: '',
        amount: '',
        category: '',
        type: 'expense',
        description: ''
      });
      setCustomCategory('');
      setShowCustomCategoryInput(false);
    }
  }, [editTransaction, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalCategory = formData.category;
    if (showCustomCategoryInput && customCategory) {
      finalCategory = customCategory;
    }

    if (!formData.title || !formData.amount || !finalCategory) {
      alert('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    const transaction: Omit<Transaction, 'id' | 'user_id'> = { // Updated type
      title: formData.title,
      amount: parseFloat(formData.amount),
      category: finalCategory,
      type: formData.type,
      date: editTransaction?.date || new Date().toISOString(),
      description: formData.description
    };

    onSubmit(transaction);
    onClose();
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    if (selectedValue === 'custom') {
      setShowCustomCategoryInput(true);
      setFormData({ ...formData, category: '' }); // Clear category if custom is selected
    } else {
      setShowCustomCategoryInput(false);
      setCustomCategory('');
      setFormData({ ...formData, category: selectedValue });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto text-gray-900 dark:text-gray-100"> {/* Dark mode styles */}
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700"> {/* Dark mode border */}
          <h2 className="text-xl font-bold">
            {editTransaction ? 'Edit Transaksi' : 'Tambah Transaksi'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Jenis Transaksi
            </label>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, type: 'income', category: '' });
                  setCustomCategory('');
                  setShowCustomCategoryInput(false);
                }}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl border-2 transition-all ${
                  formData.type === 'income'
                    ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Plus size={18} />
                <span className="font-medium">Pemasukan</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, type: 'expense', category: '' });
                  setCustomCategory('');
                  setShowCustomCategoryInput(false);
                }}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl border-2 transition-all ${
                  formData.type === 'expense'
                    ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Minus size={18} />
                <span className="font-medium">Pengeluaran</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Judul Transaksi *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
              placeholder="Masukkan judul transaksi"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Jumlah *
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
              placeholder="0"
              min="0"
              step="1000"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kategori *
            </label>
            <select
              value={showCustomCategoryInput ? 'custom' : formData.category}
              onChange={handleCategoryChange}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
              required
            >
              <option value="">Pilih kategori</option>
              {predefinedCategories[formData.type].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              <option value="custom">Lainnya (Kustom)</option>
            </select>
            {showCustomCategoryInput && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full px-4 py-3 mt-3 rounded-2xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                placeholder="Masukkan kategori kustom"
                required
              />
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Deskripsi (Opsional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition-all resize-none"
              placeholder="Tambahkan catatan..."
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-semibold transition-colors shadow-lg hover:shadow-xl"
          >
            {editTransaction ? 'Update Transaksi' : 'Simpan Transaksi'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;