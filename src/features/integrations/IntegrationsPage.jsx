import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import RealifyBrief from '../intel/shared/components/common/RealifyBrief';
import { REALIFY_BRIEF } from '../intel/shared/data/realifyBriefData';

const IntegrationsPage = () => {
  const briefData = REALIFY_BRIEF;

  return (
    <DashboardLayout 
      title="Integrations" 
      subtitle="Connect external services & channels"
      showTabs={false}
      showAIPrompt={false}
    >
      <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 space-y-8">
        <RealifyBrief data={briefData} />
        
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-gray-400 dark:text-slate-500">
          <i className="fa-solid fa-plug text-2xl" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-1">Integrations</h3>
        <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm">
          Integration settings and third-party platform connections will appear here.
        </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IntegrationsPage;
