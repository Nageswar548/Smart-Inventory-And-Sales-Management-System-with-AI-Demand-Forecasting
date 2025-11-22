import { useMember } from '@/integrations';
import { Outlet, Link } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Bell, 
  User, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const { member, isAuthenticated, isLoading, actions } = useMember();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { to: '/inventory', label: 'Inventory', icon: Package },
    { to: '/sales', label: 'Sales', icon: ShoppingCart },
    { to: '/forecasting', label: 'Forecasting', icon: TrendingUp },
    { to: '/notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary p-2 rounded-lg">
                <Package className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-heading text-xl font-bold text-primary">
                SmartInventory
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {isAuthenticated && navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center space-x-2 text-secondary-foreground hover:text-primary transition-colors"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="font-paragraph">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {isLoading && <LoadingSpinner />}
              
              {!isAuthenticated && !isLoading && (
                <Button 
                  onClick={actions.login}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Sign In
                </Button>
              )}
              
              {isAuthenticated && (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-secondary-foreground hover:text-primary transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden sm:inline font-paragraph">
                      {member?.profile?.nickname || member?.contact?.firstName || 'Profile'}
                    </span>
                  </Link>
                  
                  <Button
                    onClick={actions.logout}
                    variant="outline"
                    className="border-buttonoutline text-buttonoutline hover:bg-buttonoutline hover:text-white"
                  >
                    Sign Out
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-secondary-foreground hover:text-primary"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && isAuthenticated && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-2 space-y-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2 text-secondary-foreground hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <IconComponent className="h-5 w-5" />
                    <span className="font-paragraph">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 mt-24">
        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-primary-foreground p-2 rounded-lg">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <span className="font-heading text-xl font-bold">
                  SmartInventory
                </span>
              </div>
              <p className="font-paragraph text-primary-foreground/80 max-w-md">
                AI-powered inventory management system designed for modern businesses. 
                Optimize your operations with intelligent forecasting and real-time analytics.
              </p>
            </div>
            
            <div>
              <h3 className="font-heading text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2 font-paragraph text-primary-foreground/80">
                <li>Inventory Tracking</li>
                <li>AI Forecasting</li>
                <li>Sales Management</li>
                <li>Analytics Dashboard</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-heading text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 font-paragraph text-primary-foreground/80">
                <li>Documentation</li>
                <li>Help Center</li>
                <li>Contact Support</li>
                <li>System Status</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
            <p className="font-paragraph text-primary-foreground/60">
              © 2024 SmartInventory. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}