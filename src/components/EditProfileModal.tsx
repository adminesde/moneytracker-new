import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ProfileFormData } from '../types/Profile';
import { useTheme } from '../context/ThemeContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: ProfileFormData) => void;
  initialData?: ProfileFormData;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: '',
    last_name: ''
  });

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || ''
      });
    } else if (isOpen && !initialData) {
      setFormData({ first_name: '', last_name: '' });
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto text-gray-900 dark:text-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold">Edit Profil</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nama Depan
            </label>
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
              placeholder="Masukkan nama depan"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nama Belakang
            </label>
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
              placeholder="Masukkan nama belakang"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-semibold transition-colors shadow-lg hover:shadow-xl"
          >
            Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;