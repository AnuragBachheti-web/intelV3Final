import { motion } from 'framer-motion';
import React from 'react';
import BaseModal from '../../../components/common/BaseModal';

const SimulationModal = ({ isOpen, onClose, action }) => (
  <BaseModal isOpen={isOpen} onClose={onClose}>
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      onClick={e => e.stopPropagation()}
    >
      {/* Modal Header */}
      <div className="p-6 border-b border-gray-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Action Simulation</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">Preview the impact of this action before implementing</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
          >
            <i className="fa-solid fa-xmark text-gray-600 dark:text-slate-400 text-xl"></i>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Selected Action */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
          <h4 className="font-bold text-gray-900 dark:text-slate-100 mb-2">Selected Action</h4>
          <p className="text-gray-700 dark:text-slate-300">{action?.title || 'Transfer Funds to Operating Account'}</p>
        </div>

        {/* States Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 p-5 rounded-xl border border-red-200 dark:border-red-900/30">
            <h5 className="font-bold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-chart-line text-red-600"></i>
              Current State
            </h5>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Operating Balance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">$42,800</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Status</p>
                <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg text-xs font-medium">Below Threshold</span>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Risk Level</p>
                <p className="text-lg font-bold text-red-600">High</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-5 rounded-xl border border-green-200 dark:border-green-900/30">
            <h5 className="font-bold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-arrow-trend-up text-green-600"></i>
              Projected State
            </h5>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Operating Balance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">$52,800</p>
                <p className="text-xs text-green-600 font-medium">+$10,000</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Status</p>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg text-xs font-medium">Above Threshold</span>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Risk Level</p>
                <p className="text-lg font-bold text-green-600">Low</p>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Analysis */}
        <div className="mb-6">
          <h5 className="font-bold text-gray-900 dark:text-slate-100 mb-3">Impact Analysis</h5>
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Cash Flow Health</span>
                <span className="text-sm font-bold text-green-600">+24%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '76%' }}></div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Overdraft Risk</span>
                <span className="text-sm font-bold text-green-600">-85%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Liquidity Score</span>
                <span className="text-sm font-bold text-green-600">+18 points</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Considerations */}
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-200 dark:border-yellow-800">
          <h5 className="font-bold text-gray-900 dark:text-slate-100 mb-2 flex items-center gap-2">
            <i className="fa-solid fa-triangle-exclamation text-yellow-600"></i>
            Considerations
          </h5>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <i className="fa-solid fa-circle text-yellow-600 text-[6px] mt-2 flex-shrink-0"></i>
              <span>Savings account balance will decrease to $176,000</span>
            </li>
            <li className="flex items-start gap-2">
              <i className="fa-solid fa-circle text-yellow-600 text-[6px] mt-2 flex-shrink-0"></i>
              <span>Transfer will take 2-4 hours to complete</span>
            </li>
            <li className="flex items-start gap-2">
              <i className="fa-solid fa-circle text-yellow-600 text-[6px] mt-2 flex-shrink-0"></i>
              <span>Interest earnings on savings will reduce by ~$15/month</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="flex-1 px-6 py-3 bg-brand text-white rounded-xl font-medium hover:bg-brand-hover dark:bg-gray-600 dark:hover:bg-gray-500 transition shadow-sm">
            <i className="fa-solid fa-play mr-2"></i>Execute Action
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl text-gray-700 dark:text-slate-300 font-medium transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  </BaseModal>
);

export default SimulationModal;
