import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  id?: string;
  title: string;
  value: string;
  subtext?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral' | 'caution';
  icon?: LucideIcon;
  badge?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  value,
  subtext,
  change,
  changeType = 'neutral',
  icon: Icon,
  badge,
  onClick,
}) => {
  const getChangeBadgeStyle = () => {
    switch (changeType) {
      case 'positive':
        return 'text-emerald-700 bg-emerald-50 border-emerald-100';
      case 'negative':
        return 'text-rose-700 bg-rose-50 border-rose-100';
      case 'caution':
        return 'text-amber-700 bg-amber-50 border-amber-100';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white rounded-2xl border border-gray-200 p-5 shadow-xs transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-gray-300 hover:shadow-sm' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {title}
        </span>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
              {badge}
            </span>
          )}
          {Icon && (
            <div className="w-8 h-8 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center border border-gray-200">
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1F2C]">{value}</h3>
      </div>

      {(subtext || change) && (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          {change && (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md font-semibold border ${getChangeBadgeStyle()}`}
            >
              {change}
            </span>
          )}
          {subtext && <span className="text-gray-500">{subtext}</span>}
        </div>
      )}
    </div>
  );
};
