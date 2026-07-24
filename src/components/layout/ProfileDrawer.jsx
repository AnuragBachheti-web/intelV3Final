import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const ProfileDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [explainMode, setExplainMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');

  const userName = user?.name || localStorage.getItem('user_name') || 'Rohit';

  const handleSignOut = () => {
    logout();
    onClose();
    navigate('/');
  };

  const handleDataWipe = () => {
    if (confirmText.toLowerCase() === 'delete') {
      localStorage.clear();
      logout();
      onClose();
      navigate('/');
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-[60]"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed right-0 top-0 h-screen w-full sm:w-[420px] bg-[#F8F6F1] dark:bg-slate-900 border-l border-gray-200 dark:border-slate-800 shadow-2xl z-[70] flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header Section */}
        <div className="flex-shrink-0 p-6 pb-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-gray-800 dark:text-slate-200 font-medium">
              Signed in to <span className="font-bold">{userName.toLowerCase()}</span>
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-700 transition-colors"
            >
              <i className="fa-solid fa-xmark text-sm" />
            </button>
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold tracking-wider mb-4">
            CUSTOMER <span className="text-emerald-300 dark:text-emerald-700">•</span> LIVE DATA
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto px-6 py-2 flex flex-col gap-4">
          
          {/* Explanation Mode Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 font-serif">Explanation mode</h3>
            <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed mb-4">
              When on, every card you open shows a full provenance trace — inputs by source, the rule and its formula, the anomaly, the calculation, and the exact data sent to (and returned from) the LLM. Off by default.
            </p>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setExplainMode(!explainMode)}
                className={`relative w-11 h-6 rounded-full transition-colors ${explainMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-slate-600'}`}
              >
                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${explainMode ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
              <span className="text-sm font-medium text-gray-600 dark:text-slate-400">Show explainability on every card</span>
            </div>
          </div>

          {/* Sign out Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 font-serif">Sign out</h3>
            <p className="text-sm text-gray-600 dark:text-slate-300 mb-4">
              Log out of this account. Your data is kept.
            </p>
            <button 
              onClick={handleSignOut}
              className="px-5 py-2 rounded-xl border border-gray-200 dark:border-slate-600 text-sm font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              Log out
            </button>
          </div>

          {/* Danger Zone Card */}
          <div className="bg-[#FAF7F7] dark:bg-red-900/10 rounded-2xl p-5 shadow-sm border border-red-300 dark:border-red-900/50">
            <h3 className="text-lg font-bold text-[#A43B2A] dark:text-red-400 mb-2 font-serif">Danger zone</h3>
            <p className="text-sm text-gray-600 dark:text-slate-300 mb-4">
              Permanently deletes your account, organization, and all its data. Your email is freed for reuse. This cannot be undone.
            </p>
            
            {!deleteMode ? (
              <button 
                onClick={() => setDeleteMode(true)}
                className="px-5 py-2.5 rounded-xl bg-[#A43B2A] text-white text-sm font-bold hover:bg-[#8A3022] transition-colors"
              >
                Delete account
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <input 
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
                <input 
                  type="text"
                  placeholder='Type "delete" to confirm'
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
                <div className="flex items-center gap-2 mt-1">
                  <button 
                    onClick={handleDataWipe}
                    disabled={confirmText.toLowerCase() !== 'delete'}
                    className="px-5 py-2.5 rounded-xl bg-[#A43B2A] text-white text-sm font-bold hover:bg-[#8A3022] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Permanently delete
                  </button>
                  <button 
                    onClick={() => {
                      setDeleteMode(false);
                      setPassword('');
                      setConfirmText('');
                    }}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm font-bold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default ProfileDrawer;
