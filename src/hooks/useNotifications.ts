import { useEffect, useRef } from 'react';
import { Complaint, User } from '../types';

interface UseNotificationsOptions {
  enabled: boolean;
  user: User | null;
  complaints: Complaint[];
  interval?: number; // in milliseconds
}

export function useNotifications({ 
  enabled, 
  user, 
  complaints,
  interval = 30 * 60 * 1000 // Default 30 minutes
}: UseNotificationsOptions) {
  const permissionRequested = useRef(false);

  // Request notification permission once
  useEffect(() => {
    if (!enabled || !user || user.role !== 'admin') return;
    if (permissionRequested.current) return;
    if (!('Notification' in window)) return;

    if (Notification.permission === 'default') {
      Notification.requestPermission();
      permissionRequested.current = true;
    }
  }, [enabled, user]);

  // Send periodic notifications for critical complaints
  useEffect(() => {
    if (!enabled || !user || user.role !== 'admin') return;
    if (Notification.permission !== 'granted') return;

    const criticalComplaints = complaints.filter(
      (c) => c.status !== 'Resolved' && c.daysOpened >= 14
    );

    if (criticalComplaints.length === 0) return;

    const notificationInterval = setInterval(() => {
      if (Notification.permission === 'granted') {
        new Notification('🚨 SCMS: Critical Complaints Alert', {
          body: `${criticalComplaints.length} complaint${
            criticalComplaints.length > 1 ? 's are' : ' is'
          } critically overdue at ${user.university}! Click to view.`,
          icon: '/favicon.ico',
          tag: 'critical-complaints',
          requireInteraction: true,
        });
      }
    }, interval);

    return () => clearInterval(notificationInterval);
  }, [enabled, user, complaints, interval]);

  const sendNotification = (title: string, body: string) => {
    if (!enabled) return;
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    new Notification(title, {
      body,
      icon: '/favicon.ico',
    });
  };

  return {
    sendNotification,
    hasPermission: 'Notification' in window && Notification.permission === 'granted',
    canRequestPermission: 'Notification' in window && Notification.permission === 'default',
  };
}
