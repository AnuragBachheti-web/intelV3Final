import React from 'react';
import BaseModal from './BaseModal';

const DeepDiveModal = ({ modal, onClose }) => (
  <BaseModal isOpen={!!modal} onClose={onClose}>
    <div
      className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-[1.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800 flex flex-col"
      style={{ height: '90vh' }}
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex-shrink-0">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">{modal?.title}</h3>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{modal?.subtitle}</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 transition-colors"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div className="flex-1 overflow-auto p-6">
        {modal?.component}
      </div>
    </div>
  </BaseModal>
);

export default DeepDiveModal;
