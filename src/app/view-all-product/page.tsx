import DashboardLayout from '@/components/layout/dashboard-layout';
import { ChevronRight } from 'lucide-react';

function ViewAllProductsPage() {
  const products = [
    {
      id: 'inventory',
      title: 'Owners Inventory',
      description: 'Manage your inventory',
      icon: 'https://api.builder.io/api/v1/image/assets/TEMP/bd02cebc5191f0339598b5d27af1d558a1f60fdc?width=66',
      backgroundColor: '#F3E8FF',
      status: 'Open',
      available: true
    },
    {
      id: 'analytics',
      title: 'Owners Analytics',
      description: 'Get insights and analyze your business performance',
      icon: 'https://api.builder.io/api/v1/image/assets/TEMP/be8931ee53da43e803d3d1a1fddbcc1f9187aaa2?width=64',
      backgroundColor: '#FFEDD5',
      status: 'Coming Soon',
      available: false
    },
    {
      id: 'marketplace',
      title: 'Owners Marketplace',
      description: 'Buy and sell products',
      icon: 'https://api.builder.io/api/v1/image/assets/TEMP/df8a47bf275bccdb600fe4495f3d4bead9cb844f?width=64',
      backgroundColor: '#FCE7F3',
      status: 'Coming Soon',
      available: false
    },
    {
      id: 'jungle',
      title: 'Owners Jungle',
      description: 'Explore opportunities',
      icon: 'https://api.builder.io/api/v1/image/assets/TEMP/78407e1c15d2b695844d30eed5f5358ca8da09f8?width=64',
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
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow"
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
