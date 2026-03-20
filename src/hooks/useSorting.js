import { useState, useMemo } from 'react';

export const useSorting = (initialData, initialSortKey = null, initialOrder = 'asc') => {
  const [sortKey, setSortKey] = useState(initialSortKey);
  const [sortOrder, setSortOrder] = useState(initialOrder);

  const handleSort = (key) => {
    if (sortKey === key) {
      // Toggle sort order if clicking the same column
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort key with ascending as default
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey || !initialData) return initialData;

    const dataCopy = [...initialData];
    
    dataCopy.sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortOrder === 'asc' ? 1 : -1;
      if (bValue == null) return sortOrder === 'asc' ? -1 : 1;

      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Fallback to string comparison
      const aStr = String(aValue);
      const bStr = String(bValue);
      return sortOrder === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });

    return dataCopy;
  }, [initialData, sortKey, sortOrder]);

  const getSortIndicator = (key) => {
    if (sortKey !== key) return ' ↕️';
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  const isSorted = (key) => sortKey === key;

  return {
    sortedData,
    sortKey,
    sortOrder,
    handleSort,
    getSortIndicator,
    isSorted,
    resetSort: () => {
      setSortKey(initialSortKey);
      setSortOrder(initialOrder);
    }
  };
};
