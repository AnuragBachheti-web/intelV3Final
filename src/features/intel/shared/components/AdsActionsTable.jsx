import React, { useState } from 'react';

export const ADS_ACTIONS_DATA = [
  {
    id: 'ads-1',
    title: 'Bike Accessories — SP Manual',
    channel: 'Amazon',
    campaignType: 'SP',
    strategy: 'Manual • Down only',
    lever: 'SKU-level lever',
    leverType: 'green',
    spend: '₹92,400',
    impr: '1,28,400',
    clicks: '3,120',
    efficiency: '41% ACOS',
    pace: '77%',
    skus: '2',
  },
  {
    id: 'ads-2',
    title: 'Bike Covers — SP Auto Discovery',
    channel: 'Amazon',
    campaignType: 'SP',
    strategy: 'Auto • Dynamic — down only',
    lever: 'SKU-level lever',
    leverType: 'green',
    spend: '₹14,200',
    impr: '34,000',
    clicks: '680',
    efficiency: '32% ACOS',
    pace: '71%',
    skus: '1',
  },
  {
    id: 'ads-3',
    title: 'Brand Store Launch — SB',
    channel: 'Amazon',
    campaignType: 'SB',
    strategy: 'Auto',
    lever: 'lever = campaign creative',
    leverType: 'yellow',
    spend: '₹26,000',
    impr: '45,000',
    clicks: '900',
    efficiency: '29% ACOS',
    pace: '65%',
    skus: '1~',
  },
  {
    id: 'ads-4',
    title: 'Car Covers Category — SP Manual',
    channel: 'Amazon',
    campaignType: 'SP',
    strategy: 'Manual • Fixed',
    lever: 'SKU-level lever',
    leverType: 'green',
    spend: '₹8,200',
    impr: '22,000',
    clicks: '310',
    efficiency: '35% ACOS',
    pace: '55%',
    skus: '1',
  },
  {
    id: 'ads-5',
    title: 'Punch Covers — SP Manual',
    channel: 'Amazon',
    campaignType: 'SP',
    strategy: 'Manual • Down only',
    lever: 'SKU-level lever',
    leverType: 'green',
    spend: '₹11,200',
    impr: '26,000',
    clicks: '420',
    efficiency: '29% ACOS',
    pace: '70%',
    skus: '1',
  },
  {
    id: 'ads-6',
    title: 'Rider Gear — SP Manual',
    channel: 'Amazon',
    campaignType: 'SP',
    strategy: 'Manual • Up and down',
    lever: 'SKU-level lever',
    leverType: 'green',
    spend: '₹64,400',
    impr: '1,41,000',
    clicks: '2,890',
    efficiency: '25% ACOS',
    pace: '81%',
    skus: '2',
  },
  {
    id: 'ads-7',
    title: 'Small Accessories — SD',
    channel: 'Amazon',
    campaignType: 'SD',
    strategy: 'vCPM',
    lever: 'SKU-level lever',
    leverType: 'green',
    spend: '₹21,500',
    impr: '3,10,000',
    clicks: '1,240',
    efficiency: '26% ACOS',
    pace: '77%',
    skus: '2',
  },
  {
    id: 'ads-8',
    title: 'Prospecting — Rider Gear',
    channel: 'Meta',
    campaignType: 'Sales',
    strategy: 'Lowest cost',
    lever: 'lever = ad (creative)',
    leverType: 'yellow',
    spend: '₹55,500',
    impr: '12,40,000',
    clicks: '8,900',
    efficiency: '4.9x ROAS',
    pace: '79%',
    skus: '2~',
  },
  {
    id: 'ads-9',
    title: 'Retargeting — Cart Abandoners',
    channel: 'Meta',
    campaignType: 'Sales',
    strategy: 'Min ROAS',
    lever: 'lever = ad (creative)',
    leverType: 'yellow',
    spend: '₹37,000',
    impr: '84,000',
    clicks: '3,200',
    efficiency: '4.2x ROAS',
    pace: '82%',
    skus: '3~',
  },
];

