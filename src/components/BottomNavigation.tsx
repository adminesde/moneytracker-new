import React from 'react';
import { Home, BarChart3, User, PieChart, Target } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom'; // Import hooks

interface BottomNavigationProps {
  activeTab: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation(); // To check current path

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'history', label: 'History', icon: BarChart3, path: '/history' },
    { id: 'statistics', label: 'Statistik', icon: PieChart, path: '/statistics' },
    { id: 'goals', label: 'Goals', icon: Target, path: '/goals' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  ];

  const handleTabClick = (path: string) => {
    if (location.pathname !== path) { // Only navigate if not already on the path
      navigate(path);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="relative max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-full shadow-2xl border border-gray-100 dark:border-gray-700 px-4 py-3 mb-4">
          <div className="flex justify-between items-center relative">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <div key={tab.id} className="relative flex flex-col items-center">
                  {isActive && (
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                      <div className="bg-emerald-500 rounded-full p-4 shadow-2xl border-4 border-white dark:border-gray-900">
                        <Icon size={24} className="text-white" />
                      </div>
                      <div className="text-center mt-2">
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900 dark:text-emerald-300 px-2 py-1 rounded-full">
                          {tab.label}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {!isActive && (
                    <button
                      onClick={() => handleTabClick(tab.path)}
                      className="flex flex-col items-center py-2 px-4 rounded-2xl transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Icon 
                        size={20} 
                        className="text-gray-400 dark:text-gray-500 transition-colors duration-300" 
                      />
                      <span className="text-xs mt-1 text-gray-400 dark:text-gray-500 font-medium">
                        {tab.label}
                      </span>
                    </button>
                  )}
                  
                  {isActive && (
                    <button
                      onClick={() => handleTabClick(tab.path)}
                      className="flex flex-col items-center py-2 px-4 rounded-2xl transition-all duration-300 opacity-0"
                    >
                      <Icon size={20} />
                      <span className="text-xs mt-1 font-medium">
                        {tab.label}
                      </span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;