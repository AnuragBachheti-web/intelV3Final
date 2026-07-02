import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MarketplaceSyncBanner from '../../components/common/MarketplaceSyncBanner';
import useClickOutside from '../../hooks/useClickOutside';
import useProductNavigation from '../../hooks/useProductNavigation';

const CHANNEL_TABS = ['Amazon', 'Shopify', 'Walmart'];

const ALL_PRODUCTS = [
  { id: 1,  name: 'Premium Wireless Headphones', sku: 'WH-PRO-2024',  status: 'Active',   price: '$149.99', vendor: 'Realify Audio',  image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/829ed95905-98415edd6aab0bba6e05.png', category: 'Electronics', inventory: 47,  velocity: '23/day',  intelLabel: 'Price Drop Alert',   intelColor: 'text-red-600 dark:text-red-400',     createdAt: new Date('2024-01-15'), updatedAt: new Date('2026-06-10') },
  { id: 2,  name: 'Security Camera',              sku: 'SC-HOME-V2',   status: 'Active',   price: '$89.99',  vendor: 'SecureTech',     image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/a92a4ffb64-d9b6565e03e56b627c33.png', category: 'Electronics', inventory: 12,  velocity: '8/day',   intelLabel: 'Stockout Risk',      intelColor: 'text-red-600 dark:text-red-400',     createdAt: new Date('2024-03-02'), updatedAt: new Date('2026-06-15') },
  { id: 3,  name: 'Essential T-Shirt',            sku: 'AP-TEE-001',   status: 'Active',   price: '$24.99',  vendor: 'StyleBasics',    image: null, category: 'Apparel',     inventory: 452, velocity: '112/day', intelLabel: 'Stable',             intelColor: 'text-gray-500 dark:text-slate-400',  createdAt: new Date('2023-11-08'), updatedAt: new Date('2026-05-20') },
  { id: 4,  name: 'Minimalist Watch',             sku: 'WT-MIN-04',    status: 'Active',   price: '$199.99', vendor: 'TimeCraft',      image: null, category: 'Apparel',     inventory: 5,   velocity: '4/day',   intelLabel: 'Competitor Move',    intelColor: 'text-orange-600 dark:text-orange-400', createdAt: new Date('2024-06-20'), updatedAt: new Date('2026-06-16') },
  { id: 5,  name: 'Organic Pet Food 15lb',        sku: 'PF-ORG-15LB',  status: 'Active',   price: '$44.99',  vendor: 'PetNaturals',    image: null, category: 'Pet',         inventory: 218, velocity: '14/day',  intelLabel: 'Stable',             intelColor: 'text-gray-500 dark:text-slate-400',  createdAt: new Date('2023-09-14'), updatedAt: new Date('2026-04-30') },
  { id: 6,  name: 'Smart Speaker Mini',           sku: 'SM-SPK-003',   status: 'Active',   price: '$69.99',  vendor: 'AudioLabs',      image: null, category: 'Electronics', inventory: 89,  velocity: '6/day',   intelLabel: 'Opportunity',        intelColor: 'text-green-600 dark:text-green-400', createdAt: new Date('2024-02-28'), updatedAt: new Date('2026-06-01') },
  { id: 7,  name: 'Ergonomic Office Chair',       sku: 'FN-CHR-001',   status: 'Active',   price: '$349.99', vendor: 'WorkForce Co.',  image: null, category: 'Furniture',   inventory: 34,  velocity: '3/day',   intelLabel: 'Stable',             intelColor: 'text-gray-500 dark:text-slate-400',  createdAt: new Date('2023-07-11'), updatedAt: new Date('2026-03-18') },
  { id: 8,  name: 'USB-C Hub 7-in-1',            sku: 'TEC-USB-007',  status: 'Active',   price: '$49.99',  vendor: 'TechConnect',    image: null, category: 'Electronics', inventory: 156, velocity: '18/day',  intelLabel: 'Opportunity',        intelColor: 'text-green-600 dark:text-green-400', createdAt: new Date('2024-04-05'), updatedAt: new Date('2026-06-14') },
  { id: 9,  name: 'Wireless Earbuds Pro',         sku: 'AUD-EAR-PRO',  status: 'Active',   price: '$129.99', vendor: 'Realify Audio',  image: null, category: 'Electronics', inventory: 203, velocity: '8/day',   intelLabel: 'Price Drop Alert',   intelColor: 'text-red-600 dark:text-red-400',     createdAt: new Date('2024-05-19'), updatedAt: new Date('2026-06-17') },
  { id: 10, name: 'Yoga Mat Premium',             sku: 'FT-YOG-002',   status: 'Active',   price: '$59.99',  vendor: 'FitLife',        image: null, category: 'Fitness',     inventory: 78,  velocity: '5/day',   intelLabel: 'Stable',             intelColor: 'text-gray-500 dark:text-slate-400',  createdAt: new Date('2023-12-22'), updatedAt: new Date('2026-02-09') },
  { id: 11, name: 'Bamboo Phone Stand',           sku: 'ACC-STD-012',  status: 'Active',   price: '$19.99',  vendor: 'EcoDesk',        image: null, category: 'Accessories', inventory: 310, velocity: '22/day',  intelLabel: 'Stable',             intelColor: 'text-gray-500 dark:text-slate-400',  createdAt: new Date('2024-07-30'), updatedAt: new Date('2026-05-05') },
  { id: 12, name: 'Office Desk Lamp',             sku: 'LGT-DSK-011',  status: 'Archived', price: '$79.99',  vendor: 'BrightSpace',    image: null, category: 'Furniture',   inventory: 0,   velocity: '0/day',   intelLabel: 'Listing Suppressed', intelColor: 'text-red-600 dark:text-red-400',     createdAt: new Date('2023-05-03'), updatedAt: new Date('2025-11-27') },
  { id: 13, name: 'Portable Charger 20K',         sku: 'TEC-CHG-009',  status: 'Active',   price: '$39.99',  vendor: 'TechConnect',    image: null, category: 'Electronics', inventory: 187, velocity: '11/day',  intelLabel: 'Overstock',          intelColor: 'text-amber-600 dark:text-amber-400', createdAt: new Date('2024-08-12'), updatedAt: new Date('2026-06-12') },
  { id: 14, name: 'Ergonomic Desk Organizer',     sku: 'HOME-ORG-006', status: 'Active',   price: '$34.99',  vendor: 'HomeGrid',       image: null, category: 'Home',        inventory: 22,  velocity: '9/day',   intelLabel: 'Stockout Risk',      intelColor: 'text-red-600 dark:text-red-400',     createdAt: new Date('2024-09-25'), updatedAt: new Date('2026-06-13') },
  { id: 15, name: 'Cotton Tote Bag',              sku: 'APP-TOT-003',  status: 'Draft',    price: '$14.99',  vendor: 'StyleBasics',    image: null, category: 'Apparel',     inventory: 640, velocity: '28/day',  intelLabel: 'Stable',             intelColor: 'text-gray-500 dark:text-slate-400',  createdAt: new Date('2023-10-17'), updatedAt: new Date('2026-04-22') },
];

const PAGE_SIZE = 10;
const CATEGORIES = ['All', 'Electronics', 'Apparel', 'Pet', 'Fitness', 'Furniture', 'Home', 'Accessories'];

const SORT_OPTIONS = [
  { key: 'name',      label: 'Product Name' },
  { key: 'category',  label: 'Category'     },
  { key: 'inventory', label: 'Inventory'    },
  { key: 'velocity',  label: 'Velocity'     },
  { key: 'intel',     label: 'Intel'        },
];

const DEFAULT_COLS = [
  { key: 'status',    label: 'Status',    visible: true  },
  { key: 'price',     label: 'Price',     visible: true  },
  { key: 'category',  label: 'Category',  visible: true  },
  { key: 'inventory', label: 'Inventory', visible: true  },
  { key: 'velocity',  label: 'Velocity',  visible: true  },
];

const STATUS_OPTIONS = ['Active', 'Archived', 'Draft', 'Unlisted'];
const STATUS_STYLES = {
  Active:   { pill: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',  dot: 'bg-green-500' },
  Draft:    { pill: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',   dot: 'bg-amber-400' },
  Archived: { pill: 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400',       dot: 'bg-gray-400'  },
  Unlisted: { pill: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',           dot: 'bg-red-400'   },
};

// ─── Bulk Delete Confirm Modal ────────────────────────────────────────────────
const BulkDeleteConfirmModal = ({ count, onConfirm, onCancel }) => (
  <div
    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
    onClick={onCancel}
  >
    <div
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 p-6 max-w-sm w-full mx-4"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
          <i className="fa-solid fa-trash text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">Delete {count} items?</h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-slate-400 mb-6 pl-[52px]">
        Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-slate-100">{count} items</span>? They will be moved to the Recycle Bin.
      </p>
      <div className="flex items-center gap-3 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
        >
          No
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
const DeleteConfirmModal = ({ product, onConfirm, onCancel }) => (
  <div
    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
    onClick={onCancel}
  >
    <div
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 p-6 max-w-sm w-full mx-4"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
          <i className="fa-solid fa-trash text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">Delete product?</h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-slate-400 mb-6 pl-[52px]">
        Are you sure you want to delete "<span className="font-semibold text-gray-900 dark:text-slate-100">{product.name}</span>"?
      </p>
      <div className="flex items-center gap-3 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
        >
          No
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── Bin View ─────────────────────────────────────────────────────────────────
const BinView = ({ items, onBack, onRestore, onRestoreMany }) => {
  const [selectedIds, setSelectedIds] = useState(new Set());

  const toggleSelect = (id) => setSelectedIds(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const toggleAll = () => {
    if (selectedIds.size === items.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(items.map(p => p.id)));
  };

  const handleBulkRestore = () => {
    onRestoreMany([...selectedIds]);
    setSelectedIds(new Set());
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 py-1">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors"
        >
          <i className="fa-solid fa-arrow-left text-[11px]" />
        </button>
        <span className="text-gray-300 dark:text-slate-700 select-none">|</span>
        <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">
          Deleted Products{' '}
          <span className="text-gray-400 dark:text-slate-500 font-normal text-sm">({items.length})</span>
        </h3>
        {selectedIds.size > 1 && (
          <button
            onClick={handleBulkRestore}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 text-green-700 dark:text-green-400 text-xs font-bold hover:bg-green-100 dark:hover:bg-green-900/40 transition-all"
          >
            <i className="fa-solid fa-rotate-left text-[10px]" />
            Restore ({selectedIds.size})
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
            <span className="fa-stack" style={{fontSize:'0.75rem',lineHeight:'1'}}>
              <i className="fa-solid fa-trash-can fa-stack-2x text-gray-400 dark:text-slate-500" />
              <i className="fa-solid fa-recycle fa-stack-1x fa-inverse" style={{fontSize:'0.55em'}} />
            </span>
          </div>
          <p className="text-sm text-gray-400 dark:text-slate-500">Recycle Bin is empty</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800">
                <th className="px-4 py-3 w-8">
                  <input type="checkbox" checked={items.length > 0 && selectedIds.size === items.length} onChange={toggleAll} className="rounded border-gray-300 dark:border-slate-600" />
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider text-left w-10">#</th>
                <th className="px-3 py-3 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider text-left w-12">Image</th>
                <th className="px-3 py-3 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider text-left">Product</th>
                <th className="px-3 py-3 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider text-left">Status</th>
                <th className="px-3 py-3 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider text-left">Price</th>
                <th className="px-3 py-3 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider text-left">Category</th>
                <th className="px-3 py-3 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider text-left">Inventory</th>
                <th className="px-3 py-3 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider text-left">Velocity</th>
                <th className="px-3 py-3 w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800/60">
              {items.map((product, idx) => {
                const ss = STATUS_STYLES[product.status] || STATUS_STYLES.Active;
                return (
                  <tr key={product.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/30 transition-colors opacity-70">
                    <td className="px-4 py-3 w-8">
                      <input type="checkbox" checked={selectedIds.has(product.id)} onChange={() => toggleSelect(product.id)} className="rounded border-gray-300 dark:border-slate-600" />
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 dark:text-slate-500 font-mono w-10">{idx + 1}</td>
                    <td className="px-3 py-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                        {product.image
                          ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          : <i className="fa-solid fa-box text-gray-300 dark:text-slate-600 text-[11px]" />}
                      </div>
                    </td>
                    <td className="px-3 py-3 min-w-[160px]">
                      <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 leading-tight">{product.name}</p>
                      <p className="text-[10px] text-gray-400 dark:text-slate-500 font-mono mt-0.5">{product.sku}</p>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${ss.pill}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${ss.dot} flex-shrink-0`} />
                        {product.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">{product.price}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs text-gray-600 dark:text-slate-400">{product.category}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-xs font-semibold ${product.inventory === 0 ? 'text-red-600 dark:text-red-400' : product.inventory < 20 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-700 dark:text-slate-300'}`}>
                        {product.inventory === 0 ? 'Out of stock' : `${product.inventory.toLocaleString()} in stock`}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs text-gray-600 dark:text-slate-400">{product.velocity}</span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button
                        onClick={() => onRestore(product.id)}
                        title="Restore"
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-green-200 dark:border-green-800/40 text-green-700 dark:text-green-400 text-[11px] font-semibold hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                      >
                        <i className="fa-solid fa-rotate-left text-[9px]" /> Restore
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ─── Product Edit View ────────────────────────────────────────────────────────
const ProductEditView = ({ items, onBack, onGoToMarketplace }) => {
  const [rows, setRows] = useState(items.map(p => ({ ...p })));
  const update = (id, field, value) =>
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));

  return (
    <div className="flex flex-col gap-4">
      {/* Edit Banner */}
      <MarketplaceSyncBanner onGoToMarketplace={onGoToMarketplace} />

      <div className="flex items-center justify-between gap-3 py-1">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors">
            <i className="fa-solid fa-arrow-left text-[11px]" />
          </button>
          <span className="text-gray-300 dark:text-slate-700 select-none">|</span>
          <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">
            Editing {rows.length} product{rows.length !== 1 ? 's' : ''}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-600 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 transition">
            <i className="fa-solid fa-table-columns text-[10px]" /> Columns
          </button>
          <button onClick={onBack} className="px-4 py-2 rounded-xl bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 text-xs font-bold hover:bg-gray-700 dark:hover:bg-slate-200 transition">
            Save
          </button>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-800/50">
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider text-left min-w-[220px]">Product title</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider text-left min-w-[140px]">Status</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider text-left min-w-[150px]">Category</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider text-left min-w-[150px]">Vendor</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider text-right min-w-[110px]">Base price</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider text-right min-w-[130px]">Available qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800/60">
              {rows.map(row => {
                const ss = STATUS_STYLES[row.status] || STATUS_STYLES.Active;
                return (
                  <tr key={row.id} className="hover:bg-gray-50/60 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-chevron-up text-gray-300 dark:text-slate-600 text-[10px] flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 leading-tight truncate">{row.name}</p>
                          <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">Default</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`inline-flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-full ${ss.pill}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${ss.dot} flex-shrink-0`} />
                        <select value={row.status} onChange={e => update(row.id, 'status', e.target.value)} className="text-xs font-semibold bg-transparent border-none outline-none cursor-pointer appearance-none pr-1" style={{ color: 'inherit' }}>
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <i className="fa-solid fa-chevron-down text-[8px] opacity-60 flex-shrink-0" />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/40 rounded-md">
                        <select value={row.category} onChange={e => update(row.id, 'category', e.target.value)} className="text-xs font-medium text-purple-700 dark:text-purple-400 bg-transparent border-none outline-none cursor-pointer appearance-none">
                          {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <i className="fa-solid fa-chevron-down text-purple-400 text-[8px] flex-shrink-0" />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input type="text" value={row.vendor} onChange={e => update(row.id, 'vendor', e.target.value)} className="w-full text-xs text-gray-700 dark:text-slate-300 bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-slate-600 focus:border-gray-500 dark:focus:border-slate-400 outline-none py-0.5 transition-colors" />
                    </td>
                    <td className="px-4 py-3">
                      <input type="text" value={row.price} onChange={e => update(row.id, 'price', e.target.value)} className="w-full text-xs text-gray-700 dark:text-slate-300 bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-slate-600 focus:border-gray-500 dark:focus:border-slate-400 outline-none py-0.5 transition-colors text-right" />
                    </td>
                    <td className="px-4 py-3">
                      <input type="number" value={row.inventory} onChange={e => update(row.id, 'inventory', parseInt(e.target.value) || 0)} className="w-full text-xs text-gray-700 dark:text-slate-300 bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-slate-600 focus:border-gray-500 dark:focus:border-slate-400 outline-none py-0.5 transition-colors text-right" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── Products List Page ───────────────────────────────────────────────────────
const ProductsListPage = () => {
  const navigate = useNavigate();
  const { goToProduct, findWatchlistItem, buildFallbackWatchlistItem, NO_SPECIFIC_INSIGHTS } = useProductNavigation();
  const activePlatforms = useMemo(
    () => JSON.parse(localStorage.getItem('active_platforms') || '["shopify"]'),
    []
  );
  const visibleChannelTabs = useMemo(
    () => CHANNEL_TABS.filter(tab => activePlatforms.includes(tab.toLowerCase())),
    [activePlatforms]
  );

  const [activeTab, setActiveTab]           = useState(visibleChannelTabs[0] || 'Amazon');
  const [search, setSearch]                 = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [selectedIds, setSelectedIds]       = useState(new Set());
  const [page, setPage]                     = useState(1);
  const [sortBy, setSortBy]                 = useState(null);
  const [sortDir, setSortDir]               = useState('asc');
  const [cols, setCols]                     = useState(DEFAULT_COLS);
  const [dragColKey, setDragColKey]         = useState(null);
  const [dragOverColKey, setDragOverColKey] = useState(null);
  const [editMode, setEditMode]             = useState(false);
  const [editItems, setEditItems]           = useState([]);
  const [editingRowId, setEditingRowId]     = useState(null);
  const [editingRowVals, setEditingRowVals] = useState({});

  // Product data state (mutable for delete/draft)
  const [productsData, setProductsData]         = useState(ALL_PRODUCTS);
  const [deletedProducts, setDeletedProducts]   = useState([]);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState(null);
  const [showBin, setShowBin]                   = useState(false);
  const [bulkDeletePending, setBulkDeletePending] = useState(false);

  /* ── Unified View Controls panel ── */
  const [viewPanelOpen, setViewPanelOpen]     = useState(false);
  const [viewPanelTab, setViewPanelTab]       = useState('filters');
  const [pendingCategory, setPendingCategory] = useState('All');
  const [pendingSortBy, setPendingSortBy]     = useState(null);
  const [pendingSortDir, setPendingSortDir]   = useState('asc');
  const [pendingCols, setPendingCols]         = useState(DEFAULT_COLS);
  const viewPanelRef = useRef(null);

  const openViewPanel = (tab = 'filters') => {
    setPendingCategory(filterCategory);
    setPendingSortBy(sortBy);
    setPendingSortDir(sortDir);
    setPendingCols(cols.map(c => ({ ...c })));
    setViewPanelTab(tab);
    setViewPanelOpen(true);
  };
  const applyViewPanel = () => {
    setFilterCategory(pendingCategory);
    setSortBy(pendingSortBy);
    setSortDir(pendingSortDir);
    setCols(pendingCols);
    setPage(1);
    setViewPanelOpen(false);
  };
  const resetViewPanel = () => {
    setPendingCategory('All');
    setPendingSortBy(null);
    setPendingSortDir('asc');
    setPendingCols(DEFAULT_COLS.map(c => ({ ...c })));
  };
  const togglePendingColVisible = (key) =>
    setPendingCols(prev => prev.map(c => c.key === key ? { ...c, visible: !c.visible } : c));

  useClickOutside(viewPanelRef, viewPanelOpen, () => setViewPanelOpen(false));

  const filtered = useMemo(() => {
    let list = productsData;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    if (filterCategory !== 'All') list = list.filter(p => p.category === filterCategory);
    return list;
  }, [search, filterCategory, productsData]);

  const sortedFiltered = useMemo(() => {
    if (!sortBy) return filtered;
    return [...filtered].sort((a, b) => {
      let aVal, bVal;
      if (sortBy === 'name')           { aVal = a.name.toLowerCase();      bVal = b.name.toLowerCase(); }
      else if (sortBy === 'category')  { aVal = a.category.toLowerCase();  bVal = b.category.toLowerCase(); }
      else if (sortBy === 'inventory') { aVal = a.inventory;               bVal = b.inventory; }
      else if (sortBy === 'velocity')  { aVal = parseInt(a.velocity) || 0; bVal = parseInt(b.velocity) || 0; }
      else if (sortBy === 'intel')     { aVal = a.intelLabel.toLowerCase(); bVal = b.intelLabel.toLowerCase(); }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortBy, sortDir]);

  const totalPages   = Math.ceil(sortedFiltered.length / PAGE_SIZE);
  const pageProducts = sortedFiltered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSelect = (id) => setSelectedIds(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const toggleAll = () => {
    if (selectedIds.size === pageProducts.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(pageProducts.map(p => p.id)));
  };

  const handleEditClick = () => {
    setEditItems(sortedFiltered.filter(p => selectedIds.has(p.id)).map(p => ({ ...p })));
    setEditMode(true);
  };

  const handleBulkDelete = () => {
    setBulkDeletePending(true);
  };

  const confirmBulkDelete = () => {
    const toDelete = productsData.filter(p => selectedIds.has(p.id));
    setProductsData(prev => prev.filter(p => !selectedIds.has(p.id)));
    setDeletedProducts(prev => [...prev, ...toDelete]);
    setSelectedIds(new Set());
    setBulkDeletePending(false);
  };

  const handleDeleteProduct = (product, e) => {
    e.stopPropagation();
    setDeleteConfirmProduct(product);
  };

  const confirmDelete = () => {
    setProductsData(prev => prev.filter(p => p.id !== deleteConfirmProduct.id));
    setDeletedProducts(prev => [...prev, deleteConfirmProduct]);
    setSelectedIds(prev => { const next = new Set(prev); next.delete(deleteConfirmProduct.id); return next; });
    setDeleteConfirmProduct(null);
  };

  const handleRestoreProduct = (productId) => {
    const product = deletedProducts.find(p => p.id === productId);
    if (!product) return;
    setDeletedProducts(prev => prev.filter(p => p.id !== productId));
    setProductsData(prev => [...prev, product]);
  };

  const handleRestoreMany = (ids) => {
    const idSet = new Set(ids);
    const toRestore = deletedProducts.filter(p => idSet.has(p.id));
    setDeletedProducts(prev => prev.filter(p => !idSet.has(p.id)));
    setProductsData(prev => [...prev, ...toRestore]);
  };

  const handleDraftRow = (product, e) => {
    e.stopPropagation();
    setProductsData(prev => prev.map(p => p.id === product.id ? { ...p, status: 'Draft' } : p));
  };

  const handleProductClick = (product) => {
    const watchlistItem = findWatchlistItem(product.name);
    goToProduct({
      name: product.name, sku: product.sku, price: product.price,
      image: product.image || watchlistItem?.image || null,
      description: `${product.name} is a key product driving your sales performance.`,
      kpiGroups: [{ label: 'Sales', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/10', kpis: [{ label: 'Total Revenue', value: '$24,800' }, { label: 'Units Sold', value: String(product.inventory) }, { label: 'Avg Price', value: product.price || '—' }, { label: 'Buy Box %', value: '92%' }] }],
      insights: NO_SPECIFIC_INSIGHTS,
      watchlistItem: watchlistItem || buildFallbackWatchlistItem(product.name, product.sku, { stock: String(product.inventory), velocity: product.velocity, subtext: '' }),
    }, '/products');
  };

  const startEdit = (e, product) => {
    e.stopPropagation();
    setEditingRowId(product.id);
    setEditingRowVals({ ...product });
  };
  const cancelEdit = (e) => {
    e.stopPropagation();
    setEditingRowId(null);
    setEditingRowVals({});
  };
  const saveEdit = (e) => {
    e.stopPropagation();
    setProductsData(prev => prev.map(p => p.id === editingRowId ? { ...p, ...editingRowVals } : p));
    setEditingRowId(null);
    setEditingRowVals({});
  };
  const updateEditVal = (field, value) =>
    setEditingRowVals(prev => ({ ...prev, [field]: value }));

  const renderEditCell = (colKey) => {
    const curStatus = STATUS_STYLES[editingRowVals.status] || STATUS_STYLES.Active;
    switch (colKey) {
      case 'status': return (
        <td key={colKey} className="px-3 py-3">
          <div className={`inline-flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-full ${curStatus.pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${curStatus.dot} flex-shrink-0`} />
            <select value={editingRowVals.status} onChange={e => updateEditVal('status', e.target.value)}
              className="text-xs font-semibold bg-transparent border-none outline-none cursor-pointer appearance-none pr-1" style={{ color: 'inherit' }}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <i className="fa-solid fa-chevron-down text-[8px] opacity-60 flex-shrink-0" />
          </div>
        </td>
      );
      case 'price': return (
        <td key={colKey} className="px-3 py-3">
          <input type="text" value={editingRowVals.price} onChange={e => updateEditVal('price', e.target.value)}
            className="text-xs font-semibold text-gray-700 dark:text-slate-300 bg-transparent border-b border-gray-300 dark:border-slate-600 focus:border-gray-500 dark:focus:border-slate-400 outline-none w-16 py-0.5" />
        </td>
      );
      case 'category': return (
        <td key={colKey} className="px-3 py-3">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/40 rounded-md">
            <select value={editingRowVals.category} onChange={e => updateEditVal('category', e.target.value)}
              className="text-xs font-medium text-purple-700 dark:text-purple-400 bg-transparent border-none outline-none cursor-pointer appearance-none">
              {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <i className="fa-solid fa-chevron-down text-purple-400 text-[8px] flex-shrink-0" />
          </div>
        </td>
      );
      case 'inventory': return (
        <td key={colKey} className="px-3 py-3">
          <input type="number" value={editingRowVals.inventory} onChange={e => updateEditVal('inventory', parseInt(e.target.value) || 0)}
            className="text-xs font-semibold text-gray-700 dark:text-slate-300 bg-transparent border-b border-gray-300 dark:border-slate-600 focus:border-gray-500 dark:focus:border-slate-400 outline-none w-20 py-0.5" />
        </td>
      );
      default:
        return renderCell(editingRowVals, colKey);
    }
  };

  // Column drag-and-drop
  const handleColDragStart = (e, key) => { e.dataTransfer.effectAllowed = 'move'; setDragColKey(key); };
  const handleColDragOver  = (e, key)  => { e.preventDefault(); if (key !== dragColKey) setDragOverColKey(key); };
  const handleColDrop      = (key)     => {
    if (!dragColKey || dragColKey === key) { setDragColKey(null); setDragOverColKey(null); return; }
    setCols(prev => {
      const next = [...prev];
      const from = next.findIndex(c => c.key === dragColKey);
      const to   = next.findIndex(c => c.key === key);
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setDragColKey(null); setDragOverColKey(null);
  };
  const handleColDragEnd = () => { setDragColKey(null); setDragOverColKey(null); };
  const toggleColVisible = (key) => setCols(prev => prev.map(c => c.key === key ? { ...c, visible: !c.visible } : c));

  // Cell renderer
  const renderCell = (product, colKey) => {
    const ss = STATUS_STYLES[product.status] || STATUS_STYLES.Active;
    switch (colKey) {
      case 'status': return (
        <td key={colKey} className="px-3 py-3">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${ss.pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${ss.dot} flex-shrink-0`} />
            {product.status}
          </span>
        </td>
      );
      case 'price': return (
        <td key={colKey} className="px-3 py-3">
          <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">{product.price}</span>
        </td>
      );
      case 'category': return (
        <td key={colKey} className="px-3 py-3">
          <span className="text-xs text-gray-600 dark:text-slate-400">{product.category}</span>
        </td>
      );
      case 'inventory': return (
        <td key={colKey} className="px-3 py-3">
          <span className={`text-xs font-semibold ${product.inventory === 0 ? 'text-red-600 dark:text-red-400' : product.inventory < 20 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-700 dark:text-slate-300'}`}>
            {product.inventory === 0 ? 'Out of stock' : `${product.inventory.toLocaleString()} in stock`}
          </span>
        </td>
      );
      case 'velocity': return (
        <td key={colKey} className="px-3 py-3">
          <span className="text-xs text-gray-600 dark:text-slate-400">{product.velocity}</span>
        </td>
      );
      default: return null;
    }
  };

  const hasSelection = selectedIds.size > 0;
  const isBulk       = selectedIds.size > 1;
  const visibleCols  = cols.filter(c => c.visible);

  return (
    <DashboardLayout title="Products" subtitle="All your product listings" showTabs={false} showAIPrompt={false}>
      <div className="flex flex-col gap-4">

        {/* Channel tabs with bin icon */}
        <div className="flex items-center gap-0.5 border-b border-gray-200 dark:border-slate-800 -mt-1">
          <button
            onClick={() => navigate('/intel', { state: { restoreInsightTab: 'Item' } })}
            className="flex items-center justify-center text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-200 transition-colors flex-shrink-0 mr-2 pb-px"
          >
            <i className="fa-solid fa-arrow-left text-sm" />
          </button>
          {visibleChannelTabs.map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }}
              className={`px-5 py-2.5 text-xs font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${activeTab === tab ? 'text-gray-900 dark:text-slate-100 border-gray-900 dark:border-slate-200 font-semibold' : 'text-gray-400 dark:text-slate-500 border-transparent hover:text-gray-700 dark:hover:text-slate-300'}`}>
              {tab}
            </button>
          ))}
          {/* Bin icon on the right */}
          <button
            onClick={() => setShowBin(true)}
            className="ml-auto flex items-center gap-1.5 pb-2.5 px-2 text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors relative"
            title="Bin"
          >
            <span className="fa-stack" style={{fontSize:'0.5rem',lineHeight:'1'}}>
              <i className="fa-solid fa-trash-can fa-stack-2x" />
              <i className="fa-solid fa-recycle fa-stack-1x fa-inverse" style={{fontSize:'0.6em'}} />
            </span>
            {deletedProducts.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center px-0.5">
                {deletedProducts.length}
              </span>
            )}
          </button>
        </div>

        {showBin ? (
          <BinView items={deletedProducts} onBack={() => setShowBin(false)} onRestore={handleRestoreProduct} onRestoreMany={handleRestoreMany} />
        ) : editMode ? (
          <ProductEditView
            items={editItems}
            onBack={() => { setEditMode(false); setSelectedIds(new Set()); }}
            onGoToMarketplace={() => {}}
          />
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {/* <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 flex-shrink-0">Product Listing</h3> */}
                {selectedIds.size > 1 && (
                  <>
                    <button onClick={handleEditClick} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 text-xs font-bold hover:bg-gray-700 dark:hover:bg-slate-200 transition-all shadow-sm">
                      <i className="fa-solid fa-pen text-[10px]" />
                      Bulk Edit ({selectedIds.size})
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-all shadow-sm"
                    >
                      <i className="fa-solid fa-trash text-[10px]" />
                      {selectedIds.size}
                    </button>
                  </>
                )}
              </div>

              {/* Right controls: search + filters */}
              <div className="flex items-center gap-2">

                {/* Search input */}
                <div className="relative">
                  <i className="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-[10px] pointer-events-none" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search products…"
                    className="pl-7 pr-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-gray-700 dark:text-slate-300 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-gray-400 dark:focus:border-slate-500 w-44 transition-all"
                  />
                </div>

                {/* ── View Controls: single Filters button ── */}
                <div className="relative" ref={viewPanelRef}>
                  <button onClick={() => viewPanelOpen ? setViewPanelOpen(false) : openViewPanel('filters')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                      viewPanelOpen || filterCategory !== 'All' || sortBy !== null || cols.some(c => !c.visible)
                        ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 border-gray-900 dark:border-slate-100'
                        : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600'
                    }`}>
                    <i className="fa-solid fa-sliders text-[10px]" /> Filters
                    {(filterCategory !== 'All' || sortBy !== null || cols.some(c => !c.visible)) &&
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />}
                  </button>

                  {/* ── Two-column panel ── */}
                  {viewPanelOpen && (
                    <div className="absolute top-full mt-2 right-0 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl z-[9999] w-[340px] overflow-hidden flex flex-col">

                      {/* Left tabs + right content */}
                      <div className="flex" style={{ minHeight: 220 }}>

                        {/* Left sidebar */}
                        <div className="w-[110px] flex-shrink-0 border-r border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/40 p-2 flex flex-col gap-0.5">
                          {[
                            { key: 'filters', label: 'Filters',  icon: 'fa-sliders',       badge: filterCategory !== 'All' },
                            { key: 'sort',    label: 'Sort',     icon: 'fa-sort',           badge: !!pendingSortBy },
                            { key: 'columns', label: 'Columns',  icon: 'fa-table-columns',  badge: pendingCols.some(c => !c.visible) },
                          ].map(tab => (
                            <button key={tab.key} onClick={() => setViewPanelTab(tab.key)}
                              className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-left transition-colors ${
                                viewPanelTab === tab.key
                                  ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-semibold shadow-sm'
                                  : 'text-gray-500 dark:text-slate-400 hover:bg-white/70 dark:hover:bg-slate-900/50 hover:text-gray-700 dark:hover:text-slate-200 font-medium'
                              }`}>
                              <span className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                                viewPanelTab === tab.key ? 'border-gray-900 dark:border-slate-100' : 'border-gray-300 dark:border-slate-600'
                              }`}>
                                {viewPanelTab === tab.key && <span className="w-1.5 h-1.5 rounded-full bg-gray-900 dark:bg-slate-100" />}
                              </span>
                              <span className="truncate">{tab.label}</span>
                              {tab.badge && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />}
                            </button>
                          ))}
                        </div>

                        {/* Right content */}
                        <div className="flex-1 p-3.5 overflow-y-auto">

                          {/* Filters tab */}
                          {viewPanelTab === 'filters' && (
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2.5">Category</p>
                              <div className="flex flex-wrap gap-1.5">
                                {CATEGORIES.map(cat => (
                                  <button key={cat} onClick={() => setPendingCategory(cat)}
                                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all ${
                                      pendingCategory === cat
                                        ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 border-gray-900 dark:border-slate-100'
                                        : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600'
                                    }`}>
                                    {cat}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Sort tab */}
                          {viewPanelTab === 'sort' && (
                            <div>
                              <div className="flex items-center justify-between mb-2.5">
                                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Sort by</p>
                                {pendingSortBy && (
                                  <button onClick={() => { setPendingSortBy(null); setPendingSortDir('asc'); }}
                                    className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                                    Clear
                                  </button>
                                )}
                              </div>
                              <div className="flex flex-col gap-0.5">
                                {SORT_OPTIONS.map(opt => (
                                  <button key={opt.key}
                                    onClick={() => { if (pendingSortBy === opt.key) setPendingSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setPendingSortBy(opt.key); setPendingSortDir('asc'); } }}
                                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                                      pendingSortBy === opt.key
                                        ? 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-slate-100 font-semibold'
                                        : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 font-medium'
                                    }`}>
                                    <div className="flex items-center gap-2">
                                      <span className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                                        pendingSortBy === opt.key ? 'border-gray-900 dark:border-slate-100' : 'border-gray-300 dark:border-slate-600'
                                      }`}>
                                        {pendingSortBy === opt.key && <span className="w-1.5 h-1.5 rounded-full bg-gray-900 dark:bg-slate-100" />}
                                      </span>
                                      {opt.label}
                                    </div>
                                    {pendingSortBy === opt.key && (
                                      <i className={`fa-solid ${pendingSortDir === 'asc' ? 'fa-arrow-up' : 'fa-arrow-down'} text-[10px] text-gray-500 dark:text-slate-400`} />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Columns tab */}
                          {viewPanelTab === 'columns' && (
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2.5">Visible Columns</p>
                              <div className="flex flex-col gap-0.5">
                                {pendingCols.map(col => (
                                  <div key={col.key} className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                    <span className="text-xs font-medium text-gray-600 dark:text-slate-300">{col.label}</span>
                                    <button onClick={() => togglePendingColVisible(col.key)} className="flex-shrink-0 p-0.5">
                                      <div className={`w-8 h-4 rounded-full transition-colors flex items-center px-0.5 ${col.visible ? 'bg-gray-900 dark:bg-slate-100' : 'bg-gray-200 dark:bg-slate-700'}`}>
                                        <span className={`w-3 h-3 rounded-full bg-white dark:bg-gray-900 transition-transform ${col.visible ? 'translate-x-4' : 'translate-x-0'}`} />
                                      </div>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        </div>
                      </div>

                      {/* Footer */}
                      <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between gap-2">
                        <button onClick={resetViewPanel}
                          className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                          Reset
                        </button>
                        <button onClick={applyViewPanel}
                          className="px-5 py-2 rounded-xl bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 text-xs font-bold hover:bg-gray-700 dark:hover:bg-slate-200 transition-colors">
                          Apply
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Edit banner for inline row editing */}
            {editingRowId !== null && (
              <EditBanner onGoToMarketplace={() => {}} />
            )}

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-slate-800">
                    <th className="px-4 py-3 w-8">
                      <input type="checkbox" checked={pageProducts.length > 0 && selectedIds.size === pageProducts.length} onChange={toggleAll} className="rounded border-gray-300 dark:border-slate-600 text-brand focus:ring-brand/20" />
                    </th>
                    <th className="px-3 py-3 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider text-left w-8">#</th>
                    <th className="px-3 py-3 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider text-left w-12">Image</th>
                    <th className="px-3 py-3 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider text-left">Product</th>
                    {visibleCols.map(col => (
                      <th key={col.key} className="px-3 py-3 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider text-left">{col.label}</th>
                    ))}
                    <th className="px-3 py-3 w-24"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-800/60">
                  {pageProducts.length === 0 ? (
                    <tr><td colSpan={5 + visibleCols.length} className="px-4 py-12 text-center text-sm text-gray-400 dark:text-slate-500">No products match your search.</td></tr>
                  ) : pageProducts.map((product, idx) => {
                    const isEditing   = editingRowId === product.id;
                    const isDisabled  = editingRowId !== null && !isEditing;
                    const rowNum      = (page - 1) * PAGE_SIZE + idx + 1;
                    return (
                      <tr
                        key={product.id}
                        onClick={!isEditing && !isDisabled ? () => handleProductClick(product) : undefined}
                        className={`transition-colors ${isEditing ? 'bg-gray-50/80 dark:bg-slate-800/30' : isDisabled ? 'opacity-40 pointer-events-none' : 'hover:bg-gray-50/80 dark:hover:bg-slate-800/30 cursor-pointer group'}`}
                      >
                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                          <input type="checkbox" checked={selectedIds.has(product.id)} onChange={() => toggleSelect(product.id)} disabled={editingRowId !== null} className="rounded border-gray-300 dark:border-slate-600 text-brand focus:ring-brand/20 disabled:opacity-40" />
                        </td>
                        {/* Row number */}
                        <td className="px-3 py-3 w-8">
                          <span className="text-xs text-gray-400 dark:text-slate-500 font-mono select-none">{rowNum}</span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                            {product.image
                              ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                              : <i className="fa-solid fa-box text-gray-300 dark:text-slate-600 text-[11px]" />}
                          </div>
                        </td>
                        <td className="px-3 py-3 min-w-[160px]">
                          {isEditing ? (
                            <div className="flex flex-col gap-0.5">
                              <input type="text" value={editingRowVals.name} onChange={e => updateEditVal('name', e.target.value)}
                                className="text-sm font-semibold text-gray-900 dark:text-slate-100 bg-transparent border-b border-gray-300 dark:border-slate-600 focus:border-gray-500 dark:focus:border-slate-400 outline-none py-0.5 w-full" />
                              <p className="text-[10px] text-gray-400 dark:text-slate-500 font-mono">{product.sku}</p>
                            </div>
                          ) : (
                            <>
                              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 group-hover:text-brand dark:group-hover:text-gray-200 transition-colors leading-tight">{product.name}</p>
                              <p className="text-[10px] text-gray-400 dark:text-slate-500 font-mono mt-0.5">{product.sku}</p>
                            </>
                          )}
                        </td>
                        {visibleCols.map(col => isEditing ? renderEditCell(col.key) : renderCell(product, col.key))}

                        {/* Action buttons */}
                        <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <button onClick={saveEdit} className="w-7 h-7 flex items-center justify-center rounded-xl bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900 hover:opacity-80 transition">
                                <i className="fa-solid fa-check text-[10px]" />
                              </button>
                              <button onClick={cancelEdit} className="w-7 h-7 flex items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition">
                                <i className="fa-solid fa-xmark text-[10px]" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-0.5">
                              {/* Edit */}
                              <button
                                onClick={e => startEdit(e, product)}
                                disabled={editingRowId !== null}
                                title="Edit"
                                className="w-7 h-7 flex items-center justify-center rounded-xl text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-0"
                              >
                                <i className="fa-solid fa-pen text-[10px]" />
                              </button>
                              {/* Draft */}
                              <button
                                onClick={e => handleDraftRow(product, e)}
                                disabled={editingRowId !== null}
                                title="Mark as Draft"
                                className="w-7 h-7 flex items-center justify-center rounded-xl text-gray-400 dark:text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors disabled:opacity-0"
                              >
                                <i className="fa-solid fa-file-pen text-[10px]" />
                              </button>
                              {/* Delete */}
                              <button
                                onClick={e => handleDeleteProduct(product, e)}
                                disabled={editingRowId !== null}
                                title="Delete"
                                className="w-7 h-7 flex items-center justify-center rounded-xl text-gray-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-0"
                              >
                                <i className="fa-solid fa-trash text-[10px]" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-1">
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Showing {Math.min((page - 1) * PAGE_SIZE + 1, sortedFiltered.length)}–{Math.min(page * PAGE_SIZE, sortedFiltered.length)} of {sortedFiltered.length} products
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${page === 1 ? 'border-gray-100 dark:border-slate-800 text-gray-300 dark:text-slate-600 cursor-default' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-900'}`}>
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${page === p ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-gray-900' : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'}`}>
                      {p}
                    </button>
                  ))}
                  {totalPages > 5 && <span className="text-xs text-gray-400">…</span>}
                </div>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${page === totalPages || totalPages === 0 ? 'border-gray-100 dark:border-slate-800 text-gray-300 dark:text-slate-600 cursor-default' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-900'}`}>
                  Next
                </button>
              </div>
            </div>
          </>
        )}

        {/* Delete Confirm Modal */}
        {deleteConfirmProduct && (
          <DeleteConfirmModal
            product={deleteConfirmProduct}
            onConfirm={confirmDelete}
            onCancel={() => setDeleteConfirmProduct(null)}
          />
        )}

        {/* Bulk Delete Confirm Modal */}
        {bulkDeletePending && (
          <BulkDeleteConfirmModal
            count={selectedIds.size}
            onConfirm={confirmBulkDelete}
            onCancel={() => setBulkDeletePending(false)}
          />
        )}

      </div>
    </DashboardLayout>
  );
};

export default ProductsListPage;
