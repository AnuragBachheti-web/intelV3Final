import React from 'react';

const navItems = [
  { id: 'account', name: 'Account', icon: 'fa-user' },
  { id: 'team', name: 'Team', icon: 'fa-users' },
  { id: 'invitations', name: 'Invitations', icon: 'fa-paper-plane' },
  { id: 'access', name: 'Access Management', icon: 'fa-key' },
  { id: 'business-profile', name: 'Business Profile', icon: 'fa-building' },
  { id: 'integrations', name: 'Integrations', icon: 'fa-plug' },
  { id: 'guardrails', name: 'Agent Guardrails', icon: 'fa-shield-halved' },
  { id: 'subscription', name: 'Subscription', icon: 'fa-gem' },
  { id: 'billing', name: 'Billing', icon: 'fa-credit-card' },
  { id: 'notifications', name: 'Notifications', icon: 'fa-bell' },
  { id: 'privacy', name: 'Privacy', icon: 'fa-lock' },
  { id: 'appearance', name: 'Appearance', icon: 'fa-palette' },
];

const SettingsInnerSidebar = ({ activeTab, setActiveTab, onTabChange }) => {
  return (
    <div className="w-64 flex-shrink-0">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden sticky sticky-below-header shadow-[0_1px_3px_0_rgba(0,0,0,0.05)]">
        <nav className="py-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                onTabChange();
              }}
              className={`w-full px-4 py-3 flex items-center gap-3 transition-all relative ${
                activeTab === item.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-l-4 border-brand dark:border-gray-500'
                  : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 border-l-4 border-transparent'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5 text-center ${activeTab === item.id ? 'text-blue-600' : 'text-gray-400'}`}></i>
              <span className="text-sm font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SettingsInnerSidebar;
