import React from 'react';

const EmptyState = ({ 
  icon = '📭', 
  title = 'No data found',
  message = 'There are no items to display.',
  actionButton = null,
  type = 'default' // 'default', 'search', 'filter', 'add'
}) => {
  const getIcon = () => {
    const iconMap = {
      search: '🔍',
      filter: '⚙️',
      add: '➕',
      empty: '📭',
      error: '⚠️',
      default: '📭'
    };
    return iconMap[type] || icon;
  };

  const getMessage = () => {
    const messages = {
      search: 'Try adjusting your search criteria.',
      filter: 'Try removing some filters.',
      add: 'Click the button above to add the first item.',
      empty: 'There are no items to display.',
      default: message
    };
    return messages[type] || message;
  };

  return (
    <div className={`empty-state empty-state-${type}`}>
      <div className="empty-state-icon">{getIcon()}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{getMessage()}</p>
      {actionButton && (
        <div className="empty-state-action">
          {actionButton}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
