import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { actionStats, actionItems } from './actionsData';
import ActionStatsCard from './components/ActionStatsCard';
import ActionItem from './components/ActionItem';
import ActionDetail from './components/ActionDetail';
import SimulationModal from './components/SimulationModal';
import CustomActionModal from './components/CustomActionModal';
import { AnimatePresence } from 'framer-motion';
import { useActionFilters } from './hooks/useActionFilters';
import SelectInput from '../../components/ui/SelectInput';

const FILTER_SELECT_CLASS = 'px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-slate-300 focus:ring-2 focus:ring-brand/30 dark:focus:ring-gray-500/30 outline-none transition-all shadow-sm cursor-pointer';

const ActionsPage = () => {
  const [selectedAction, setSelectedAction] = useState(actionItems[0]);
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const [isCustomActionOpen, setIsCustomActionOpen] = useState(false);
  const [simulationAction, setSimulationAction] = useState(null);

  const { activeTab, setActiveTab, searchQuery, setSearchQuery, filters, setFilters, filteredActions, resetFilters } = useActionFilters();

  const handleSimulate = (action) => {
    setSimulationAction(action);
    setIsSimulationOpen(true);
  };

  const actionFilters = (
    <div className="flex items-center gap-3 flex-wrap pb-4">
      <div className="relative">
        <SelectInput
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          className={FILTER_SELECT_CLASS}
        >
          <option value="all">All Priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </SelectInput>
      </div>

      <div className="relative">
        <SelectInput
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className={FILTER_SELECT_CLASS}
        >
          <option value="all">All Categories</option>
          <option value="cash-management">Cash Management</option>
          <option value="payments">Payments</option>
          <option value="collections">Collections</option>
          <option value="forecasting">Forecasting</option>
        </SelectInput>
      </div>

      <div className="relative">
        <SelectInput
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className={FILTER_SELECT_CLASS}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </SelectInput>
      </div>

      <button
        onClick={resetFilters}
        className="px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-500 hover:text-blue-600 transition shadow-sm"
        title="Reset Filters"
      >
        <i className="fa-solid fa-rotate-left"></i>
      </button>

      <div className="flex-1 min-w-[250px]">
        <div className="relative">
          <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="Search actions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand/30 dark:focus:ring-gray-500/30 outline-none dark:text-slate-200 transition-all shadow-sm"
          />
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout
      title="Action Center"
      subtitle="Priority actions to optimize cash flow and operations"
      showTabs={false}
      filters={actionFilters}
    >
      {/* Action Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {actionStats.map((stat, idx) => (
          <ActionStatsCard key={idx} {...stat} />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-1 tracking-tight">Strategic Priority Actions</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 font-medium italic">"Real-time intelligence sorted by urgency and balance impact"</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCustomActionOpen(true)}
            className="h-11 px-6 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl border border-gray-200 dark:border-slate-700 transition hover:bg-gray-200 dark:hover:bg-slate-700 text-sm font-bold flex items-center gap-2 active:scale-95 shadow-sm"
          >
            <i className="fa-solid fa-plus text-[10px]"></i> Custom Action
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Action List */}
        <div className="xl:col-span-2">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full min-h-[600px]">
            <div className="border-b border-gray-100 dark:border-slate-800 p-3 bg-gray-50/30 dark:bg-slate-900/50">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {['All', 'Critical', 'High', 'Medium'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap tracking-tight ${activeTab === tab
                      ? 'bg-brand text-white shadow-md dark:bg-gray-600'
                      : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                      }`}
                  >
                    {tab} ({actionItems.filter(i => tab.toLowerCase() === 'all' || i.priority.toLowerCase() === tab.toLowerCase()).length})
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto max-h-[750px] divide-y divide-gray-50 dark:divide-slate-800/50">
              {filteredActions.length > 0 ? (
                filteredActions.map((action) => (
                  <ActionItem
                    key={action.id}
                    action={action}
                    isSelected={selectedAction?.id === action.id}
                    onClick={setSelectedAction}
                    onSimulate={handleSimulate}
                  />
                ))
              ) : (
                <div className="py-32 text-center">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-slate-800">
                    <i className="fa-solid fa-magnifying-glass text-4xl text-gray-200"></i>
                  </div>
                  <p className="text-gray-500 dark:text-slate-500 font-bold tracking-tight">Zero intelligence matches found</p>
                  <p className="text-xs text-gray-400 mt-1 tracking-widest">Adjust filters or search query</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden h-fit sticky sticky-below-header">
          <ActionDetail
            action={selectedAction}
            onClose={() => setSelectedAction(null)}
          />
        </div>
      </div>

      <AnimatePresence>
        {isSimulationOpen && (
          <SimulationModal
            isOpen={isSimulationOpen}
            onClose={() => setIsSimulationOpen(false)}
            action={simulationAction}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCustomActionOpen && (
          <CustomActionModal
            isOpen={isCustomActionOpen}
            onClose={() => setIsCustomActionOpen(false)}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default ActionsPage;
