import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface FinancialCardProps {
  title: string;
  amount: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const FinancialCard: React.FC<FinancialCardProps> = ({ 
  title, 
  amount, 
  icon: Icon, 
  iconColor, 
  iconBgColor,
  trend 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-50 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300"> {/* Changed shadow to shadow-xl and added dark mode styles */}
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${iconBgColor}`}>
          <Icon size={24} className={iconColor} />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${
            trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
          }`}>
            {trend.isPositive ? '+' : ''}{trend.value}
          </span>
        )}
      </div>
      <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{amount}</p>
    </div>
  );
};

export default FinancialCard;