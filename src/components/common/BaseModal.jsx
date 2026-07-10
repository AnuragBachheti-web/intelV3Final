import React from 'react';
import { createPortal } from 'react-dom';

const BaseModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-start sm:items-center justify-center px-4 py-8 sm:p-4 overflow-y-auto bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      {children}
    </div>,
    document.body
  );
};

export default BaseModal;
