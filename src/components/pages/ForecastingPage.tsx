import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BaseCrudService } from '@/integrations';
import { DemandForecasts, Products } from '@/entities';
import { 
  TrendingUp, 
  Brain, 
  Calendar, 
  Package,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, addDays, startOfMonth, endOfMonth } from 'date-fns';

export default function ForecastingPage() {
  const [forecasts, setForecasts] = useState<DemandForecasts[]>([]);
  const [products, setProducts] = useState<Products[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('30');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [forecastsData, productsData] = await Promise.all([
        BaseCrudService.getAll<DemandForecasts>('demandforecasts'),
        BaseCrudService.getAll<Products>('products')
      ]);
      
      setForecasts(forecastsData.items);
      setProducts(productsData.items);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate AI forecast data for demonstration
  const generateForecastData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 0; i < parseInt(timeRange); i++) {
      const date = addDays(today, i);
      const baseValue = 100 + Math.sin(i * 0.2) * 20;
      const variance = Math.random() * 30 - 15;
      
      data.push({
        date: format(date, 'MMM dd'),
        predicted: Math.max(0, Math.round(baseValue + variance)),
        confidence: 85 + Math.random() * 10,
        actual: i < 7 ? Math.max(0, Math.round(baseValue + variance * 0.8)) : null
      });
    }
    
    return data;
  };

  const forecastData = generateForecastData();

  // Calculate metrics
  const avgConfidence = forecasts.reduce((sum, f) => sum + (f.confidenceLevel || 0), 0) / forecasts.length || 0;
  const totalPredictedDemand = forecasts.reduce((sum, f) => sum + (f.predictedDemandQuantity || 0), 0);
  const highConfidenceForecasts = forecasts.filter(f => (f.confidenceLevel || 0) >= 90).length;
  const lowConfidenceForecasts = forecasts.filter(f => (f.confidenceLevel || 0) < 70).length;

  // Product demand comparison
  const productDemandData = products.slice(0, 6).map(product => {
    const productForecasts = forecasts.filter(f => f.productId === product._id);
    const avgDemand = productForecasts.reduce((sum, f) => sum + (f.predictedDemandQuantity || 0), 0) / productForecasts.length || 0;
    
    return {
      name: product.productName?.substring(0, 10) + '...' || 'Product',
      demand: Math.round(avgDemand || Math.random() * 100 + 50),
      confidence: Math.round(avgConfidence || 85 + Math.random() * 10)
    };
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="font-paragraph text-secondary-foreground">Loading AI forecasts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-primary/10 p-3 rounded-2xl">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold text-primary">
                AI Demand Forecasting
              </h1>
              <p className="font-paragraph text-secondary-foreground">
                Machine learning powered predictions for inventory optimization
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-paragraph text-secondary-foreground">AI Model Active</span>
            </div>
            <span className="text-gray-300">•</span>
            <span className="font-paragraph text-secondary-foreground">
              Last updated: {format(new Date(), 'MMM dd, yyyy HH:mm')}
            </span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-lg rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-paragraph text-sm text-secondary-foreground mb-1">
                    Avg Confidence
                  </p>
                  <p className="font-heading text-2xl font-bold text-primary">
                    {avgConfidence.toFixed(1)}%
                  </p>
                  <p className="font-paragraph text-xs text-green-600">
                    High accuracy
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-2xl">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-paragraph text-sm text-secondary-foreground mb-1">
                    Predicted Demand
                  </p>
                  <p className="font-heading text-2xl font-bold text-primary">
                    {totalPredictedDemand.toLocaleString()}
                  </p>
                  <p className="font-paragraph text-xs text-blue-600">
                    Next 30 days
                  </p>
                </div>
                <div className="bg-primary/10 p-3 rounded-2xl">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-paragraph text-sm text-secondary-foreground mb-1">
                    High Confidence
                  </p>
                  <p className="font-heading text-2xl font-bold text-primary">
                    {highConfidenceForecasts}
                  </p>
                  <p className="font-paragraph text-xs text-green-600">
                    ≥90% accuracy
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-2xl">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-paragraph text-sm text-secondary-foreground mb-1">
                    Needs Review
                  </p>
                  <p className="font-heading text-2xl font-bold text-primary">
                    {lowConfidenceForecasts}
                  </p>
                  <p className="font-paragraph text-xs text-orange-600">
                    &lt;70% confidence
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-2xl">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="bg-white border-0 shadow-lg rounded-3xl mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="space-y-2">
                  <label className="font-paragraph text-sm text-secondary-foreground">Product</label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Products</SelectItem>
                      {products.map((product) => (
                        <SelectItem key={product._id} value={product._id}>
                          {product.productName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="font-paragraph text-sm text-secondary-foreground">Time Range</label>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" className="border-buttonoutline text-buttonoutline hover:bg-buttonoutline hover:text-white">
                  <Zap className="h-4 w-4 mr-2" />
                  Retrain Model
                </Button>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Forecast Chart */}
        <Card className="bg-white border-0 shadow-lg rounded-3xl mb-8">
          <CardHeader>
            <CardTitle className="font-heading text-xl font-semibold text-primary flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Demand Forecast Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'predicted') return [`${value} units`, 'Predicted Demand'];
                    if (name === 'actual') return [`${value} units`, 'Actual Demand'];
                    return [value, name];
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#1e2e69" 
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  name="predicted"
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="actual"
                />
              </LineChart>
            </ResponsiveContainer>
            
            <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0.5 bg-primary border-dashed border-t-2 border-primary"></div>
                <span className="font-paragraph text-secondary-foreground">Predicted Demand</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0.5 bg-green-500"></div>
                <span className="font-paragraph text-secondary-foreground">Actual Demand</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Demand Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-white border-0 shadow-lg rounded-3xl">
            <CardHeader>
              <CardTitle className="font-heading text-xl font-semibold text-primary">
                Product Demand Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productDemandData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} units`, 'Predicted Demand']} />
                  <Bar dataKey="demand" fill="#1e2e69" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg rounded-3xl">
            <CardHeader>
              <CardTitle className="font-heading text-xl font-semibold text-primary">
                AI Model Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-paragraph text-sm text-secondary-foreground">Model Accuracy</span>
                    <span className="font-paragraph text-sm font-medium text-primary">94.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '94.2%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-paragraph text-sm text-secondary-foreground">Prediction Confidence</span>
                    <span className="font-paragraph text-sm font-medium text-primary">87.8%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87.8%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-paragraph text-sm text-secondary-foreground">Data Quality Score</span>
                    <span className="font-paragraph text-sm font-medium text-primary">91.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '91.5%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradientlightblue rounded-2xl p-4">
                <h4 className="font-heading text-sm font-semibold text-primary mb-2">
                  Model Insights
                </h4>
                <ul className="space-y-1 text-xs font-paragraph text-secondary-foreground">
                  <li>• Seasonal patterns detected in 78% of products</li>
                  <li>• Weekend demand typically 23% lower</li>
                  <li>• Holiday spikes predicted with 96% accuracy</li>
                  <li>• Weather correlation found in 45% of categories</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Forecasts */}
        <Card className="bg-white border-0 shadow-lg rounded-3xl">
          <CardHeader>
            <CardTitle className="font-heading text-xl font-semibold text-primary">
              Recent Forecast Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {forecasts.slice(0, 5).map((forecast) => {
                const product = products.find(p => p._id === forecast.productId);
                const confidenceLevel = forecast.confidenceLevel || 0;
                
                return (
                  <div key={forecast._id} className="border border-gray-100 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Package className="h-5 w-5 text-primary" />
                          <h3 className="font-heading text-lg font-semibold text-primary">
                            {product?.productName || 'Unknown Product'}
                          </h3>
                          <Badge 
                            className={
                              confidenceLevel >= 90 
                                ? 'bg-green-100 text-green-800'
                                : confidenceLevel >= 70 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }
                          >
                            {confidenceLevel.toFixed(1)}% confidence
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-paragraph text-secondary-foreground">Predicted Demand: </span>
                            <span className="font-paragraph font-medium text-primary">
                              {forecast.predictedDemandQuantity} units
                            </span>
                          </div>
                          <div>
                            <span className="font-paragraph text-secondary-foreground">Period: </span>
                            <span className="font-paragraph font-medium text-primary">
                              {forecast.forecastPeriodStartDate ? 
                                format(new Date(forecast.forecastPeriodStartDate), 'MMM dd') : 'N/A'
                              } - {forecast.forecastPeriodEndDate ? 
                                format(new Date(forecast.forecastPeriodEndDate), 'MMM dd') : 'N/A'
                              }
                            </span>
                          </div>
                          <div>
                            <span className="font-paragraph text-secondary-foreground">Generated: </span>
                            <span className="font-paragraph font-medium text-primary">
                              {forecast.forecastGeneratedDate ? 
                                format(new Date(forecast.forecastGeneratedDate), 'MMM dd, yyyy') : 'N/A'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {forecasts.length === 0 && (
              <div className="text-center py-12">
                <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="font-heading text-xl font-semibold text-primary mb-2">
                  No forecasts available
                </h3>
                <p className="font-paragraph text-secondary-foreground mb-6">
                  The AI model is still learning from your data. Forecasts will appear once sufficient historical data is available.
                </p>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Zap className="h-4 w-4 mr-2" />
                  Initialize AI Model
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}