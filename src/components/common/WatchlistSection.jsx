import React from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const deepDiveWatchlistItems = [
  {
    title: 'Premium Wireless Headphones',
    sku: 'WH-PRO-2024',
    stock: '47',
    velocity: '23/day',
    status: 'LOW',
    progress: 15,
    progressColor: 'bg-red-500',
    subtext: '2 days until stockout',
    metricLabel1: 'Stock',
    metricLabel2: 'Velocity',
  },
  {
    title: 'Smart Home Security Camera',
    sku: 'CAM-SEC-5000',
    stock: '342',
    velocity: '+287%',
    status: 'HOT',
    progress: 85,
    progressColor: 'bg-green-500',
    subtext: 'Trending on social media',
    metricLabel1: 'Stock',
    metricLabel2: 'Velocity',
  },
  {
    title: 'Organic Cotton T-Shirt',
    sku: 'APP-TS-ORG-01',
    stock: '$24.99',
    velocity: '$19.99',
    status: 'PRICE',
    progress: 60,
    progressColor: 'bg-yellow-500',
    subtext: 'Price optimization opportunity',
    metricLabel1: 'Current Price',
    metricLabel2: 'Comp. Price',
  },
];

const WatchlistCard = ({ title, sku, stock, velocity, image, status, statusColor, progress, progressColor, subtext, metricLabel1 = "Stock", metricLabel2 = "Velocity", neutral, onClick }) => {
  return (
    <div
      className={`p-4 rounded-xl border transition-all hover:shadow-md ${neutral ? 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-gray-300 dark:hover:border-slate-700 cursor-pointer' : statusColor}`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3 mb-3">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-14 h-14 rounded-lg object-contain bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-800 flex-shrink-0 shadow-sm transition-transform hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/150?text=Product';
            }}
          />
        ) : (
          <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 border border-dashed border-gray-300 dark:border-slate-700">
            <i className="fa-solid fa-box text-gray-400"></i>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h4 className="font-bold text-gray-900 dark:text-slate-100 text-sm truncate">{title}</h4>
            {status && (
              <span className={`px-2 py-1 text-white text-[10px] rounded-lg font-bold shadow-sm flex-shrink-0 ml-2 ${status === 'LOW' ? 'bg-red-600' : status === 'HOT' ? 'bg-green-600' : 'bg-yellow-600'}`}>
                {status}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 dark:text-slate-400">SKU: {sku}</p>
        </div>
      </div>
      <div className={`grid ${velocity ? 'grid-cols-2' : 'grid-cols-1'} gap-3 mb-3`}>
        <div>
          <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">{metricLabel1}</p>
          <p className="text-lg font-bold text-gray-900 dark:text-slate-100">{stock}</p>
        </div>
        {velocity && (
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">{metricLabel2}</p>
            <p className="text-lg font-bold text-gray-900 dark:text-slate-100">{velocity}</p>
          </div>
        )}
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
        <div className={`h-full transition-all duration-1000 ${progressColor}`} style={{ width: `${progress}%` }}></div>
      </div>
      <p className="text-xs text-gray-600 dark:text-slate-400">{subtext}</p>
    </div>
  );
};

const WatchlistSection = ({ items, title, actionButtons }) => {
  const displayItems = items || [];
  const displayTitle = title || "Watchlist";

  return (
    <section id="watchlist" className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">{displayTitle}</h3>
        {actionButtons && (
          <div className="flex items-center gap-2">
            {actionButtons}
          </div>
        )}
      </div>
      <div className="space-y-4">
        {displayItems.map((item, idx) => (
          <WatchlistCard key={idx} {...item} />
        ))}
      </div>
      <button className="w-full mt-4 px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl text-sm font-medium transition text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700">
        <i className="fa-solid fa-plus mr-2"></i>Add Product
      </button>
    </section>
  );
};

export { WatchlistCard };
export default WatchlistSection;
