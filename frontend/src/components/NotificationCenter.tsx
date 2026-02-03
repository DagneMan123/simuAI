import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {  CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  Info,
  Award
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSocket } from '@/contexts/SocketContext'
import { useToast } from '@/hooks/use-toast'

interface Notification {
  id: string
  type: 'info' | 'warning' | 'success' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'info',
      title: 'New Simulation Invitation',
      message: 'You have been invited to complete a software engineering assessment',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
      action: {
        label: 'View',
        onClick: () => console.log('View assessment'),
      },
    },
    {
      id: '2',
      type: 'success',
      title: 'Assessment Completed',
      message: 'Your submission has been received and is being evaluated',
      timestamp: new Date(Date.now() - 7200000),
      read: true,
    },
  ])
  
  const { socket, isConnected } = useSocket()
  const { toast } = useToast()

  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'success':
        return <Award className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return `${Math.floor(diff / 86400000)}d ago`
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  useEffect(() => {
    if (!socket || !isConnected) return

    socket.on('notification', (data: any) => {
      const newNotification: Notification = {
        id: `socket-${Date.now()}`,
        type: data.type || 'info',
        title: data.title,
        message: data.message,
        timestamp: new Date(),
        read: false,
        action: data.action,
      }

      setNotifications(prev => [newNotification, ...prev])

      // Show toast
      toast({
        title: data.title,
        description: data.message,
        variant: data.type === 'error' ? 'destructive' : 'default',
      })
    })

    socket.on('assessment-invite', (data: any) => {
      const notification: Notification = {
        id: `invite-${data.simulationId}`,
        type: 'info',
        title: 'New Assessment Invitation',
        message: `You've been invited to "${data.simulationTitle}"`,
        timestamp: new Date(),
        read: false,
        action: {
          label: 'Start Assessment',
          onClick: () => {
            window.location.href = `/simulations/${data.simulationId}`
          },
        },
      }

      setNotifications(prev => [notification, ...prev])
    })

    return () => {
      socket.off('notification')
      socket.off('assessment-invite')
    }
  }, [socket, isConnected, toast])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 min-w-[20px] rounded-full p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Notifications</CardTitle>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-auto p-0 text-xs"
              >
                <CheckCheck className="mr-1 h-3 w-3" />
                Mark all as read
              </Button>
            )}
          </div>
        </CardHeader>
        
        <ScrollArea className="h-[400px]">
          <CardContent className="p-4 pt-0">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">No notifications</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      'rounded-lg border p-3 transition-colors hover:bg-muted/50',
                      !notification.read && 'bg-blue-50 dark:bg-blue-950/20'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">
                            {notification.title}
                          </p>
                          <button
                            onClick={() => removeNotification(notification.id)}
                            className="text-xs text-muted-foreground hover:text-destructive"
                          >
                            Dismiss
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatTime(notification.timestamp)}
                          </span>
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-blue-600 hover:text-blue-800"
                              >
                                Mark as read
                              </button>
                            )}
                            {notification.action && (
                              <Button
                                size="sm"
                                variant="link"
                                className="h-auto p-0 text-xs"
                                onClick={notification.action.onClick}
                              >
                                {notification.action.label}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </ScrollArea>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer justify-center text-center"
          onClick={() => {
            // Clear all notifications logic
          }}
        >
          Clear All Notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NotificationCenter