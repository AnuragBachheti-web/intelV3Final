import { useState, useMemo } from 'react';
import { actionItems } from '../actionsData';

export const useActionFilters = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    priority: 'all',
    category: 'all',
    status: 'all',
  });

  const filteredActions = useMemo(() => {
    return actionItems.filter(item => {
      const priorityMatch = filters.priority === 'all' || item.priority.toLowerCase() === filters.priority;
      const categoryMatch = filters.category === 'all' || item.category.toLowerCase().replace(' ', '-') === filters.category;
      const statusMatch = filters.status === 'all' || item.status.toLowerCase() === filters.status;
      const tabMatch = activeTab.toLowerCase() === 'all' || item.priority.toLowerCase() === activeTab.toLowerCase();
      const searchMatch = searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      return priorityMatch && categoryMatch && statusMatch && tabMatch && searchMatch;
    });
  }, [filters, activeTab, searchQuery]);

  const resetFilters = () => {
    setFilters({ priority: 'all', category: 'all', status: 'all' });
    setSearchQuery('');
    setActiveTab('all');
  };

  return { activeTab, setActiveTab, searchQuery, setSearchQuery, filters, setFilters, filteredActions, resetFilters };
};
