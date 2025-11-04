"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { notificationService } from '@/lib/services/notificationService';
import { authService } from '@/lib/services/authService';
import type { Notification, ConnectionStatus } from '@/lib/types/Notification';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  connectionStatus: ConnectionStatus;
  loading: boolean;
  refresh: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('DISCONNECTED');
  const [loading, setLoading] = useState(false);

  // Load initial notifications
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const { notifications: data } = await notificationService.getNotifications(0, 50);
      setNotifications(data);
      
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Setup SSE connection
  useEffect(() => {
    const token = authService.getAccessToken();
    if (!token) return;

    // Connect to SSE
    notificationService.connectSSE(token);

    // Listen for connection status changes
    const unsubscribeStatus = notificationService.onStatusChange(setConnectionStatus);

    // Listen for new notifications
    const unsubscribeNotification = notificationService.onNotification((notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    // Load initial data
    loadNotifications();

    // Cleanup on unmount or logout
    return () => {
      unsubscribeStatus();
      unsubscribeNotification();
      notificationService.disconnectSSE();
    };
  }, []);

  const markAsRead = async (id: string) => {
    const success = await notificationService.markAsRead(id);
    if (success) {
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    const success = await notificationService.markAllAsRead();
    if (success) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  const deleteNotification = async (id: string) => {
    const success = await notificationService.deleteNotification(id);
    if (success) {
      setNotifications(prev => prev.filter(n => n.id !== id));
      const notification = notifications.find(n => n.id === id);
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    }
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    connectionStatus,
    loading,
    refresh: loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
