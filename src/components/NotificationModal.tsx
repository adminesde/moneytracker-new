import React from 'react';
import { X, Bell, AlertCircle } from 'lucide-react';
import { Goal } from '../types/Goal';
import { formatCurrency } from '../utils/dateUtils';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  exceededGoal: Goal | null;
  currentSpending: number;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, exceededGoal, currentSpending }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto text-gray-900 dark:text-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold">Notifikasi</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          {exceededGoal ? (
            <div className="space-y-4">
              <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-red-600 dark:text-red-400">Batas Pengeluaran Terlampaui!</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Anda telah melebihi batas pengeluaran untuk target:
              </p>
              <div className="bg-red-50 dark:bg-red-900 p-4 rounded-xl border border-red-100 dark:border-red-800">
                <p className="font-semibold text-lg text-red-700 dark:text-red-300">{exceededGoal.name}</p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  Pengeluaran saat ini: <span className="font-bold">{formatCurrency(currentSpending)}</span>
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  Batas: <span className="font-bold">{formatCurrency(exceededGoal.target_amount)}</span>
                </p>
                <p className="text-xs text-red-500 dark:text-red-500 mt-2">
                  Periode: {format(parseISO(exceededGoal.start_date), 'dd MMM yyyy', { locale: id })}
                  {exceededGoal.end_date && ` - ${format(parseISO(exceededGoal.end_date), 'dd MMM yyyy', { locale: id })}`}
                </p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                Pertimbangkan untuk menyesuaikan pengeluaran Anda atau memperbarui target.
              </p>
            </div>
          ) : (
            <>
              <Bell size={48} className="text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Tidak ada notifikasi baru saat ini.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Kami akan memberi tahu Anda tentang pembaruan penting dan pengingat target.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;