import { useToasts } from '../components/Common/ToastNotification';

/**
 * Helper hook to bridge the old addNotification API with the new Toast system
 * This allows components to create toasts without changing existing code
 */
export const useNotificationToasts = () => {
  const { addToast } = useToasts();

  const addNotification = (options = {}) => {
    const { type = 'info', title, message, duration = 4000, position = 'top-right' } = options;

    return addToast({
      type,
      title,
      message,
      duration,
      position
    });
  };

  return { addNotification };
};

/**
 * Quick notification shortcuts
 */
export const useQuickNotifications = () => {
  const { addToast } = useToasts();

  return {
    success: (title, message, duration = 4000) =>
      addToast({ type: 'success', title, message, duration, position: 'top-right' }),
    
    error: (title, message, duration = 5000) =>
      addToast({ type: 'error', title, message, duration, position: 'top-right' }),
    
    warning: (title, message, duration = 4000) =>
      addToast({ type: 'warning', title, message, duration, position: 'top-right' }),
    
    info: (title, message, duration = 4000) =>
      addToast({ type: 'info', title, message, duration, position: 'top-right' })
  };
};
