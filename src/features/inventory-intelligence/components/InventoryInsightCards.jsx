import React from 'react';

const Section = ({ title, items, icon, iconColor, linkText }) => (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
          <i className={`fa-solid ${icon} ${iconColor}`}></i> {title}
        </h3>
        {linkText && <button className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline">{linkText}</button>}
      </div>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className={`flex items-center justify-between p-2 rounded-xl border transition-all hover:scale-[1.01] ${
            item.color === 'red' ? 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/50' : 
            item.color === 'orange' ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900/50' :
            'bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/50'
          }`}>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-slate-100 truncate">{item.title}</p>
              <p className="text-[10px] text-gray-500 dark:text-slate-400">{item.sub}</p>
            </div>
            <div className="text-right ml-4">
              <p className={`text-sm font-bold ${
                item.color === 'red' ? 'text-red-600' : 
                item.color === 'orange' ? 'text-orange-600' : 'text-blue-600'
              }`}>{item.val}</p>
              {item.label && <p className="text-[10px] text-gray-500 dark:text-slate-400">{item.label}</p>}
              {item.color === 'blue' && <button className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">Send to Inbox</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
);

const InventoryInsightCards = () => {
  const oosRisk = [
    { title: 'Premium Wireless Headphones', sub: 'On-hand: 47 · Velocity: 23/day', val: '2 days', label: 'Est. stockout', color: 'red' },
    { title: 'USB-C Hub 7-in-1', sub: 'On-hand: 82 · Velocity: 14/day', val: '6 days', label: 'Est. stockout', color: 'red' },
    { title: 'Pet Grooming Kit 5-Piece', sub: 'On-hand: 134 · Velocity: 11/day', val: '12 days', label: 'Est. stockout', color: 'orange' },
  ];

  const poDrafts = [
    { title: 'Premium Wireless Headphones', sub: 'Vendor: TechSource · LT: 14d', val: '500 units', color: 'blue' },
    { title: 'USB-C Hub 7-in-1', sub: 'Vendor: ComponentPro · LT: 21d', val: '300 units', color: 'blue' },
  ];

  const overstock = [
    { title: 'Bamboo Cutting Board Set', sub: 'DOC: 245d · 890 units', val: '$42,720', label: 'Tied up capital', color: 'orange' },
    { title: 'Kitchen Timer Digital 3-Pack', sub: 'DOC: 210d · 1,420 units', val: '$28,400', label: 'Tied up capital', color: 'orange' },
  ];

  return (
    <div className="space-y-6">
      <Section title="At OOS Risk (14d)" items={oosRisk} icon="fa-triangle-exclamation" iconColor="text-red-500" linkText="View all 12" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Section title="Recommended PO Drafts" items={poDrafts} icon="fa-file-invoice" iconColor="text-blue-600" />
        <Section title="Overstock (DOC>180d)" items={overstock} icon="fa-warehouse" iconColor="text-orange-500" />
      </div>
    </div>
  );
};

export default InventoryInsightCards;
