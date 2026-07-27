import React from "react";
import { REALIFY_BRIEF } from "../../data/realifyBriefData";

const TONES = {
  emerald: {
    iconBg: "bg-emerald-50 dark:bg-emerald-900/20",
    icon: "text-emerald-600 dark:text-emerald-400",
    value: "text-emerald-600 dark:text-emerald-400",
  },
  blue: {
    iconBg: "bg-blue-50 dark:bg-blue-900/20",
    icon: "text-blue-600 dark:text-blue-400",
    value: "text-gray-900 dark:text-white",
  },
  rose: {
    iconBg: "bg-rose-50 dark:bg-rose-900/20",
    icon: "text-rose-600 dark:text-rose-400",
    value: "text-rose-700 dark:text-rose-400",
  },
};

const RealifyBrief = ({ data }) => {
  const brief = data || REALIFY_BRIEF.sales;
  const stats = brief.stats || [];
  const description = Array.isArray(brief.description)
    ? brief.description
    : brief.description
    ? [brief.description]
    : [];

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm transition-all duration-300">
      {/* Header */}
      <div className="px-6 pt-5">
        <p className="uppercase tracking-[0.18em] text-[11px] font-bold text-gray-700 dark:text-slate-300">
          THE REALIFY BRIEF
        </p>
      </div>

      {/* Stat cards */}
      <div className="px-6 pt-4 pb-5 border-b border-gray-100 dark:border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-slate-800">
          {stats.map((stat) => {
            const tone = TONES[stat.tone] || TONES.blue;
            return (
              <div
                key={stat.key}
                className="flex items-center gap-3 py-3 sm:py-0 sm:px-6 first:sm:pl-0"
              >
                <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${tone.iconBg}`}>
                  <i className={`fa-solid ${stat.icon} ${tone.icon} text-[13px]`} />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400 dark:text-slate-500 mb-1">
                    {stat.label}
                  </p>
                  <p className={`text-[24px] font-extrabold leading-none tracking-tight ${tone.value}`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Description — each line fits on one line and wraps only if too long */}
      <div className="px-6 py-4 space-y-1">
        {description.map((line, idx) => (
          <p key={idx} className="text-[13px] text-gray-600 dark:text-slate-400 leading-relaxed">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
};

export default RealifyBrief;
