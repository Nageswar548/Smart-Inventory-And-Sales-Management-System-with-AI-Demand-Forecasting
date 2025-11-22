import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BaseCrudService } from '@/integrations';
import { SalesOrders, Products } from '@/entities';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Eye, 
  Download,
  Calendar,
  DollarSign,
  Package,
  User,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';

interface OrderFormData {
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  invoiceNumber: string;
  invoiceUrl: string;
}

export default function SalesPage() {
  const [orders, setOrders] = useState<SalesOrders[]>([]);
  const [products, setProducts] = useState<Products[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<SalesOrders[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrders | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [formData, setFormData] = useState<OrderFormData>({
    orderNumber: '',
    customerName: '',
    totalAmount: 0,
    orderStatus: 'pending',
    paymentStatus: 'pending',
    invoiceNumber: '',
    invoiceUrl: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const fetchData = async () => {
    try {
      const [ordersData, productsData] = await Promise.all([
        BaseCrudService.getAll<SalesOrders>('salesorders'),
        BaseCrudService.getAll<Products>('products')
      ]);
      
      setOrders(ordersData.items);
      setProducts(productsData.items);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.orderStatus === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    return `ORD-${timestamp}`;
  };

  const generateInvoiceNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    return `INV-${timestamp}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await BaseCrudService.create('salesorders', {
        _id: crypto.randomUUID(),
        ...formData,
        orderDate: new Date().toISOString()
      } as any);
      
      await fetchData();
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      orderNumber: generateOrderNumber(),
      customerName: '',
      totalAmount: 0,
      orderStatus: 'pending',
      paymentStatus: 'pending',
      invoiceNumber: generateInvoiceNumber(),
      invoiceUrl: ''
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'refunded':
        return <Badge className="bg-gray-100 text-gray-800">Refunded</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const pendingOrders = orders.filter(order => order.orderStatus === 'pending').length;
  const completedOrders = orders.filter(order => order.orderStatus === 'completed').length;
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="font-paragraph text-secondary-foreground">Loading sales data...</p>
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
            <h1 className="font-heading text-3xl font-bold text-primary mb-2">
              Sales Management
            </h1>
            <p className="font-paragraph text-secondary-foreground">
              Track orders, manage invoices, and monitor sales performance
            </p>
          </div>
          
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Button variant="outline" className="border-buttonoutline text-buttonoutline hover:bg-buttonoutline hover:text-white">
              <Download className="h-4 w-4 mr-2" />
              Export Sales
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => {
                    resetForm();
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Order
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="font-heading text-xl font-semibold text-primary">
                    Create New Order
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="orderNumber">Order Number</Label>
                      <Input
                        id="orderNumber"
                        value={formData.orderNumber}
                        onChange={(e) => setFormData({...formData, orderNumber: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Customer Name</Label>
                      <Input
                        id="customerName"
                        value={formData.customerName}
                        onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="totalAmount">Total Amount ($)</Label>
                      <Input
                        id="totalAmount"
                        type="number"
                        step="0.01"
                        value={formData.totalAmount}
                        onChange={(e) => setFormData({...formData, totalAmount: parseFloat(e.target.value)})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="invoiceNumber">Invoice Number</Label>
                      <Input
                        id="invoiceNumber"
                        value={formData.invoiceNumber}
                        onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="orderStatus">Order Status</Label>
                      <Select value={formData.orderStatus} onValueChange={(value) => setFormData({...formData, orderStatus: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentStatus">Payment Status</Label>
                      <Select value={formData.paymentStatus} onValueChange={(value) => setFormData({...formData, paymentStatus: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                          <SelectItem value="refunded">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="invoiceUrl">Invoice URL (Optional)</Label>
                    <Input
                      id="invoiceUrl"
                      value={formData.invoiceUrl}
                      onChange={(e) => setFormData({...formData, invoiceUrl: e.target.value})}
                      placeholder="https://example.com/invoice.pdf"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      Create Order
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                    Total Orders
                  </p>
                  <p className="font-heading text-2xl font-bold text-primary">
                    {orders.length}
                  </p>
                </div>
                <div className="bg-primary/10 p-3 rounded-2xl">
                  <ShoppingCart className="h-6 w-6 text-primary" />
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
                </div>
                <div className="bg-yellow-100 p-3 rounded-2xl">
                  <Package className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-paragraph text-sm text-secondary-foreground mb-1">
                    Avg Order Value
                  </p>
                  <p className="font-heading text-2xl font-bold text-primary">
                    ${averageOrderValue.toFixed(2)}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-2xl">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white border-0 shadow-lg rounded-3xl mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search orders by number, customer, or invoice..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('all')}
                  className={statusFilter === 'all' ? 'bg-primary text-primary-foreground' : 'border-buttonoutline text-buttonoutline hover:bg-buttonoutline hover:text-white'}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'pending' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('pending')}
                  className={statusFilter === 'pending' ? 'bg-primary text-primary-foreground' : 'border-buttonoutline text-buttonoutline hover:bg-buttonoutline hover:text-white'}
                >
                  Pending
                </Button>
                <Button
                  variant={statusFilter === 'completed' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('completed')}
                  className={statusFilter === 'completed' ? 'bg-primary text-primary-foreground' : 'border-buttonoutline text-buttonoutline hover:bg-buttonoutline hover:text-white'}
                >
                  Completed
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <Card className="bg-white border-0 shadow-lg rounded-3xl">
          <CardHeader>
            <CardTitle className="font-heading text-xl font-semibold text-primary">
              Sales Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order._id} className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="font-heading text-lg font-semibold text-primary">
                          {order.orderNumber}
                        </h3>
                        {getStatusBadge(order.orderStatus || 'pending')}
                        {getPaymentBadge(order.paymentStatus || 'pending')}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="font-paragraph text-secondary-foreground">
                            {order.customerName}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="font-paragraph text-secondary-foreground">
                            {order.orderDate ? format(new Date(order.orderDate), 'MMM dd, yyyy') : 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span className="font-paragraph text-secondary-foreground">
                            ${order.totalAmount?.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      
                      {order.invoiceNumber && (
                        <div className="mt-2 flex items-center space-x-2 text-sm">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="font-paragraph text-secondary-foreground">
                            Invoice: {order.invoiceNumber}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsViewDialogOpen(true);
                        }}
                        variant="outline"
                        size="sm"
                        className="border-buttonoutline text-buttonoutline hover:bg-buttonoutline hover:text-white"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {order.invoiceUrl && (
                        <Button
                          onClick={() => window.open(order.invoiceUrl, '_blank')}
                          variant="outline"
                          size="sm"
                          className="border-green-300 text-green-600 hover:bg-green-50"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Invoice
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="font-heading text-xl font-semibold text-primary mb-2">
                  No orders found
                </h3>
                <p className="font-paragraph text-secondary-foreground mb-6">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by creating your first sales order.'
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Button 
                    onClick={() => setIsAddDialogOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Order
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Details Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl font-semibold text-primary">
                Order Details
              </DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-primary mb-4">Order Information</h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="font-paragraph text-sm text-secondary-foreground">Order Number</Label>
                        <p className="font-paragraph text-primary font-medium">{selectedOrder.orderNumber}</p>
                      </div>
                      <div>
                        <Label className="font-paragraph text-sm text-secondary-foreground">Customer</Label>
                        <p className="font-paragraph text-primary font-medium">{selectedOrder.customerName}</p>
                      </div>
                      <div>
                        <Label className="font-paragraph text-sm text-secondary-foreground">Order Date</Label>
                        <p className="font-paragraph text-primary font-medium">
                          {selectedOrder.orderDate ? format(new Date(selectedOrder.orderDate), 'MMM dd, yyyy HH:mm') : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <Label className="font-paragraph text-sm text-secondary-foreground">Total Amount</Label>
                        <p className="font-paragraph text-primary font-medium">${selectedOrder.totalAmount?.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-primary mb-4">Status & Payment</h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="font-paragraph text-sm text-secondary-foreground">Order Status</Label>
                        <div className="mt-1">{getStatusBadge(selectedOrder.orderStatus || 'pending')}</div>
                      </div>
                      <div>
                        <Label className="font-paragraph text-sm text-secondary-foreground">Payment Status</Label>
                        <div className="mt-1">{getPaymentBadge(selectedOrder.paymentStatus || 'pending')}</div>
                      </div>
                      <div>
                        <Label className="font-paragraph text-sm text-secondary-foreground">Invoice Number</Label>
                        <p className="font-paragraph text-primary font-medium">{selectedOrder.invoiceNumber || 'N/A'}</p>
                      </div>
                      {selectedOrder.invoiceUrl && (
                        <div>
                          <Label className="font-paragraph text-sm text-secondary-foreground">Invoice</Label>
                          <Button
                            onClick={() => window.open(selectedOrder.invoiceUrl, '_blank')}
                            variant="outline"
                            size="sm"
                            className="mt-1 border-green-300 text-green-600 hover:bg-green-50"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download Invoice
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}