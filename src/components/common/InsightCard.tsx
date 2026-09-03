import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface InsightCardProps {
  id?: string;
  title?: string;
  message: string;
  highlight?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  tone?: 'blue' | 'amber' | 'emerald';
}

export const InsightCard: React.FC<InsightCardProps> = ({
  id = 'ai-insight-card',
  title = 'FinWise noticed',
  message,
  highlight,
  ctaText,
  onCtaClick,
  tone = 'blue',
}) => {
  const toneStyles = {
    blue: {
      bg: 'bg-indigo-50/60 border-indigo-100',
      iconBg: 'bg-indigo-600 text-white',
      badgeText: 'text-indigo-700',
      btn: 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white',
    },
    amber: {
      bg: 'bg-amber-50/60 border-amber-200/80',
      iconBg: 'bg-amber-600 text-white',
      badgeText: 'text-amber-800',
      btn: 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white',
    },
    emerald: {
      bg: 'bg-emerald-50/60 border-emerald-200/80',
      iconBg: 'bg-emerald-600 text-white',
      badgeText: 'text-emerald-800',
      btn: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white',
    },
  }[tone];

  return (
    <div
      id={id}
      className={`rounded-2xl border p-5 transition-all ${toneStyles.bg} relative overflow-hidden`}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center shadow-xs ${toneStyles.iconBg}`}
        >
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-xs font-semibold uppercase tracking-wider ${toneStyles.badgeText}`}>
              ✨ {title}
            </span>
          </div>
          <p className="text-sm sm:text-base text-[#1A1F2C] leading-relaxed font-normal">
            {message}
          </p>
          {highlight && (
            <p className="mt-2 text-xs font-semibold text-[#1A1F2C] bg-white/80 px-3 py-1.5 rounded-lg border border-gray-200 inline-block">
              {highlight}
            </p>
          )}

          {ctaText && (
            <div className="mt-4">
              <button
                type="button"
                id={`${id}-cta`}
                onClick={onCtaClick}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-colors ${toneStyles.btn}`}
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
