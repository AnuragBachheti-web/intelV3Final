import React from 'react';

const SubscriptionTab = () => {
  const plans = [
    { id: 'free', name: 'Free', price: '$0', current: false, features: ['1 source', '500 reads', '50 queries', '5 actions'] },
    { id: 'base', name: 'Base', price: '$29', current: false, features: ['2 sources', '2,000 reads', '200 queries', '50 actions'] },
    { id: 'pro', name: 'Pro', price: '$79', current: true, features: ['5 sources', '5,000 reads', '500 queries', '200 actions'] },
    { id: 'aro', name: 'Aro', price: '$199', current: false, features: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited'] },
  ];

  const usage = [
    { label: 'Lens Reads', val: 2450, total: 5000, color: 'bg-brand dark:bg-gray-600' },
    { label: 'CMD Queries', val: 187, total: 500, color: 'bg-brand dark:bg-gray-600' },
    { label: 'Agent Actions', val: 42, total: 200, color: 'bg-brand dark:bg-gray-600' },
    { label: 'Catalog SKUs', val: 247, total: 'Unlimited', color: 'bg-emerald-600', isLabelOnly: true },
  ];

  return (
    <div className="space-y-6">
      {/* Plan Selection */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">Choose Your Plan</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Upgrade or downgrade anytime. Changes apply immediately.</p>
          </div>
          <button className="px-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all active:scale-95">
            <i className="fa-solid fa-file-invoice-dollar mr-2"></i>Pricing Help
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative p-5 rounded-2xl border-2 transition-all group ${
                plan.current 
                  ? 'border-brand dark:border-gray-500 bg-blue-50/10 dark:bg-blue-900/10' 
                  : 'border-gray-100 dark:border-slate-800 hover:border-gray-200 dark:hover:border-slate-700'
              }`}
            >
              {plan.current && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-brand text-white text-[10px] font-bold rounded-full shadow-lg dark:bg-gray-600">
                  CURRENT
                </div>
              )}
              <p className={`text-xs font-bold mb-2 ${plan.current ? 'text-blue-600' : 'text-gray-500'}`}>{plan.name}</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold text-gray-900 dark:text-slate-100">{plan.price}</span>
                <span className="text-xs text-gray-500">/mo</span>
              </div>
              
              <ul className="mt-6 space-y-3 mb-8">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-[11px] text-gray-600 dark:text-slate-400 font-medium">
                    <i className={`fa-solid fa-check ${plan.current ? 'text-blue-500' : 'text-emerald-500'}`}></i>
                    {f}
                  </li>
                ))}
              </ul>

              <button 
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                  plan.current 
                    ? 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-500 cursor-default' 
                    : 'bg-brand text-white hover:bg-brand-hover dark:bg-gray-600 dark:hover:bg-gray-500 shadow-md shadow-black/10 dark:shadow-gray-700/20'
                }`}
              >
                {plan.current ? 'Active Plan' : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Metrics */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-6 tracking-wider">Usage & Limits</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {usage.map((u, i) => (
            <div key={i} className="p-4 bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 rounded-2xl">
              <p className="text-xs font-bold text-gray-500 dark:text-slate-400 mb-1">{u.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900 dark:text-slate-100">{u.val.toLocaleString()}</span>
                <span className="text-xs text-gray-400 dark:text-slate-500">/ {u.total.toLocaleString()}</span>
              </div>
              {!u.isLabelOnly && (
                <div className="w-full bg-gray-200 dark:bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div 
                    className={`${u.color} h-1.5 rounded-full transition-all duration-500`} 
                    style={{ width: `${(u.val / u.total) * 100}%` }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-4 italic">
          <i className="fa-solid fa-circle-info mr-1"></i>
          Usage limits reset on May 31, 2026. Automated top-ups are disabled.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionTab;
