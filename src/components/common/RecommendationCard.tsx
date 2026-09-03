import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Recommendation } from '../../types';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onActionClick?: (tab: string) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onActionClick,
}) => {
  const [whyOpen, setWhyOpen] = useState(false);
  const [applied, setApplied] = useState(false);

  return (
    <div
      id={`recommendation-card-${recommendation.id}`}
      className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs transition-all duration-200 hover:shadow-sm"
    >
      {/* Header row: Rank, Title, Potential Improvement badge */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center border border-indigo-200">
            {recommendation.rank}
          </span>
          <h4 className="font-semibold text-base sm:text-lg text-[#1A1F2C] tracking-tight">
            {recommendation.title}
          </h4>
        </div>
        {recommendation.potentialImprovement && (
          <span className="shrink-0 px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            {recommendation.potentialImprovement}
          </span>
        )}
      </div>

      {/* 5-Step UX Pattern */}
      <div className="space-y-3.5 text-sm">
        {/* 1. YOUR SITUATION */}
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
          <p className="text-[11px] font-semibold tracking-wider uppercase text-gray-400 mb-0.5">
            1. Your Situation
          </p>
          <p className="text-[#1A1F2C] font-medium">{recommendation.yourSituation}</p>
        </div>

        {/* 2. WHAT FINWISE NOTICED */}
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
          <p className="text-[11px] font-semibold tracking-wider uppercase text-gray-400 mb-0.5">
            2. What FinWise Noticed
          </p>
          <p className="text-[#1A1F2C] font-medium">{recommendation.whatFinwiseNoticed}</p>
        </div>

        {/* 3. RECOMMENDED ACTION */}
        <div className="bg-indigo-50/50 rounded-xl p-3.5 border border-indigo-100/80">
          <p className="text-[11px] font-semibold tracking-wider uppercase text-indigo-600 mb-0.5">
            3. Recommended Action
          </p>
          <p className="text-[#1A1F2C] font-semibold">{recommendation.recommendedAction}</p>
        </div>

        {/* 4. WHY? (Expandable accordion) */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            type="button"
            id={`toggle-why-${recommendation.id}`}
            onClick={() => setWhyOpen(!whyOpen)}
            className="w-full px-3.5 py-2.5 flex items-center justify-between text-left text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-gray-200 text-gray-600 text-[10px] font-bold flex items-center justify-center">
                ?
              </span>
              <span>4. Why this recommendation?</span>
            </span>
            {whyOpen ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {whyOpen && (
            <div className="p-3.5 bg-white text-gray-600 text-xs sm:text-sm leading-relaxed border-t border-gray-100">
              {recommendation.why}
            </div>
          )}
        </div>

        {/* 5. WHAT HAPPENS IF YOU DO IT? (Impact) */}
        <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-100/80">
          <p className="text-[11px] font-semibold tracking-wider uppercase text-emerald-700 mb-0.5">
            5. What Happens If You Do It? (Impact)
          </p>
          <p className="text-emerald-900 font-medium text-xs sm:text-sm">
            {recommendation.impact}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
        {recommendation.difficulty && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span>Difficulty:</span>
            <span className="font-semibold text-gray-700">{recommendation.difficulty}</span>
          </div>
        )}
        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            id={`mark-done-${recommendation.id}`}
            onClick={() => setApplied(!applied)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1 ${
              applied
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {applied ? 'Action Queued' : 'Add to Plan'}
          </button>
          <button
            type="button"
            id={`cta-btn-${recommendation.id}`}
            onClick={() => onActionClick?.(recommendation.ctaActionTab)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white transition-colors flex items-center gap-1 shadow-xs"
          >
            <span>{recommendation.ctaLabel}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
