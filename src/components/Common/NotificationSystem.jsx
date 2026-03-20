import React, { useState, useEffect, createContext, useContext } from 'react';

// Notification Context
const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

// Notification Provider
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'info',
      title: 'System Update',
      message: 'New features have been added to the student portal.',
      timestamp: new Date(),
      read: false,
      priority: 'medium'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Fee Due Reminder',
      message: 'Fee payment deadline is approaching for Semester 1.',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
      priority: 'high'
    },
    {
      id: 3,
      type: 'success',
      title: 'Grades Published',
      message: 'Mid-term examination results are now available.',
      timestamp: new Date(Date.now() - 7200000),
      read: true,
      priority: 'medium'
    }
  ]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      priority: 'medium',
      ...notification
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getUnreadCount = () => {
    return notifications.filter(notif => !notif.read).length;
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      getUnreadCount
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Notification Bell Component
export const NotificationBell = () => {
  const { notifications, getUnreadCount, markAsRead } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);
  const unreadCount = getUnreadCount();

  return (
    <div className="notification-bell">
      <button 
        className="bell-button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h4>Notifications</h4>
            <button 
              className="mark-all-read"
              onClick={() => {
                notifications.forEach(notif => !notif.read && markAsRead(notif.id));
              }}
            >
              Mark all read
            </button>
          </div>
          
          <div className="notification-list">
            {notifications.slice(0, 5).map(notification => (
              <div 
                key={notification.id}
                className={`notification-item ${notification.read ? 'read' : 'unread'} ${notification.priority}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="notification-type">
                  {notification.type === 'info' && '💡'}
                  {notification.type === 'warning' && '⚠️'}
                  {notification.type === 'success' && '✅'}
                  {notification.type === 'error' && '❌'}
                </div>
                <div className="notification-content">
                  <div className="notification-title">{notification.title}</div>
                  <div className="notification-message">{notification.message}</div>
                  <div className="notification-time">
                    {formatTimeAgo(notification.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="notification-footer">
            <button className="view-all">View All Notifications</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .notification-bell {
          position: relative;
        }

        .bell-button {
          background: none;
          border: none;
          cursor: pointer;
          position: relative;
          padding: 8px;
          border-radius: 50%;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bell-button:hover {
          background: rgba(139, 92, 246, 0.15);
          transform: scale(1.1);
        }

        .bell-icon {
          font-size: 20px;
          display: block;
        }

        .notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
          border: 2px solid rgba(30, 30, 46, 0.8);
        }

        .notification-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          width: 380px;
          background: rgba(30, 30, 46, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 12px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
          z-index: 1000;
          border: 1px solid rgba(139, 92, 246, 0.2);
          max-height: 450px;
          overflow: hidden;
          margin-top: 12px;
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(139, 92, 246, 0.1);
          background: rgba(139, 92, 246, 0.05);
        }

        .notification-header h4 {
          margin: 0;
          font-size: 16px;
          color: #e4e4e7;
          font-weight: 700;
        }

        .mark-all-read {
          background: none;
          border: none;
          color: #8b5cf6;
          cursor: pointer;
          font-size: 12px;
          text-decoration: underline;
          transition: color 0.2s ease;
          font-weight: 500;
        }

        .mark-all-read:hover {
          color: #a78bfa;
        }

        .notification-list {
          max-height: 300px;
          overflow-y: auto;
        }

        .notification-item {
          display: flex;
          padding: 15px 20px;
          border-bottom: 1px solid rgba(139, 92, 246, 0.05);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .notification-item:hover {
          background: rgba(139, 92, 246, 0.1);
        }

        .notification-item.unread {
          background: rgba(139, 92, 246, 0.15);
          border-left: 3px solid #8b5cf6;
        }

        .notification-item.high {
          border-left-color: #ef4444;
        }

        .notification-type {
          margin-right: 12px;
          font-size: 18px;
          flex-shrink: 0;
        }

        .notification-content {
          flex: 1;
        }

        .notification-title {
          font-weight: 600;
          color: #e4e4e7;
          margin-bottom: 4px;
          font-size: 14px;
        }

        .notification-message {
          color: #a1a1aa;
          font-size: 13px;
          margin-bottom: 6px;
          line-height: 1.4;
        }

        .notification-time {
          color: #71717a;
          font-size: 11px;
        }

        .notification-footer {
          padding: 15px 20px;
          border-top: 1px solid rgba(139, 92, 246, 0.1);
          text-align: center;
          background: rgba(139, 92, 246, 0.05);
        }

        .view-all {
          background: none;
          border: none;
          color: #8b5cf6;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .view-all:hover {
          color: #a78bfa;
        }

        @media (max-width: 768px) {
          .notification-dropdown {
            width: 300px;
            right: -20px;
          }
        }
      `}</style>
    </div>
  );
};

// Helper function to format time ago
const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};
