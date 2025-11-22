import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { BaseCrudService } from '@/integrations';
import { Products } from '@/entities';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  AlertTriangle,
  Filter,
  Download,
  Upload
} from 'lucide-react';
import { Image } from '@/components/ui/image';

interface ProductFormData {
  productName: string;
  sku: string;
  description: string;
  price: number;
  currentStock: number;
  lowStockThreshold: number;
  productImage: string;
  isActive: boolean;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Products[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Products[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'lowstock'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Products | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    productName: '',
    sku: '',
    description: '',
    price: 0,
    currentStock: 0,
    lowStockThreshold: 10,
    productImage: '',
    isActive: true
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, filterStatus]);

  const fetchProducts = async () => {
    try {
      const { items } = await BaseCrudService.getAll<Products>('products');
      setProducts(items);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    switch (filterStatus) {
      case 'active':
        filtered = filtered.filter(product => product.isActive);
        break;
      case 'inactive':
        filtered = filtered.filter(product => !product.isActive);
        break;
      case 'lowstock':
        filtered = filtered.filter(product => 
          product.currentStock !== undefined && 
          product.lowStockThreshold !== undefined && 
          product.currentStock <= product.lowStockThreshold
        );
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        await BaseCrudService.update<Products>('products', {
          _id: editingProduct._id,
          ...formData
        });
      } else {
        await BaseCrudService.create('products', {
          _id: crypto.randomUUID(),
          ...formData
        } as any);
      }
      
      await fetchProducts();
      resetForm();
      setIsAddDialogOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product: Products) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName || '',
      sku: product.sku || '',
      description: product.description || '',
      price: product.price || 0,
      currentStock: product.currentStock || 0,
      lowStockThreshold: product.lowStockThreshold || 10,
      productImage: product.productImage || '',
      isActive: product.isActive ?? true
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await BaseCrudService.delete('products', productId);
        await fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      productName: '',
      sku: '',
      description: '',
      price: 0,
      currentStock: 0,
      lowStockThreshold: 10,
      productImage: '',
      isActive: true
    });
  };

  const getStockStatus = (product: Products) => {
    if (!product.currentStock || !product.lowStockThreshold) return 'unknown';
    if (product.currentStock <= product.lowStockThreshold) return 'low';
    if (product.currentStock <= product.lowStockThreshold * 2) return 'medium';
    return 'high';
  };

  const getStockBadge = (product: Products) => {
    const status = getStockStatus(product);
    switch (status) {
      case 'low':
        return <Badge variant="destructive">Low Stock</Badge>;
      case 'medium':
        return <Badge className="bg-orange-100 text-orange-800">Medium Stock</Badge>;
      case 'high':
        return <Badge className="bg-green-100 text-green-800">In Stock</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="font-paragraph text-secondary-foreground">Loading inventory...</p>
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
              Inventory Management
            </h1>
            <p className="font-paragraph text-secondary-foreground">
              Manage your products and track stock levels
            </p>
          </div>
          
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Button variant="outline" className="border-buttonoutline text-buttonoutline hover:bg-buttonoutline hover:text-white">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" className="border-buttonoutline text-buttonoutline hover:bg-buttonoutline hover:text-white">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => {
                    resetForm();
                    setEditingProduct(null);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="font-heading text-xl font-semibold text-primary">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="productName">Product Name</Label>
                      <Input
                        id="productName"
                        value={formData.productName}
                        onChange={(e) => setFormData({...formData, productName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => setFormData({...formData, sku: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentStock">Current Stock</Label>
                      <Input
                        id="currentStock"
                        type="number"
                        value={formData.currentStock}
                        onChange={(e) => setFormData({...formData, currentStock: parseInt(e.target.value)})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                      <Input
                        id="lowStockThreshold"
                        type="number"
                        value={formData.lowStockThreshold}
                        onChange={(e) => setFormData({...formData, lowStockThreshold: parseInt(e.target.value)})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="productImage">Product Image URL</Label>
                    <Input
                      id="productImage"
                      value={formData.productImage}
                      onChange={(e) => setFormData({...formData, productImage: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                    />
                    <Label htmlFor="isActive">Active Product</Label>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        setEditingProduct(null);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white border-0 shadow-lg rounded-3xl mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('all')}
                  className={filterStatus === 'all' ? 'bg-primary text-primary-foreground' : 'border-buttonoutline text-buttonoutline hover:bg-buttonoutline hover:text-white'}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === 'active' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('active')}
                  className={filterStatus === 'active' ? 'bg-primary text-primary-foreground' : 'border-buttonoutline text-buttonoutline hover:bg-buttonoutline hover:text-white'}
                >
                  Active
                </Button>
                <Button
                  variant={filterStatus === 'lowstock' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('lowstock')}
                  className={filterStatus === 'lowstock' ? 'bg-primary text-primary-foreground' : 'border-buttonoutline text-buttonoutline hover:bg-buttonoutline hover:text-white'}
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Low Stock
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product._id} className="bg-white border-0 shadow-lg rounded-3xl overflow-hidden">
              <div className="aspect-square bg-gray-100 relative">
                {product.productImage ? (
                  <Image
                    src={product.productImage}
                    alt={product.productName || 'Product'}
                    className="w-full h-full object-cover"
                    width={300}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  {getStockBadge(product)}
                </div>
                {!product.isActive && (
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary">Inactive</Badge>
                  </div>
                )}
              </div>
              
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="font-heading text-lg font-semibold text-primary mb-1">
                    {product.productName}
                  </h3>
                  <p className="font-paragraph text-sm text-secondary-foreground">
                    SKU: {product.sku}
                  </p>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="font-paragraph text-sm text-secondary-foreground">Price:</span>
                    <span className="font-paragraph text-sm font-medium text-primary">
                      ${product.price?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-paragraph text-sm text-secondary-foreground">Stock:</span>
                    <span className="font-paragraph text-sm font-medium text-primary">
                      {product.currentStock} units
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-paragraph text-sm text-secondary-foreground">Threshold:</span>
                    <span className="font-paragraph text-sm font-medium text-primary">
                      {product.lowStockThreshold} units
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleEdit(product)}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-buttonoutline text-buttonoutline hover:bg-buttonoutline hover:text-white"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(product._id)}
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <Card className="bg-white border-0 shadow-lg rounded-3xl">
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold text-primary mb-2">
                No products found
              </h3>
              <p className="font-paragraph text-secondary-foreground mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding your first product to the inventory.'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Button 
                  onClick={() => setIsAddDialogOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}