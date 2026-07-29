import React, { useState } from 'react';
import { useAIStore } from '../../../../store/useAIStore';

const InsightDetailsPanel = ({ insight, onClose }) => {
  const [showResearch, setShowResearch] = useState(false);
  const { addAiReference } = useAIStore();

  if (!insight) return null;

  // If overview data is available, render the new UI, else render a fallback or nothing.
  if (insight?.overview) {
    const { header, title, problem, rootCause, aiRecommendation, riskIfIgnored, supportingInsights } = insight.overview;
    return (
      <div className="h-full bg-white dark:bg-slate-900 overflow-y-auto custom-scrollbar flex flex-col px-6 py-5 gap-5">
        
        {/* Header and Title */}
        <div className="flex flex-col gap-1.5 mb-2">
          <span className="text-[12px] font-sans text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wide">
            {header}
          </span>
          <h2 className="text-[18px] leading-tight font-bold text-gray-900 dark:text-white font-sans">
            {title}
          </h2>
        </div>

        {/* Problem Card */}
        <div className="bg-[#f5f6f8] dark:bg-slate-800/80 rounded-xl p-4">
          <div className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">PROBLEM</div>
          <p className="text-[14px] text-gray-800 dark:text-slate-300 font-sans leading-relaxed">
            {problem}
          </p>
        </div>

        {/* Root Cause Card */}
        <div className="bg-[#f5f6f8] dark:bg-slate-800/80 rounded-xl p-4">
          <div className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">ROOT CAUSE</div>
          <p className="text-[14px] text-gray-800 dark:text-slate-300 font-sans leading-relaxed">
            {rootCause}
          </p>
        </div>

        {/* AI Recommendation Card */}
        <div className="bg-[#f5f6f8] dark:bg-slate-800/80 rounded-xl p-4">
          <div className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">AI RECOMMENDATION</div>
          <p className="text-[14px] text-gray-800 dark:text-slate-300 font-sans leading-relaxed">
            {aiRecommendation}
          </p>
        </div>

        {/* Risk if Ignored Card */}
        <div className="bg-[#f5f6f8] dark:bg-slate-800/80 rounded-xl p-4">
          <div className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">RISK IF IGNORED</div>
          <p className="text-[14px] text-gray-800 dark:text-slate-300 font-sans leading-relaxed">
            {riskIfIgnored}
          </p>
        </div>

        {/* Supporting Insights Card */}
        {supportingInsights && supportingInsights.length > 0 && (
          <div className="bg-[#f5f6f8] dark:bg-slate-800/80 rounded-xl p-4">
            <div className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3">SUPPORTING INSIGHTS</div>
            <ul className="list-disc pl-5 space-y-2">
              {supportingInsights.map((item, idx) => (
                <li key={idx} className="text-[14px] text-gray-600 dark:text-slate-400 font-sans leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    );
  }

  // Fallback for insights without overview data
  return (
    <div className="h-full bg-white dark:bg-slate-900 overflow-y-auto custom-scrollbar flex flex-col p-6 items-center justify-center text-gray-400">
      <p>No overview data available for this insight.</p>
    </div>
  );
};

export default InsightDetailsPanel;
