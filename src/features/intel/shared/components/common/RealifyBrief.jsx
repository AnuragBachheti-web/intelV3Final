import React, { useState } from "react";
import { REALIFY_BRIEF_SLIDES } from "../../data/insightsDummyData";

const RealifyBrief = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const slide = REALIFY_BRIEF_SLIDES[activeSlide] || REALIFY_BRIEF_SLIDES[0];

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-3 shadow-sm transition-all duration-300">

      {/* Header with Title (left) & Expand/Collapse Chevron (right) */}
      <div className={`flex items-center justify-between ${!isCollapsed ? 'border-b border-gray-100 dark:border-slate-800 pb-2' : ''}`}>
        <span className="uppercase tracking-[0.22em] text-[10px] font-bold text-[#9a8f81]">
          THE REALIFY BRIEF
        </span>

        {/* Expand / Collapse Chevron Button (Request 4) */}
        <button
          onClick={() => setIsCollapsed(c => !c)}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          title={isCollapsed ? "Expand Realify Brief" : "Collapse Realify Brief"}
        >
          <i className={`fa-solid fa-chevron-down text-xs transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <div className="animate-in fade-in duration-200">
          {/* Title */}
          <h2 className="mt-2 text-[13px] sm:text-[14px] font-bold leading-tight text-gray-900 dark:text-slate-100">
            {slide.title}
          </h2>

          {/* Subtitle */}
          <p className="mt-1 text-[11px] sm:text-[12px] leading-normal text-gray-500 dark:text-slate-400">
            {slide.subtitle}
          </p>

          {/* Carousel Pagination Dots */}
          <div className="mt-2.5 flex items-center gap-1.5">
            {REALIFY_BRIEF_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveSlide(idx)}
                title={`Slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${activeSlide === idx
                    ? 'w-5 bg-gray-900 dark:bg-slate-100'
                    : 'w-2 bg-[#e9dfd2] dark:bg-slate-700 hover:bg-gray-400 dark:hover:bg-slate-600'
                  }`}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default RealifyBrief;