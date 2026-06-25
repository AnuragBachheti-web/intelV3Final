import React from 'react';

const AppearanceTab = () => {
  return (
    <>
      <div className="p-6 border-b border-gray-100 dark:border-slate-800">
        <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">Appearance</h3>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Customize the interface theme and layout</p>
      </div>

      <div className="p-8 space-y-12">
        {/* Theme Selection */}
        <section>
          <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-6">Theme</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Dark Theme */}
            <label className="cursor-pointer group">
              <input type="radio" name="theme" value="dark" className="hidden peer" defaultChecked />
              <div className="p-4 border-2 border-gray-100 dark:border-slate-800 rounded-2xl peer-checked:border-brand dark:border-gray-500 transition-all hover:border-gray-200">
                <div className="aspect-[16/6] bg-[#0f172a] rounded-xl mb-4 relative overflow-hidden border border-slate-700">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-1 bg-blue-500 rounded-full"></div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Dark</p>
                  <p className="text-[10px] text-gray-400 font-bold tracking-wider mt-0.5">Default</p>
                </div>
              </div>
            </label>

            {/* Light Theme */}
            <label className="cursor-pointer group">
              <input type="radio" name="theme" value="light" className="hidden peer" />
              <div className="p-4 border-2 border-gray-100 dark:border-slate-800 rounded-2xl peer-checked:border-brand dark:border-gray-500 transition-all hover:border-gray-200">
                <div className="aspect-[16/6] bg-[#f1f5f9] rounded-xl mb-4 relative overflow-hidden border border-gray-200">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-1 bg-brand rounded-full dark:bg-gray-500"></div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Light</p>
                </div>
              </div>
            </label>

            {/* System Theme */}
            <label className="cursor-pointer group">
              <input type="radio" name="theme" value="system" className="hidden peer" />
              <div className="p-4 border-2 border-gray-100 dark:border-slate-800 rounded-2xl peer-checked:border-brand dark:border-gray-500 transition-all hover:border-gray-200">
                <div className="aspect-[16/6] bg-gradient-to-r from-[#0f172a] to-[#f1f5f9] rounded-xl mb-4 border border-gray-200 dark:border-slate-700"></div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">System</p>
                </div>
              </div>
            </label>
          </div>
        </section>

        {/* Default Home */}
        <section>
          <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-6">Default Home</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="cursor-pointer group">
              <input type="radio" name="home" value="triage" className="hidden peer" defaultChecked />
              <div className="p-8 border-2 border-gray-100 dark:border-slate-800 rounded-2xl peer-checked:border-brand dark:border-gray-500 transition-all hover:border-gray-200 flex flex-col items-center justify-center gap-3">
                <i className="fa-solid fa-bolt text-blue-600 text-xl"></i>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Triage</p>
              </div>
            </label>

            <label className="cursor-pointer group">
              <input type="radio" name="home" value="dashboard" className="hidden peer" />
              <div className="p-8 border-2 border-gray-100 dark:border-slate-800 rounded-2xl peer-checked:border-brand dark:border-gray-500 transition-all hover:border-gray-200 flex flex-col items-center justify-center gap-3">
                <i className="fa-solid fa-table-cells-large text-gray-400 text-xl"></i>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white text-center">Dashboard</p>
                  <p className="text-[10px] text-gray-400 font-bold text-center">S9+</p>
                </div>
              </div>
            </label>
          </div>
        </section>
      </div>
    </>
  );
};

export default AppearanceTab;
