import React from 'react';
import { NotificationSection } from '@/components/pages/OrganizationDetails/Notifications/NotificationSection';
import { ShoppingCart, ClipboardCheck, Truck, ChartColumnIncreasing } from 'lucide-react';
import { NotificationSettings } from '@/app/organization-details/[orgId]/notifications/page';
import { OwnerKey } from '@/components/pages/OrganizationDetails/Billing/OwnersProductItem';

interface OwnerNotificationPanelProps {
  owner: OwnerKey;
  settings: NotificationSettings;
  updateNestedSetting: (category: any, type: 'inApp' | 'email', value: boolean) => void;
}

export const OwnerNotificationPanel: React.FC<OwnerNotificationPanelProps> = ({ settings, updateNestedSetting }) => {
  const sections = [
    {
      icon: ShoppingCart,
      title: 'Sale',
      items: [
        { key: 'saleComplete', label: 'When a sale is done', highlighted: true },
        { key: 'saleReturned', label: 'When a sale is returned' },
        { key: 'saleEdited', label: 'When a sale is completely edited', highlighted: true },
        { key: 'saleDeleted', label: 'When a sale is deleted' },
      ],
    },
    {
      icon: ClipboardCheck,
      title: 'Purchase',
      items: [
        { key: 'stockPurchased', label: 'When new stock is purchased', highlighted: true },
        { key: 'stockAddedToInventory', label: 'When purchased stock is added to inventory' },
        { key: 'purchaseDeleted', label: 'When a purchase is deleted', highlighted: true },
      ],
    },
    {
      icon: Truck,
      title: 'Transfer Stock',
      items: [
        { key: 'stockIssued', label: 'When stock is issued', highlighted: true },
        { key: 'stockTransferCompleted', label: 'When stock transfer is completed' },
      ],
    },
    {
      icon: ChartColumnIncreasing,
      title: 'Production',
      items: [
        { key: 'productionStarted', label: 'When production is started', highlighted: true },
        { key: 'productionCompleted', label: 'When production is completed' },
        { key: 'productionCancelled', label: 'When production is cancelled', highlighted: true },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      {sections.map(section => (
        <NotificationSection
          key={section.title}
          icon={section.icon}
          title={section.title}
          items={section.items}
          settings={settings}
          updateNestedSetting={updateNestedSetting}
        />
      ))}
    </div>
  );
};
