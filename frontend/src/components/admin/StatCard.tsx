import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change: number;
  changeLabel?: string;
  color?: 'blue' | 'green' | 'red' | 'purple' | 'orange' | 'yellow';
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  changeLabel = 'from last month',
  color = 'blue',
  loading = false
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      icon: 'text-blue-600',
      text: 'text-blue-700',
      border: 'border-blue-200'
    },
    green: {
      bg: 'bg-green-100',
      icon: 'text-green-600',
      text: 'text-green-700',
      border: 'border-green-200'
    },
    red: {
      bg: 'bg-red-100',
      icon: 'text-red-600',
      text: 'text-red-700',
      border: 'border-red-200'
    },
    purple: {
      bg: 'bg-purple-100',
      icon: 'text-purple-600',
      text: 'text-purple-700',
      border: 'border-purple-200'
    },
    orange: {
      bg: 'bg-orange-100',
      icon: 'text-orange-600',
      text: 'text-orange-700',
      border: 'border-orange-200'
    },
    yellow: {
      bg: 'bg-yellow-100',
      icon: 'text-yellow-600',
      text: 'text-yellow-700',
      border: 'border-yellow-200'
    }
  };

  const isPositive = change >= 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const changeIcon = isPositive ? TrendingUp : TrendingDown;

  const ChangeIcon = changeIcon;

  if (loading) {
    return (
      <Card className="overflow-hidden border">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden border ${colorClasses[color].border} hover:shadow-md transition-shadow`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-3xl font-bold mt-2 text-gray-900">{value}</h3>
            <div className="flex items-center gap-2 mt-3">
              <ChangeIcon className={`h-4 w-4 ${changeColor}`} />
              <span className={`text-sm font-medium ${changeColor}`}>
                {isPositive ? '+' : ''}{change}%
              </span>
              <span className="text-sm text-gray-500">{changeLabel}</span>
            </div>
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color].bg}`}>
            <Icon className={`h-6 w-6 ${colorClasses[color].icon}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;