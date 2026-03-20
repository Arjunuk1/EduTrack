import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';

// Toast Notification Context
const ToastContext = createContext();

export const useToasts = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToasts must be used within ToastProvider');
  }
  return context;
};

// Toast Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((options) => {
    const id = Date.now();
    const toast = {
      id,
      duration: 4000,
      position: 'top-right',
      ...options
    };

    setToasts(prev => [...prev, toast]);

    // Auto-remove toast after duration
    if (toast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast }) => {
  const positions = {
    'top-left': { top: 20, left: 20 },
    'top-right': { top: 20, right: 20 },
    'bottom-left': { bottom: 20, left: 20 },
    'bottom-right': { bottom: 20, right: 20 },
    'top-center': { top: 20, left: '50%', transform: 'translateX(-50%)' }
  };

  const groupedToasts = {};
  toasts.forEach(toast => {
    const pos = toast.position || 'top-right';
    if (!groupedToasts[pos]) {
      groupedToasts[pos] = [];
    }
    groupedToasts[pos].push(toast);
  });

  return (
    <>
      {Object.entries(groupedToasts).map(([position, posToasts]) => (
        <div
          key={position}
          className="toast-container"
          style={{
            position: 'fixed',
            ...positions[position],
            zIndex: 9999,
            pointerEvents: 'none'
          }}
        >
          {posToasts.map(toast => (
            <Toast
              key={toast.id}
              toast={toast}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>
      ))}
    </>
  );
};

// Individual Toast Component
const Toast = ({ toast, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  const getIcon = () => {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[toast.type] || '📦';
  };

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`toast toast-${toast.type} ${isExiting ? 'toast-exit' : ''}`}
      role="alert"
    >
      <div className="toast-icon">{getIcon()}</div>
      
      <div className="toast-content">
        {toast.title && <div className="toast-title">{toast.title}</div>}
        <div className="toast-message">{toast.message}</div>
      </div>

      <button
        className="toast-close"
        onClick={handleClose}
        aria-label="Close notification"
      >
        ✕
      </button>

      <div className="toast-progress">
        <div className="toast-progress-bar"></div>
      </div>

      <style jsx>{`
        .toast {
          pointer-events: auto;
          background: white;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          display: flex;
          gap: 12px;
          align-items: flex-start;
          min-width: 300px;
          max-width: 420px;
          animation: slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          border-left: 4px solid #667eea;
          position: relative;
          overflow: hidden;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .toast-exit {
          animation: slideOut 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(120%);
          }
        }

        .toast-success {
          border-left-color: #10b981;
          background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
        }

        .toast-error {
          border-left-color: #ef4444;
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
        }

        .toast-warning {
          border-left-color: #f59e0b;
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
        }

        .toast-info {
          border-left-color: #3b82f6;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        }

        .toast-icon {
          font-size: 20px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .toast-content {
          flex: 1;
        }

        .toast-title {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
          font-size: 14px;
        }

        .toast-message {
          color: #4b5563;
          font-size: 13px;
          line-height: 1.4;
        }

        .toast-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          font-size: 18px;
          padding: 0;
          flex-shrink: 0;
          transition: color 0.2s ease;
        }

        .toast-close:hover {
          color: #6b7280;
        }

        .toast-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .toast-progress-bar {
          height: 100%;
          background: currentColor;
          animation: progress 4s linear forwards;
        }

        .toast-success .toast-progress-bar {
          background: #10b981;
        }

        .toast-error .toast-progress-bar {
          background: #ef4444;
        }

        .toast-warning .toast-progress-bar {
          background: #f59e0b;
        }

        .toast-info .toast-progress-bar {
          background: #3b82f6;
        }

        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        @media (max-width: 540px) {
          .toast {
            min-width: auto;
            max-width: calc(100vw - 24px);
          }
        }
      `}</style>
    </div>
  );
};

export default ToastProvider;
