import { create } from 'zustand';

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

interface NotificationState {
  notifications: Notification[];
  
  // Actions
  addNotification: (message: string, type: NotificationType) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

/**
 * Zustand store for transient notifications
 * Notifications auto-remove after 3 seconds
 * Used for aria-live regions (screen reader announcements)
 */
export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  
  addNotification: (message: string, type: NotificationType = 'info') => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const notification: Notification = {
      id,
      message,
      type,
    };
    
    // Add to store
    set((state) => ({
      notifications: [...state.notifications, notification],
    }));
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      get().removeNotification(id);
    }, 3000);
  },
  
  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
  
  clearAll: () => {
    set({ notifications: [] });
  },
}));
