/**
 * AriaLiveRegion Component
 * 
 * Provides screen reader announcements for user actions
 * Invisible component that uses ARIA live regions (WCAG 2.1 AA)
 * 
 * Features:
 * - Announces success/error messages to screen readers
 * - Auto-removes announcements after 3 seconds
 * - Polite announcements (doesn't interrupt current reading)
 * 
 * Usage:
 * Place once in root layout.tsx
 * Use useNotificationStore().addNotification() to trigger announcements
 */

'use client';

import { useNotificationStore } from '@/lib/stores/notificationStore';

export default function AriaLiveRegion() {
  const notifications = useNotificationStore((state) => state.notifications);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {notifications.map((notification) => (
        <div key={notification.id}>
          {notification.type === 'success' && '✓ '}
          {notification.type === 'error' && '✗ '}
          {notification.type === 'info' && 'ℹ '}
          {notification.message}
        </div>
      ))}
    </div>
  );
}