const AdsActionsTable = ({ onRowClick, expandedId }) => {
  const [viewMode, setViewMode] = useState('campaign'); // 'sku' or 'campaign'
  const [isCampaignTypeOpen, setIsCampaignTypeOpen] = useState(false);
  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  
  const [selectedChannels, setSelectedChannels] = useState(['Amazon', 'Meta', 'Google']);
  const [selectedTypes, setSelectedTypes] = useState(['SP', 'SB', 'SD', 'Sales', 'Awareness', 'Search', 'Shopping', 'PMax', 'Display']);
  
  const [columns, setColumns] = useState({
    spend: true,
    impr: true,
    clicks: true,
    efficiency: true,
    budget: false,
    pace: true,
    skus: true
  });

  const toggleChannel = (channel) => {
    setSelectedChannels(prev => prev.includes(channel) ? prev.filter(c => c !== channel) : [...prev, channel]);
  };

  const toggleType = (type) => {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const toggleColumn = (col) => {
    setColumns(prev => ({ ...prev, [col]: !prev[col] }));
  };

  const filteredData = ADS_ACTIONS_DATA.filter(row => {
    if (!selectedChannels.includes(row.channel)) return false;
    if (!selectedTypes.includes(row.campaignType)) return false;
    return true;
  });

  return (
    <div className="w-full flex flex-col gap-4">

      {/* Header Row 1: Toggle & Search */}
      <div className="flex items-center justify-between mt-2">
        {/* <div className="flex items-center bg-gray-100 dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
          <button 
            onClick={() => setViewMode('sku')}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors flex items-baseline gap-1.5 ${viewMode === 'sku' ? 'bg-gray-900 text-white dark:bg-slate-100 dark:text-gray-900' : 'text-gray-600 dark:text-slate-400 hover:text-gray-900'}`}
          >
            By SKU <span className={`text-[10px] font-normal ${viewMode === 'sku' ? 'text-gray-400' : 'text-gray-400'}`}>merchandising</span>
          </button>
          <button 
            onClick={() => setViewMode('campaign')}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors flex items-baseline gap-1.5 ${viewMode === 'campaign' ? 'bg-gray-900 text-white dark:bg-slate-100 dark:text-gray-900' : 'text-gray-600 dark:text-slate-400 hover:text-gray-900'}`}
          >
            By Campaign <span className={`text-[10px] font-normal ${viewMode === 'campaign' ? 'text-gray-400' : 'text-gray-400'}`}>execution</span>
          </button>
        </div> */}

        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setIsColumnsOpen(!isColumnsOpen)}
              className="px-3 py-1.5 text-sm font-semibold text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 bg-white"
            >
              Columns <i className="fa-solid fa-caret-down text-xs text-gray-400" />
            </button>
            {isColumnsOpen && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg py-3 z-50 flex flex-col gap-3 px-4">
                {[
                  { key: 'spend', label: 'Spend' },
                  { key: 'impr', label: 'Impr.' },
                  { key: 'clicks', label: 'Clicks' },
                  { key: 'efficiency', label: 'Efficiency' },
                  { key: 'budget', label: 'Budget' },
                  { key: 'pace', label: 'Pace' },
                  { key: 'skus', label: 'SKUs' },
                ].map(col => (
                  <label key={col.key} className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={columns[col.key]} 
                      onChange={() => toggleColumn(col.key)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4" 
                    />
                    <span className="text-[15px] font-medium text-gray-900 dark:text-slate-100">{col.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search"
              className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:border-blue-500 w-48"
            />
          </div>
        </div>
      </div>

      {/* Header Row 2: Filters */}
      <div className="flex items-center gap-3 relative z-20">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">CHANNEL</span>
        <button 
          onClick={() => toggleChannel('Amazon')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${selectedChannels.includes('Amazon') ? 'bg-gray-900 text-white dark:bg-slate-100 dark:text-gray-900' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-400'}`}
        >
          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" /> Amazon
        </button>
        <button 
          onClick={() => toggleChannel('Meta')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${selectedChannels.includes('Meta') ? 'bg-gray-900 text-white dark:bg-slate-100 dark:text-gray-900' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-400'}`}
        >
          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" /> Meta
        </button>
        <button 
          onClick={() => toggleChannel('Google')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${selectedChannels.includes('Google') ? 'bg-gray-900 text-white dark:bg-slate-100 dark:text-gray-900' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-400'}`}
        >
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> Google
        </button>
        <span className="text-xs italic text-gray-400 font-medium">multi-select — pick any combination</span>

        <div className="relative ml-4">
          <button
            onClick={() => setIsCampaignTypeOpen(!isCampaignTypeOpen)}
            className="flex items-center gap-2 px-3 py-1 text-sm font-semibold text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 bg-white"
          >
            Campaign type <i className="fa-solid fa-caret-down text-xs text-gray-400" />
          </button>
          {isCampaignTypeOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg py-2 z-50">
              {['SP', 'SB', 'SD', 'Sales', 'Awareness', 'Search', 'Shopping', 'PMax', 'Display'].map(type => (
                <label key={type} className="flex items-center gap-3 px-4 py-1.5 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={selectedTypes.includes(type)}
                    onChange={() => toggleType(type)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                  />
                  <span className="text-sm text-gray-700 dark:text-slate-300">{type}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-white dark:bg-slate-900 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider border-b border-gray-200 dark:border-slate-800">
                <th className="p-4 w-12"><input type="checkbox" className="rounded border-gray-300" /></th>
                <th className="p-4 font-semibold">CAMPAIGN</th>
                {columns.spend && <th className="p-4 font-semibold">SPEND</th>}
                {columns.impr && <th className="p-4 font-semibold">IMPR.</th>}
                {columns.clicks && <th className="p-4 font-semibold">CLICKS</th>}
                {columns.efficiency && <th className="p-4 font-semibold">EFFICIENCY</th>}
                {columns.budget && <th className="p-4 font-semibold">BUDGET</th>}
                {columns.pace && <th className="p-4 font-semibold">PACE</th>}
                {columns.skus && <th className="p-4 font-semibold">SKUS</th>}
                <th className="p-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800/80">
              {filteredData.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick(row)}
                  className={`cursor-pointer transition-colors ${expandedId === row.id ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-gray-50 dark:hover:bg-slate-800/30'}`}
                >
                  <td className="p-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">{row.title}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${row.channel === 'Amazon' ? 'bg-orange-100 text-orange-800' : 'bg-purple-100 text-purple-800'}`}>
                          {row.channel}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400">
                          {row.campaignType}
                        </span>
                        <span className="text-xs text-gray-500">{row.strategy}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ml-1 ${row.leverType === 'green' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {row.lever}
                        </span>
                      </div>
                    </div>
                  </td>
                  {columns.spend && <td className="p-4 text-sm font-medium text-gray-700 dark:text-slate-300">{row.spend}</td>}
                  {columns.impr && <td className="p-4 text-sm font-medium text-gray-700 dark:text-slate-300">{row.impr}</td>}
                  {columns.clicks && <td className="p-4 text-sm font-medium text-gray-700 dark:text-slate-300">{row.clicks}</td>}
                  {columns.efficiency && <td className="p-4 text-sm font-medium text-gray-700 dark:text-slate-300">{row.efficiency}</td>}
                  {columns.budget && <td className="p-4 text-sm font-medium text-gray-700 dark:text-slate-300">-</td>}
                  {columns.pace && <td className="p-4 text-sm font-bold text-gray-900 dark:text-slate-100">{row.pace}</td>}
                  {columns.skus && <td className="p-4 text-sm font-medium text-gray-700 dark:text-slate-300">{row.skus}</td>}
                  <td className="p-4 text-right">
                    <button className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-100">
                      Simulate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdsActionsTable;
