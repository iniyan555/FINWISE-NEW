import React from 'react';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';

interface HealthScoreGaugeProps {
  score: number;
  maxScore?: number;
  change?: number;
  status?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const HealthScoreGauge: React.FC<HealthScoreGaugeProps> = ({
  score = 74,
  maxScore = 100,
  change = 6,
  status = 'GOOD',
  size = 'md',
}) => {
  // Semi-circle SVG calculation
  const radius = size === 'sm' ? 46 : size === 'lg' ? 76 : 60;
  const strokeWidth = size === 'sm' ? 8 : size === 'lg' ? 12 : 10;
  const circumference = Math.PI * radius; // Half circle arc
  const strokeDashoffset = circumference - (score / maxScore) * circumference;

  const width = (radius + strokeWidth) * 2;
  const height = radius + strokeWidth + 10;

  // Determine color accents strictly adhering to: green for positive, amber for warning, red for risk
  const getScoreColor = (val: number) => {
    if (val >= 70) return '#10b981'; // positive emerald
    if (val >= 50) return '#f59e0b'; // amber warning
    return '#ef4444'; // red risk
  };

  return (
    <div id="health-score-card" className="flex flex-col items-center">
      <div className="relative flex items-center justify-center">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible"
        >
          {/* Background Arc */}
          <path
            d={`M ${strokeWidth},${height - 10} A ${radius},${radius} 0 0,1 ${width - strokeWidth},${height - 10}`}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Progress Arc */}
          <path
            d={`M ${strokeWidth},${height - 10} A ${radius},${radius} 0 0,1 ${width - strokeWidth},${height - 10}`}
            fill="none"
            stroke={getScoreColor(score)}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Score Readout */}
        <div className="absolute bottom-2 flex flex-col items-center">
          <div className="flex items-baseline">
            <span
              id="health-score-number"
              className={`${
                size === 'sm' ? 'text-2xl' : size === 'lg' ? 'text-4xl' : 'text-3xl'
              } font-bold tracking-tight text-[#1A1F2C]`}
            >
              {score}
            </span>
            <span className="text-xs font-semibold text-gray-400 ml-0.5">/{maxScore}</span>
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-3 h-3" />
            {status}
          </span>
        </div>
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>+{change} points from last month</span>
        </div>
      )}
    </div>
  );
};
