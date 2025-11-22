import { useMember } from '@/integrations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { BarChart3, TrendingUp, Package, AlertTriangle, Users, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const { member, isAuthenticated, actions } = useMember();

  return (
    <div className="min-h-screen bg-secondary">
      {/* Hero Section - Full Bleed with Inspiration Layout */}
      <section className="relative w-full max-w-[120rem] mx-auto min-h-screen flex items-center overflow-hidden">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gradientlightblue via-gradientmediumblue to-primary opacity-20">
          <div className="absolute right-0 top-0 w-1/2 h-full">
            <div className="absolute inset-0 bg-gradient-to-l from-primary/30 to-transparent">
              {/* Flowing Lines Pattern */}
              <div className="absolute right-0 top-1/4 w-full h-1/2">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute bg-primary/10 rounded-full"
                    style={{
                      width: `${2 + i * 0.5}px`,
                      height: `${100 + i * 20}px`,
                      right: `${i * 15}px`,
                      top: `${i * 10}px`,
                      transform: `rotate(${15 + i * 2}deg)`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Left Aligned */}
        <div className="relative z-10 w-full px-8 lg:px-16">
          <div className="max-w-2xl">
            <h1 className="font-heading text-6xl lg:text-7xl font-bold text-primary mb-6 leading-tight">
              Smart Inventory
              <br />
              <span className="text-gradientmediumblue">Management</span>
            </h1>
            <p className="font-paragraph text-xl text-secondary-foreground mb-8 leading-relaxed max-w-lg">
              AI-powered inventory tracking and demand forecasting for modern businesses. 
              Optimize stock levels, predict trends, and boost profitability.
            </p>
            
            {isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/dashboard">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg">
                    Go to Dashboard
                  </Button>
                </Link>
                <Link to="/inventory">
                  <Button variant="outline" size="lg" className="border-buttonoutline text-buttonoutline hover:bg-buttonoutline hover:text-white px-8 py-4 text-lg">
                    Manage Inventory
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={actions.login}
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg"
                >
                  Get Started
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-buttonoutline text-buttonoutline hover:bg-buttonoutline hover:text-white px-8 py-4 text-lg"
                >
                  Learn More
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Vertical Brand Text - Right Side */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 transform -rotate-90 origin-center">
          <span className="font-heading text-4xl font-light text-primary/60 tracking-widest">
            SMART.INVENTORY
          </span>
        </div>
      </section>

      {/* Features Section - Different Layout Structure */}
      <section className="py-24 px-8 lg:px-16 max-w-[100rem] mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold text-primary mb-6">
            Powerful Features for Modern Business
          </h2>
          <p className="font-paragraph text-lg text-secondary-foreground max-w-3xl mx-auto">
            Comprehensive inventory management with AI-driven insights to help you make smarter business decisions.
          </p>
        </div>

        {/* Asymmetrical Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Large Feature Card */}
          <Card className="lg:col-span-2 bg-white border-0 shadow-lg rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="bg-primary/10 p-4 rounded-2xl">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-2xl font-semibold text-primary mb-4">
                    AI Demand Forecasting
                  </h3>
                  <p className="font-paragraph text-secondary-foreground mb-6 leading-relaxed">
                    Advanced machine learning algorithms analyze historical data, seasonal trends, and market patterns 
                    to predict future demand with remarkable accuracy. Make informed purchasing decisions and optimize 
                    inventory levels automatically.
                  </p>
                  <div className="bg-gradientlightblue rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-paragraph text-sm text-secondary-foreground">Forecast Accuracy</span>
                      <span className="font-heading text-lg font-semibold text-primary">94.2%</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '94.2%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Smaller Feature Card */}
          <Card className="bg-white border-0 shadow-lg rounded-3xl">
            <CardContent className="p-8 text-center">
              <div className="bg-primary/10 p-4 rounded-2xl w-fit mx-auto mb-6">
                <AlertTriangle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-primary mb-4">
                Smart Alerts
              </h3>
              <p className="font-paragraph text-secondary-foreground">
                Real-time notifications for low stock, reorder points, and demand spikes.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Three Column Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-white border-0 shadow-lg rounded-3xl">
            <CardContent className="p-8 text-center">
              <div className="bg-primary/10 p-4 rounded-2xl w-fit mx-auto mb-6">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-primary mb-4">
                Inventory Tracking
              </h3>
              <p className="font-paragraph text-secondary-foreground">
                Real-time stock monitoring with automated updates and multi-location support.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg rounded-3xl">
            <CardContent className="p-8 text-center">
              <div className="bg-primary/10 p-4 rounded-2xl w-fit mx-auto mb-6">
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-primary mb-4">
                Sales Management
              </h3>
              <p className="font-paragraph text-secondary-foreground">
                Complete order processing, invoice generation, and payment tracking.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg rounded-3xl">
            <CardContent className="p-8 text-center">
              <div className="bg-primary/10 p-4 rounded-2xl w-fit mx-auto mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-primary mb-4">
                Role Management
              </h3>
              <p className="font-paragraph text-secondary-foreground">
                Secure user authentication with admin, manager, and staff permissions.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section - Right Aligned Layout */}
      <section className="py-24 px-8 lg:px-16 bg-gradientlightblue">
        <div className="max-w-[100rem] mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2">
              <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8">
                <TrendingUp className="h-16 w-16 text-primary mb-6" />
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-paragraph text-secondary-foreground">Revenue Growth</span>
                    <span className="font-heading text-2xl font-bold text-primary">+32%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-paragraph text-secondary-foreground">Cost Reduction</span>
                    <span className="font-heading text-2xl font-bold text-primary">-18%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-paragraph text-secondary-foreground">Efficiency Gain</span>
                    <span className="font-heading text-2xl font-bold text-primary">+45%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 text-right">
              <h2 className="font-heading text-4xl font-bold text-primary mb-6">
                Ready to Transform Your Business?
              </h2>
              <p className="font-paragraph text-lg text-secondary-foreground mb-8 max-w-lg ml-auto">
                Join thousands of businesses already using our smart inventory system to optimize 
                operations and increase profitability.
              </p>
              
              {!isAuthenticated && (
                <Button 
                  onClick={actions.login}
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg"
                >
                  Start Free Trial
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}