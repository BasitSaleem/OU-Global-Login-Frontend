"use client"
import DashboardLayout from '@/components/layout/dashboard-layout';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { IconName, SvgIcon } from '@/components/ui/SvgIcon';
import { getColorFromId } from '@/utils/getRandomColors';
import { useRouter } from 'next/navigation';

function ViewAllProductsPage() {
  const router = useRouter()
  const products = [
    {
      id: '1',
      title: 'Owners Inventory',
      description: 'Manage your inventory',
      icon: 'OI',
      status: 'Open',
      available: true,
      href: 'https://ownersinventory.com/'
    },
    {
      id: '2',
      title: 'Owners Analytics',
      description: 'Get insights and analyze your business performance',
      icon: 'OA',
      status: 'Coming Soon',
      available: false
    },
    {
      id: '3',
      title: 'Owners Marketplace',
      description: 'Buy and sell products',
      icon: 'OM',
      status: 'Coming Soon',
      available: false
    },
    {
      id: '4',
      title: 'Owners Jungle',
      description: 'Explore opportunities',
      icon: 'OJ',
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
            <a
              href={product.href}
              target='_blank'
              key={product.id}
              className={`bg-bg-secondary border rounded-xl p-4 ${product.available ? "hover:shadow-sm transition-shadow" : ""} ${product.available ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: getColorFromId(product.id) }}
                >
                  <SvgIcon name={product.icon as IconName} width={24} height={24} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-heading-3 font-medium text-black mb-2">
                    {product.title}
                  </h3>
                  <p className="text-body-small text-gray-600 mb-4">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-1">
                    <span
                      className="text-body-small font-medium"
                      style={{ color: '#795CF5' }}
                    >
                      {product.title === "Owners Inventory" ? <a href={product.href!} target='_blank'>
                        Open
                      </a> : "Coming Soon"}
                    </span>
                    <ChevronRight
                      className="w-3 h-3"
                      style={{ color: '#795CF5' }}
                    />
                  </div>
                </div>
              </div>
            </a>
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
