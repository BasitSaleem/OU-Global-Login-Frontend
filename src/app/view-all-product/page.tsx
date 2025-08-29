import DashboardLayout from '@/components/layout/dashboard-layout';
import { ChevronRight } from 'lucide-react';
import { Icons } from '@/components/utils/icons';

function ViewAllProductsPage() {
  const products = [
    {
      id: 'inventory',
      title: 'Owners Inventory',
      description: 'Manage your inventory',
      icon: Icons.ownerinventory,
      backgroundColor: '#F3E8FF',
      status: 'Open',
      available: true
    },
    {
      id: 'analytics',
      title: 'Owners Analytics',
      description: 'Get insights and analyze your business performance',
      icon: Icons.owneranalytics,
      backgroundColor: '#FFEDD5',
      status: 'Coming Soon',
      available: false
    },
    {
      id: 'marketplace',
      title: 'Owners Marketplace',
      description: 'Buy and sell products',
      icon: Icons.ownermarketplace,
      backgroundColor: '#FCE7F3',
      status: 'Coming Soon',
      available: false
    },
    {
      id: 'jungle',
      title: 'Owners Jungle',
      description: 'Explore opportunities',
      icon: Icons.ownerjungle,
      backgroundColor: '#DBEAFE',
      status: 'Coming Soon',
      available: false
    }
  ];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-black">All Products</h1>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow cursor-pointer"
            >
              <div className="flex items-start gap-6">
                {/* Product Icon */}
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: product.backgroundColor }}
                >
                  <img
                    src={product.icon}
                    alt={product.title}
                    className="w-8 h-8"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-medium text-black mb-2">
                    {product.title}
                  </h3>
                  <p className="text-base text-gray-600 mb-4">
                    {product.description}
                  </p>
                  
                  {/* Status Link */}
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-base font-medium"
                      style={{ color: '#795CF5' }}
                    >
                      {product.status}
                    </span>
                    <ChevronRight 
                      className="w-4 h-4" 
                      style={{ color: '#795CF5' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <DashboardLayout>
      <ViewAllProductsPage />
    </DashboardLayout>
  );
}
