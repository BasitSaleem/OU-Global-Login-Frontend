import DashboardLayout from '@/components/layout/dashboard-layout';
import { ChevronRight } from 'lucide-react';
import { Icons } from '@/components/utils/icons';
import Link from 'next/link';

function ViewAllProductsPage() {
  const products = [
    {
      id: 'inventory',
      title: 'Owners Inventory',
      description: 'Manage your inventory',
      icon: '/Icons/OI_LOGO.svg',
      backgroundColor: '#F3E8FF',
      status: 'Open',
      available: true,
      href: 'https://ownersinventory.com/'
    },
    {
      id: 'analytics',
      title: 'Owners Analytics',
      description: 'Get insights and analyze your business performance',
      icon: '/Icons/OA_LOGO.svg',
      backgroundColor: '#FFEDD5',
      status: 'Coming Soon',
      available: false
    },
    {
      id: 'marketplace',
      title: 'Owners Marketplace',
      description: 'Buy and sell products',
      icon: '/Icons/OM_LOGO.svg',
      backgroundColor: '#FCE7F3',
      status: 'Coming Soon',
      available: false
    },
    {
      id: 'jungle',
      title: 'Owners Jungle',
      description: 'Explore opportunities',
      icon: '/Icons/OJ_LOGO.svg',
      backgroundColor: '#DBEAFE',
      status: 'Coming Soon',
      available: false
    }
  ];

  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-3">
          <h1 className="text-heading-1 font-bold text">All Products</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-bg-secondary border rounded-xl p-4 hover:shadow-sm transition-shadow cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: product.backgroundColor }}
                >
                  <img
                    src={product.icon}
                    alt={product.title}
                    className="w-6 h-6"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-heading-3 font-medium text-black mb-2">
                    {product.title}
                  </h3>
                  <p className="text-body-small text-gray-600 mb-4">
                    {product.description}
                  </p>

                  {/* Status Link */}
                  <div className="flex items-center gap-1">
                    <span
                      className="text-body-small font-medium"
                      style={{ color: '#795CF5' }}
                    >
                      {product.title === "Owners Inventory" ? <Link href={product.href!}>
                        Open
                      </Link> : "Coming Soon"}
                    </span>
                    <ChevronRight
                      className="w-3 h-3"
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
