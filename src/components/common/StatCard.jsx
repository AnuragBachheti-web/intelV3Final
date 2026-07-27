import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import Skeleton from './Skeleton';
import { useAIStore } from '../../store/useAIStore';

// Longer than any sparkline path in the 0..100x0..30 viewBox — used as a fixed
// stroke-dasharray/offset pair so the wave draws itself in on every mount.
const SPARKLINE_DRAW_LENGTH = 220;

const StatCard = ({
  type = 'metric', // 'metric' (default dashboard) or 'iconic' (history style)
  title,
  value,
  change,
  isPositive = true,
  subtext,
  icon,
  color = 'blue', // for iconic type
  loading = false,
  onClick,
  showIcon = true,
  isSelected = false
}) => {
  const { addAiReference } = useAIStore();

  // Draw the sparkline in on mount/refresh instead of popping in static.
  const [sparkDrawn, setSparkDrawn] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setSparkDrawn(true)));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleRefClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addAiReference({ title, value });
  };

  // Skeleton for metric style
  if (loading && type === 'metric') {
    return (
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm p-5 h-40 flex flex-col justify-between">
        <div>
          <Skeleton variant="text" width="60%" className="mb-2" />
          <Skeleton variant="rectangle" width="80%" height={32} className="mb-3" />
          <Skeleton variant="text" width="40%" />
        </div>
        <Skeleton variant="rectangle" width="100%" height={24} className="opacity-30" />
      </div>
    );
  }

  // Skeleton for iconic style
  if (loading && type === 'iconic') {
    return (
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <Skeleton variant="rectangle" width={40} height={40} className="rounded-lg" />
          <Skeleton variant="rectangle" width={50} height={20} className="rounded-full" />
        </div>
        <Skeleton variant="rectangle" width="70%" height={32} className="mb-2" />
        <Skeleton variant="text" width="50%" />
      </div>
    );
  }

  // Metric Style (Redesigned matching ss3)
  if (type === 'metric') {
    const bgClass = isPositive
      ? 'bg-gradient-to-br from-emerald-50 to-white border-emerald-100 dark:from-emerald-900/20 dark:to-slate-900/20 dark:border-emerald-900/30'
      : 'bg-gradient-to-br from-red-50 to-white border-red-100 dark:from-red-900/20 dark:to-slate-900/20 dark:border-red-900/30';
    const valueColor = isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400';
    const badgeBg = isPositive ? 'bg-emerald-100/50 text-emerald-600 dark:bg-emerald-900/30' : 'bg-red-100/50 text-red-600 dark:bg-red-900/30';

    return (
      <div
        onClick={onClick}
        className={`${bgClass} border rounded-2xl p-4 flex flex-col justify-between h-[110px] relative transition-all group hover:shadow-sm ${(onClick || isSelected) ? 'cursor-pointer ring-1 ring-black/5 dark:ring-white/5' : ''}`}
      >
        {/* AI Reference Icon */}
        <button
          onClick={handleRefClick}
          className="absolute top-3 right-3 z-20 w-6 h-6 flex items-center justify-center rounded-full bg-white/50 dark:bg-slate-800/50 text-slate-400 hover:text-brand-600 dark:hover:text-blue-400 hover:bg-white shadow-sm transition-all opacity-0 group-hover:opacity-100"
          title="Attach as reference"
        >
          <i className="fa-solid fa-paperclip text-[10px]"></i>
        </button>

        <div className="flex justify-between items-end h-full w-full">
          {/* Left Side: Title, Value, Subtext, Badge */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] font-semibold text-gray-500 dark:text-slate-400">
              {title}
            </span>
            <span className="text-[18px] font-bold text-gray-900 dark:text-slate-100 tracking-tight leading-tight mt-1">
              {value}
            </span>
            <span className="text-[12px] text-gray-400 dark:text-slate-500">
              {subtext || "from last week"}
            </span>
          </div>

          {/* Right Side: Percentage Change */}
          <div className={`text-[15px] font-bold ${valueColor} pb-1`}>
            {change}
          </div>
        </div>
      </div>
    );
  }

  // Iconic Style (History/Stats style)
  const getIconClasses = (c) => {
    const map = {
      blue: 'from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30 border-blue-200 dark:border-blue-800 text-brand-blue bg-brand-blue/10 dark:bg-brand-blue/20 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400',
      green: 'from-green-50 to-green-100/50 dark:from-green-950/50 dark:to-green-900/30 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 bg-green-600/10 dark:bg-green-600/20 bg-green-100 dark:bg-green-900/50',
      purple: 'from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/30 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 bg-purple-600/10 dark:bg-purple-600/20 bg-purple-100 dark:bg-purple-900/50',
      orange: 'from-orange-50 to-orange-100/50 dark:from-orange-950/50 dark:to-orange-900/30 border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 bg-orange-600/10 dark:bg-orange-600/20 bg-orange-100 dark:bg-orange-900/50',
    };
    const classes = (map[c] || map.blue).split(' ');
    return {
      cardBg: classes.slice(0, 4).join(' '),
      borderColor: classes[4],
      iconColor: classes[5],
      iconBg: classes.slice(6, 8).join(' '),
      badgeBg: classes.slice(8, 10).join(' '),
      badgeText: classes.slice(10).join(' '),
    };
  };

  const style = getIconClasses(color);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
      className={`bg-gradient-to-br ${style.cardBg} rounded-xl ${showIcon ? 'p-5 h-full flex flex-col justify-center' : 'px-4 py-2.5'} border ${style.borderColor} shadow-sm hover:shadow-md transition-all group ${onClick ? 'cursor-pointer' : ''} relative overflow-hidden`}
    >
      <div className="flex items-center justify-between relative z-10">
        {showIcon ? (
          <div className={`w-10 h-10 ${style.iconBg} rounded-lg flex items-center justify-center`}>
            <i className={`fa-solid ${icon} ${style.iconColor} text-lg`}></i>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="text-2xl font-bold text-gray-900 dark:text-brand-100 leading-tight">{value}</div>
            <div className="text-[11px] text-gray-500 dark:text-brand-400 font-medium uppercase tracking-wider">{title}</div>
          </div>
        )}
        <div className="flex flex-col items-end gap-1">
          {subtext && (
            <span className={`text-[10px] font-bold ${style.badgeText} ${style.badgeBg} px-2 py-0.5 rounded-full uppercase tracking-tighter`}>
              {subtext}
            </span>
          )}
          {showIcon && (
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
              <i className={`fa-solid fa-arrow-right-long ${style.iconColor} text-sm`}></i>
            </div>
          )}
        </div>
      </div>
      {showIcon && (
        <>
          <div className="text-3xl font-bold text-gray-900 dark:text-brand-100 mb-0.5 relative z-10 transition-all">{value}</div>
          <div className="text-sm text-gray-500 dark:text-brand-400 relative z-10">{title}</div>
        </>
      )}

      {/* Decorative background element for premium feel */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 dark:bg-black/5 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
    </motion.div>
  );
};

export default StatCard;
