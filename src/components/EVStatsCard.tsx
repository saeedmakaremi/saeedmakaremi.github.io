import React from 'react';
import { motion } from 'framer-motion';
import type { IconType } from 'react-icons';

interface EVStatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: IconType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const EVStatsCard: React.FC<EVStatsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-6 rounded-xl bg-white dark:bg-secondary-800 shadow-lg ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20">
          <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
        </div>
        {trend && (
          <div
            className={`flex items-center ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            <span className="text-sm font-medium">
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </span>
          </div>
        )}
      </div>
      <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-1">
        {title}
      </h3>
      <div className="text-3xl font-bold text-secondary-900 dark:text-white mb-2">
        {value}
      </div>
      <p className="text-sm text-secondary-600 dark:text-secondary-400">
        {description}
      </p>
    </motion.div>
  );
};

export default EVStatsCard; 