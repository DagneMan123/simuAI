import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: number; // Percentage change (e.g. 12.5 or -5)
  changeLabel?: string; // Text like "vs last month"
  prefix?: string; // Currency like "ETB " or "$"
  suffix?: string; // Text after number like " users"
  color?: 'blue' | 'green' | 'red' | 'purple' | 'orange' | 'indigo';
  loading?: boolean;
  tooltipText?: string; // Information when hovering
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  changeLabel = 'from last month',
  prefix = '',
  suffix = '',
  color = 'blue',
  loading = false,
  tooltipText
}) => {
  // Professional color themes
  const colorStyles = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    green: "text-green-600 bg-green-50 border-green-100",
    red: "text-red-600 bg-red-50 border-red-100",
    purple: "text-purple-600 bg-purple-50 border-purple-100",
    orange: "text-orange-600 bg-orange-50 border-orange-100",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
  };

  const isPositive = change !== undefined && change >= 0;
  
  // Format number with commas (e.g. 1000 -> 1,000)
  const formattedValue = typeof value === 'number' 
    ? new Intl.NumberFormat('en-US').format(value) 
    : value;

  if (loading) {
    return (
      <Card className="border-none shadow-sm overflow-hidden animate-pulse">
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="h-8 w-32 bg-gray-200 rounded"></div>
          <div className="h-4 w-40 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {title}
              </span>
             {tooltipText && (
              <span title={tooltipText} className="cursor-help inline-flex items-center">
              <HelpCircle size={12} className="text-gray-300 hover:text-gray-400 transition-colors" />
              </span>
              )}
            </div>
            
            <div className="flex items-baseline gap-1">
              {prefix && <span className="text-lg font-semibold text-gray-400">{prefix}</span>}
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                {formattedValue}
              </h3>
              {suffix && <span className="text-sm font-medium text-gray-500">{suffix}</span>}
            </div>

            {change !== undefined && (
              <div className="flex items-center gap-2 mt-2">
                <div className={cn(
                  "flex items-center px-1.5 py-0.5 rounded-md text-[11px] font-bold",
                  isPositive ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
                )}>
                  {isPositive ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                  {isPositive ? '+' : ''}{change}%
                </div>
                <span className="text-[10px] font-medium text-gray-400 italic">
                  {changeLabel}
                </span>
              </div>
            )}
          </div>

          <div className={cn(
            "p-3 rounded-xl transition-transform group-hover:scale-110 border shadow-sm",
            colorStyles[color]
          )}>
            <Icon size={22} strokeWidth={2.5} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;