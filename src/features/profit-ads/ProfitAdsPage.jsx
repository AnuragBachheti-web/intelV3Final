import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import RealifyBrief from '../intel/shared/components/common/RealifyBrief';
import { REALIFY_BRIEF } from '../intel/shared/data/realifyBriefData';

const ProfitAdsPage = () => {
  const briefData = REALIFY_BRIEF;

  return (
    <DashboardLayout 
      title="Profit & Ads" 
      subtitle="Profit analytics and ad performance"
      showTabs={false}
      showAIPrompt={false}
    >
      <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 space-y-8">
        <RealifyBrief data={briefData} />
        
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-5">
            <i className="fa-solid fa-chart-pie text-2xl text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">Profit & Ads</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm leading-relaxed">
            Unified profit analytics and ad performance intelligence is coming soon. Stay tuned for margin-adjusted ROAS, TACOS breakdowns, and channel-level profitability.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfitAdsPage;
