import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ConfirmDeleteAllTransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteAllTransactionsModal: React.FC<ConfirmDeleteAllTransactionsModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md text-gray-900 dark:text-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold">Konfirmasi Penghapusan</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-center">
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-600 dark:text-red-400">Hapus Semua Transaksi?</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Tindakan ini akan <span className="font-bold text-red-500">menghapus semua data transaksi Anda secara permanen</span>.
            Tindakan ini tidak dapat dibatalkan.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Apakah Anda yakin ingin melanjutkan?
          </p>
        </div>

        {/* Footer Buttons */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 rounded-2xl font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors shadow-lg"
          >
            Hapus Semua
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteAllTransactionsModal;