import React, { useState, useEffect } from 'react';
import { X, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { showSuccess, showError } from '../utils/toast';
import { useTheme } from '../context/ThemeContext';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setNewPassword('');
      setConfirmPassword('');
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (newPassword.length < 6) {
      showError('Kata sandi baru harus minimal 6 karakter.');
      setIsSubmitting(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      showError('Konfirmasi kata sandi tidak cocok.');
      setIsSubmitting(false);
      return;
    }

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error('Error updating password:', error);
      showError(`Gagal memperbarui kata sandi: ${error.message}`);
    } else {
      showSuccess('Kata sandi berhasil diperbarui!');
      onClose();
    }
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto text-gray-900 dark:text-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold">Reset Kata Sandi</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kata Sandi Baru *
            </label>
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-600 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
              <div className="p-4 bg-gray-200 dark:bg-gray-600">
                <Lock size={20} className="text-gray-600 dark:text-gray-300" />
              </div>
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="flex-1 px-4 py-3 pr-0 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Minimal 6 karakter"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="py-3 px-4 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Konfirmasi Kata Sandi Baru *
            </label>
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-600 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
              <div className="p-4 bg-gray-200 dark:bg-gray-600">
                <Lock size={20} className="text-gray-600 dark:text-gray-300" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="flex-1 px-4 py-3 pr-0 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Ulangi kata sandi baru"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="py-3 px-4 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-semibold transition-colors shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Memperbarui...</span>
              </>
            ) : (
              <>
                <Lock size={20} />
                <span>Perbarui Kata Sandi</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal;