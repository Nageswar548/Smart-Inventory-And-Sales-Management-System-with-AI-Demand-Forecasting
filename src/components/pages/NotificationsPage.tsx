import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { BaseCrudService } from '@/integrations';
import { Notifications } from '@/entities';
import { 
  Bell, 
  Search, 
  Check, 
  CheckCheck, 
  AlertTriangle, 
  Info, 
  Package,
  TrendingUp,
  ShoppingCart,
  Filter,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notifications[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notifications[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [notifications, searchTerm, filterType, filterStatus]);

  const fetchNotifications = async () => {
    try {
      const { items } = await BaseCrudService.getAll<Notifications>('notifications');
      setNotifications(items);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterNotifications = () => {
    let filtered = notifications;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(notification =>
        notification.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.notificationType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(notification => notification.notificationType === filterType);
    }

    // Status filter
    if (filterStatus === 'unread') {
      filtered = filtered.filter(notification => !notification.isRead);
    } else if (filterStatus === 'read') {
      filtered = filtered.filter(notification => notification.isRead);
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a._createdDate || '');
      const dateB = new Date(b.createdAt || b._createdDate || '');
      return dateB.getTime() - dateA.getTime();
    });

    setFilteredNotifications(filtered);
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const notification = notifications.find(n => n._id === notificationId);
      if (notification) {
        await BaseCrudService.update<Notifications>('notifications', {
          _id: notificationId,
          ...notification,
          isRead: true
        });
        await fetchNotifications();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      
      await Promise.all(
        unreadNotifications.map(notification =>
          BaseCrudService.update<Notifications>('notifications', {
            _id: notification._id,
            ...notification,
            isRead: true
          })
        )
      );
      
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'low_stock':
      case 'inventory':
        return <Package className="h-5 w-5 text-orange-600" />;
      case 'sales':
      case 'order':
        return <ShoppingCart className="h-5 w-5 text-blue-600" />;
      case 'forecast':
      case 'ai':
        return <TrendingUp className="h-5 w-5 text-purple-600" />;
      case 'alert':
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="secondary">Normal</Badge>;
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'low_stock':
        return 'Low Stock Alert';
      case 'inventory':
        return 'Inventory Update';
      case 'sales':
        return 'Sales Notification';
      case 'order':
        return 'Order Update';
      case 'forecast':
        return 'Forecast Alert';
      case 'ai':
        return 'AI Insight';
      case 'alert':
        return 'System Alert';
      case 'warning':
        return 'Warning';
      default:
        return 'Notification';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high' && !n.isRead).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="font-paragraph text-secondary-foreground">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-primary/10 p-3 rounded-2xl">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <h1 className="font-heading text-3xl font-bold text-primary">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <Badge className="bg-red-100 text-red-800">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
            <p className="font-paragraph text-secondary-foreground">
              Stay updated with important alerts and system notifications
            </p>
          </div>
          
          {unreadCount > 0 && (
            <Button 
              onClick={markAllAsRead}
              className="bg-primary hover:bg-primary/90 text-primary-foreground mt-4 sm:mt-0"
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-lg rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-paragraph text-sm text-secondary-foreground mb-1">
                    Total Notifications
                  </p>
                  <p className="font-heading text-2xl font-bold text-primary">
                    {notifications.length}
                  </p>
                </div>
                <div className="bg-primary/10 p-3 rounded-2xl">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-paragraph text-sm text-secondary-foreground mb-1">
                    Unread
                  </p>
                  <p className="font-heading text-2xl font-bold text-primary">
                    {unreadCount}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-2xl">
                  <Info className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-paragraph text-sm text-secondary-foreground mb-1">
                    High Priority
                  </p>
                  <p className="font-heading text-2xl font-bold text-primary">
                    {highPriorityCount}
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-2xl">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white border-0 shadow-lg rounded-3xl mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('all')}
                  className={filterStatus === 'all' ? 'bg-primary text-primary-foreground' : 'border-buttonoutline text-buttonoutline hover:bg-buttonoutline hover:text-white'}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === 'unread' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('unread')}
                  className={filterStatus === 'unread' ? 'bg-primary text-primary-foreground' : 'border-buttonoutline text-buttonoutline hover:bg-buttonoutline hover:text-white'}
                >
                  Unread
                </Button>
                <Button
                  variant={filterType === 'low_stock' ? 'default' : 'outline'}
                  onClick={() => setFilterType(filterType === 'low_stock' ? 'all' : 'low_stock')}
                  className={filterType === 'low_stock' ? 'bg-primary text-primary-foreground' : 'border-buttonoutline text-buttonoutline hover:bg-buttonoutline hover:text-white'}
                >
                  <Package className="h-4 w-4 mr-1" />
                  Low Stock
                </Button>
                <Button
                  variant={filterType === 'sales' ? 'default' : 'outline'}
                  onClick={() => setFilterType(filterType === 'sales' ? 'all' : 'sales')}
                  className={filterType === 'sales' ? 'bg-primary text-primary-foreground' : 'border-buttonoutline text-buttonoutline hover:bg-buttonoutline hover:text-white'}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Sales
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card className="bg-white border-0 shadow-lg rounded-3xl">
          <CardHeader>
            <CardTitle className="font-heading text-xl font-semibold text-primary">
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification._id} 
                  className={`border rounded-2xl p-6 transition-all hover:shadow-md ${
                    !notification.isRead ? 'border-primary/20 bg-primary/5' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="bg-white p-2 rounded-xl shadow-sm">
                        {getNotificationIcon(notification.notificationType || 'info')}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-heading text-lg font-semibold text-primary">
                            {getNotificationTypeLabel(notification.notificationType || 'info')}
                          </h3>
                          {notification.priority && getPriorityBadge(notification.priority)}
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                        
                        <p className="font-paragraph text-secondary-foreground mb-3 leading-relaxed">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="font-paragraph">
                            {notification.createdAt ? 
                              format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm') :
                              notification._createdDate ?
                              format(new Date(notification._createdDate), 'MMM dd, yyyy HH:mm') :
                              'Unknown date'
                            }
                          </span>
                          {notification.relatedItem && (
                            <>
                              <span>•</span>
                              <span className="font-paragraph">
                                Related: {notification.relatedItem}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {notification.actionUrl && (
                        <Button
                          onClick={() => window.open(notification.actionUrl, '_blank')}
                          variant="outline"
                          size="sm"
                          className="border-blue-300 text-blue-600 hover:bg-blue-50"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      )}
                      
                      {!notification.isRead && (
                        <Button
                          onClick={() => markAsRead(notification._id)}
                          variant="outline"
                          size="sm"
                          className="border-green-300 text-green-600 hover:bg-green-50"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Mark Read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredNotifications.length === 0 && (
              <div className="text-center py-12">
                <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="font-heading text-xl font-semibold text-primary mb-2">
                  No notifications found
                </h3>
                <p className="font-paragraph text-secondary-foreground">
                  {searchTerm || filterType !== 'all' || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'You\'re all caught up! No new notifications at this time.'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}