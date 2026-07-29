import React from 'react';
import StandardModal from '../../../../components/common/StandardModal';
import { useIntelFilterStore } from '../../../../../store/useIntelFilterStore';

const MoreFiltersModal = ({ isOpen, onClose }) => {
  const {
    brand,
    priceBand,
    priority,
    performanceTier,
    setBrand,
    setPriceBand,
    setPriority,
    setPerformanceTier,
    resetAdvancedFilters,
  } = useIntelFilterStore();

  if (!isOpen) return null;

  return (
    <StandardModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      <div className="p-5 font-sans space-y-4 bg-white dark:bg-slate-900 rounded-xl">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-3">
          <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">
            Advanced Signal Stream Filters
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-sm font-bold"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800"
            >
              <option value="all">All Priorities</option>
              <option value="HIGH">High Priority</option>
              <option value="MED">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Price Band</label>
            <select
              value={priceBand}
              onChange={(e) => setPriceBand(e.target.value)}
              className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800"
            >
              <option value="all">All Prices</option>
              <option value="under1000">Under ₹1,000</option>
              <option value="above5000">Above ₹5,000</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Brand</label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800"
            >
              <option value="all">All Brands</option>
              <option value="Autofy">Autofy Pro</option>
              <option value="Realify">Realify Select</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Performance Tier</label>
            <select
              value={performanceTier}
              onChange={(e) => setPerformanceTier(e.target.value)}
              className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800"
            >
              <option value="all">All Tiers</option>
              <option value="top20">Top 20%</option>
              <option value="bottom20">Bottom 20%</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-800">
          <button
            onClick={resetAdvancedFilters}
            className="text-xs font-semibold text-gray-500 hover:text-gray-900 underline"
          >
            Reset Filters
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
          >
            Apply &amp; Close
          </button>
        </div>
      </div>
    </StandardModal>
  );
};

export default MoreFiltersModal;
