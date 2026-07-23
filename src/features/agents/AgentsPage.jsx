import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';

const AgentsPage = () => {
  return (
    <DashboardLayout title="Agents" subtitle="AI Agents & Automation">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-gray-400 dark:text-slate-500">
          <i className="fa-solid fa-robot text-2xl" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-1">Agents</h3>
        <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm">
          Agent management and workflow automation features will appear here.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default AgentsPage;
