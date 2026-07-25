import React, { useEffect } from 'react';

const StandardModal = ({ isOpen, onClose, maxWidth = 'max-w-[850px]', children, footer }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"></div>
      
      <div 
        className={`relative bg-white dark:bg-slate-900 w-full ${maxWidth} max-h-[95vh] rounded-[16px] shadow-2xl flex flex-col overflow-hidden`}
        onClick={e => e.stopPropagation()}
      >
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          {children}
        </div>

        {/* Sticky Footer */}
        {footer && (
          <div className="border-t border-gray-100 dark:border-slate-800 p-5 bg-white dark:bg-slate-900 flex items-center justify-between shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default StandardModal;
