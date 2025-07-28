import React from 'react';
import { X, Info } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface AboutCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutCreatorModal: React.FC<AboutCreatorModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto text-gray-900 dark:text-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold">Tentang Kreator Aplikasi</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-center">
          <Info size={48} className="text-emerald-500 mx-auto mb-4" />
          {/* Removed h3 with "MoneyTracker" text */}
          <p className="text-gray-700 dark:text-gray-300">
            Aplikasi ini dibuat oleh <span className="font-semibold">Anang Yunarko</span>, seorang pengembang yang peduli terhadap kebutuhan masyarakat akan pengelolaan keuangan pribadi yang sederhana namun efektif.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Terinspirasi dari kebutuhan pribadi dan lingkungan sekitar, aplikasi ini dirancang agar mudah diakses, memiliki tampilan menarik, dan fitur yang relevan dengan kebutuhan harian.
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400 pb-20"> {/* Added pb-20 */}
          MoneyTracker - Anang Creative Production
        </div>
      </div>
    </div>
  );
};

export default AboutCreatorModal;