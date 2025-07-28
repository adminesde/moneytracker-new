import React, { useState } from 'react';
import { Settings, Bell, HelpCircle, LogOut, User, CreditCard, Shield, Sun, Moon, Lock, Info, Trash2 } from 'lucide-react'; // Import Info icon and Trash2
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../integrations/supabase/client';
import { showError } from '../utils/toast';
import { useSession } from '../context/SessionContext';
import { useProfile } from '../hooks/useProfile';
import { useTransactions } from '../hooks/useTransactions'; // Import useTransactions
import EditProfileModal from './EditProfileModal';
import ResetPasswordModal from './ResetPasswordModal';
import AboutCreatorModal from './AboutCreatorModal';
import ConfirmDeleteAllTransactionsModal from './ConfirmDeleteAllTransactionsModal'; // New import
import { ProfileFormData } from '../types/Profile';

const Profile: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { session } = useSession();
  const { profile, isLoadingProfile, updateProfile } = useProfile();
  const { deleteAllTransactions } = useTransactions(); // Get deleteAllTransactions from context

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isAboutCreatorModalOpen, setIsAboutCreatorModalOpen] = useState(false);
  const [isConfirmDeleteAllTransactionsModalOpen, setIsConfirmDeleteAllTransactionsModalOpen] = useState(false); // New state

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
      showError('Gagal keluar. Silakan coba lagi.');
    }
  };

  const handleEditProfileSubmit = async (formData: ProfileFormData) => {
    await updateProfile(formData);
  };

  const handleConfirmDeleteAllTransactions = async () => {
    await deleteAllTransactions();
    setIsConfirmDeleteAllTransactionsModalOpen(false);
  };

  const menuItems = [
    { 
      icon: User, 
      title: 'Edit Profile', 
      subtitle: 'Ubah informasi pribadi', 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-100', 
      darkBgColor: 'dark:bg-blue-900',
      onClick: () => setIsEditProfileModalOpen(true)
    },
    { 
      icon: Lock, 
      title: 'Reset Kata Sandi', 
      subtitle: 'Ubah kata sandi akun Anda', 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-100', 
      darkBgColor: 'dark:bg-purple-900',
      onClick: () => setIsResetPasswordModalOpen(true)
    },
    { // New menu item for Reset All Transactions
      icon: Trash2, 
      title: 'Reset Semua Transaksi', 
      subtitle: 'Hapus semua data transaksi Anda', 
      color: 'text-red-600', 
      bgColor: 'bg-red-100', 
      darkBgColor: 'dark:bg-red-900',
      onClick: () => setIsConfirmDeleteAllTransactionsModalOpen(true)
    },
    { 
      icon: Info, 
      title: 'Tentang Kreator Aplikasi', 
      subtitle: 'Informasi tentang pengembang', 
      color: 'text-teal-600', 
      bgColor: 'bg-teal-100', 
      darkBgColor: 'dark:bg-teal-900',
      onClick: () => setIsAboutCreatorModalOpen(true)
    },
  ];

  const displayName = profile?.first_name || session?.user?.email || 'Pengguna';
  const displayEmail = session?.user?.email || 'Tidak tersedia';

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 pb-28 px-4 text-gray-900 dark:text-gray-100 overflow-y-auto"> {/* Added overflow-y-auto */}
      {/* Header */}
      <div className="pt-12 pb-6">
        <h1 className="text-2xl font-bold mb-2">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">Kelola akun dan pengaturan Anda</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 mb-6 shadow-sm border border-gray-50 dark:border-gray-700"> {/* Reduced p-6 to p-4 */}
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center"> {/* Reduced w-16 h-16 to w-14 h-14 */}
            <User size={28} className="text-white" /> {/* Reduced size to 28 */}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">
              {isLoadingProfile ? 'Memuat...' : displayName}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{displayEmail}</p>
            {/* Removed Premium Member text */}
          </div>
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6 shadow-sm border border-gray-50 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between space-x-4"
        >
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${theme === 'light' ? 'bg-yellow-100' : 'bg-indigo-900'}`}>
              {theme === 'light' ? (
                <Sun size={20} className="text-yellow-600" />
              ) : (
                <Moon size={20} className="text-indigo-300" />
              )}
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold">Mode Tampilan</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {theme === 'light' ? 'Terang' : 'Gelap'}
              </p>
            </div>
          </div>
          <div className="text-gray-400">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </button>
      </div>

      {/* Menu Items */}
      <div className="space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.title}
              onClick={item.onClick}
              className="w-full bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-50 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${item.bgColor} ${item.darkBgColor}`}>
                  <Icon size={20} className={item.color} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.subtitle}</p>
                </div>
                <div className="text-gray-400">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full bg-red-50 border border-red-100 rounded-2xl p-4 mt-6 hover:bg-red-100 transition-colors group dark:bg-red-900 dark:border-red-800 dark:hover:bg-red-800"
      >
        <div className="flex items-center justify-center space-x-3">
          <LogOut size={20} className="text-red-600 group-hover:text-red-700 dark:text-red-300 dark:group-hover:text-200" />
          <span className="font-semibold text-red-600 group-hover:text-red-700 dark:text-red-300 dark:group-hover:text-200">Keluar</span>
        </div>
      </button>

      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        onSubmit={handleEditProfileSubmit}
        initialData={profile ? { first_name: profile.first_name || '', last_name: profile.last_name || '' } : undefined}
      />

      <ResetPasswordModal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
      />

      <AboutCreatorModal
        isOpen={isAboutCreatorModalOpen}
        onClose={() => setIsAboutCreatorModalOpen(false)}
      />

      <ConfirmDeleteAllTransactionsModal
        isOpen={isConfirmDeleteAllTransactionsModalOpen}
        onClose={() => setIsConfirmDeleteAllTransactionsModalOpen(false)}
        onConfirm={handleConfirmDeleteAllTransactions}
      />
    </div>
  );
};

export default Profile;