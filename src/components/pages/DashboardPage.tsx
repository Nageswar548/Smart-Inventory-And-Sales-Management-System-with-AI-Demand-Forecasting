import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BaseCrudService } from '@/integrations';
import { Products, SalesOrders, DemandForecasts, Notifications } from '@/entities';
import { 
  Package, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  ShoppingCart,
  Users,
  BarChart3,
  Bell
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const [products, setProducts] = useState<Products[]>([]);
  const [salesOrders, setSalesOrders] = useState<SalesOrders[]>([]);
  const [forecasts, setForecasts] = useState<DemandForecasts[]>([]);
  const [notifications, setNotifications] = useState<Notifications[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, ordersData, forecastsData, notificationsData] = await Promise.all([
          BaseCrudService.getAll<Products>('products'),
          BaseCrudService.getAll<SalesOrders>('salesorders'),
          BaseCrudService.getAll<DemandForecasts>('demandforecasts'),
          BaseCrudService.getAll<Notifications>('notifications')
        ]);

        setProducts(productsData.items);
        setSalesOrders(ordersData.items);
        setForecasts(forecastsData.items);
        setNotifications(notificationsData.items);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate metrics
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const lowStockProducts = products.filter(p => 
    p.currentStock !== undefined && 
    p.lowStockThreshold !== undefined && 
    p.currentStock <= p.lowStockThreshold
  ).length;
  
  const totalRevenue = salesOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const pendingOrders = salesOrders.filter(order => order.orderStatus === 'pending').length;
  const completedOrders = salesOrders.filter(order => order.orderStatus === 'completed').length;
  
  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  // Chart data
  const salesChartData = salesOrders
    .slice(-7)
    .map(order => ({
      date: new Date(order.orderDate || '').toLocaleDateString(),
      amount: order.totalAmount || 0
    }));

  const stockChartData = products
    .slice(0, 5)
    .map(product => ({
      name: product.productName?.substring(0, 10) + '...' || 'Product',
      stock: product.currentStock || 0,
      threshold: product.lowStockThreshold || 0
    }));

  const orderStatusData = [
    { name: 'Completed', value: completedOrders, color: '#22c55e' },
    { name: 'Pending', value: pendingOrders, color: '#f59e0b' },
    { name: 'Processing', value: salesOrders.filter(o => o.orderStatus === 'processing').length, color: '#3b82f6' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="font-paragraph text-secondary-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-primary mb-2">
            Dashboard
          </h1>
          <p className="font-paragraph text-secondary-foreground">
            Overview of your inventory and sales performance
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-lg rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-paragraph text-sm text-secondary-foreground mb-1">
                    Total Products
                  </p>
                  <p className="font-heading text-2xl font-bold text-primary">
                    {totalProducts}
                  </p>
                  <p className="font-paragraph text-xs text-green-600">
                    {activeProducts} active
                  </p>
                </div>
                <div className="bg-primary/10 p-3 rounded-2xl">
                  <Package className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-paragraph text-sm text-secondary-foreground mb-1">
                    Total Revenue
                  </p>
                  <p className="font-heading text-2xl font-bold text-primary">
                    ${totalRevenue.toLocaleString()}
                  </p>
                  <p className="font-paragraph text-xs text-green-600">
                    +12% from last month
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-2xl">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-paragraph text-sm text-secondary-foreground mb-1">
                    Low Stock Alerts
                  </p>
                  <p className="font-heading text-2xl font-bold text-primary">
                    {lowStockProducts}
                  </p>
                  <p className="font-paragraph text-xs text-orange-600">
                    Requires attention
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-2xl">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-paragraph text-sm text-secondary-foreground mb-1">
                    Pending Orders
                  </p>
                  <p className="font-heading text-2xl font-bold text-primary">
                    {pendingOrders}
                  </p>
                  <p className="font-paragraph text-xs text-blue-600">
                    {completedOrders} completed
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-2xl">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Trend Chart */}
          <Card className="bg-white border-0 shadow-lg rounded-3xl">
            <CardHeader>
              <CardTitle className="font-heading text-xl font-semibold text-primary">
                Sales Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Line type="monotone" dataKey="amount" stroke="#1e2e69" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Stock Levels Chart */}
          <Card className="bg-white border-0 shadow-lg rounded-3xl">
            <CardHeader>
              <CardTitle className="font-heading text-xl font-semibold text-primary">
                Stock Levels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stockChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="stock" fill="#1e2e69" />
                  <Bar dataKey="threshold" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Status Distribution */}
          <Card className="bg-white border-0 shadow-lg rounded-3xl">
            <CardHeader>
              <CardTitle className="font-heading text-xl font-semibold text-primary">
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {orderStatusData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-paragraph text-sm text-secondary-foreground">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-paragraph text-sm font-medium text-primary">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card className="bg-white border-0 shadow-lg rounded-3xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading text-xl font-semibold text-primary">
                Recent Notifications
              </CardTitle>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {unreadNotifications} new
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.slice(0, 5).map((notification) => (
                  <div key={notification._id} className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Bell className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-paragraph text-sm text-secondary-foreground">
                        {notification.message}
                      </p>
                      <p className="font-paragraph text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt || '').toLocaleDateString()}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                ))}
              </div>
              <Link to="/notifications">
                <Button variant="outline" className="w-full mt-4 border-buttonoutline text-buttonoutline hover:bg-buttonoutline hover:text-white">
                  View All Notifications
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white border-0 shadow-lg rounded-3xl">
            <CardHeader>
              <CardTitle className="font-heading text-xl font-semibold text-primary">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/inventory">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Package className="h-4 w-4 mr-2" />
                  Manage Inventory
                </Button>
              </Link>
              
              <Link to="/sales">
                <Button variant="outline" className="w-full border-buttonoutline text-buttonoutline hover:bg-buttonoutline hover:text-white">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  View Sales
                </Button>
              </Link>
              
              <Link to="/forecasting">
                <Button variant="outline" className="w-full border-buttonoutline text-buttonoutline hover:bg-buttonoutline hover:text-white">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  AI Forecasting
                </Button>
              </Link>
              
              <Button variant="outline" className="w-full border-gray-300 text-gray-600 hover:bg-gray-50">
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}