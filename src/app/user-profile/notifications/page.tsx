'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Icons } from '@/components/utils/icons';

// Types
type NotificationSettings = {
  inAppNotifications: boolean;
  emailNotifications: boolean;

  saleComplete: { inApp: boolean; email: boolean };
  saleReturned: { inApp: boolean; email: boolean };
  saleEdited: { inApp: boolean; email: boolean };
  saleDeleted: { inApp: boolean; email: boolean };

  stockPurchased: { inApp: boolean; email: boolean };
  stockAddedToInventory: { inApp: boolean; email: boolean };
  purchaseDeleted: { inApp: boolean; email: boolean };

  stockIssued: { inApp: boolean; email: boolean };
  stockTransferCompleted: { inApp: boolean; email: boolean };

  productionStarted: { inApp: boolean; email: boolean };
  productionCompleted: { inApp: boolean; email: boolean };
  productionCancelled: { inApp: boolean; email: boolean };
};

type OwnerKey = 'inventory' | 'jungle' | 'marketplace' | 'analytics';

// reusable section component
function NotificationSection({
  icon: Icon,
  title,
  items,
  settings,
  updateNestedSetting
}: {
  icon: string;
  title: string;
  items: { key: keyof NotificationSettings; label: string; highlighted?: boolean }[];
  settings: NotificationSettings;
  updateNestedSetting: (category: keyof NotificationSettings, type: 'inApp' | 'email', value: boolean) => void;
}) {
  return (
    <div className="bg-white border border-gray-300 rounded p-4">
      <div className="flex items-center gap-2 mb-3">
        <Image src={Icon} alt={title} width={20} height={20} className="w-6 h-6" />
        <h3 className="text-body-medium-bold font-medium text-black pb-2">{title}</h3>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.key as string}
            className={`flex items-center justify-between px-2 py-1.5 rounded ${item.highlighted ? 'bg-[rgba(121,92,245,0.07)]' : ''
              }`}
          >
            {/* Label text */}
            <span className="flex-1 text-body-small text-black">{item.label}</span>

            {/* Checkboxes */}
            <div className="flex items-center gap-3 shrink-0">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(settings[item.key] as any).inApp}
                  onChange={(e) => updateNestedSetting(item.key, 'inApp', e.target.checked)}
                  className="w-3 h-3 rounded border-gray-300 cursor-pointer"
                />
                <span className="text-body-tiny text-black">In App</span>
              </label>

              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(settings[item.key] as any).email}
                  onChange={(e) => updateNestedSetting(item.key, 'email', e.target.checked)}
                  className="w-3 h-3 rounded border-gray-300 cursor-pointer"
                />
                <span className="text-body-tiny text-black">Email</span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// helper for default settings
const defaultSettings: NotificationSettings = {
  inAppNotifications: false,
  emailNotifications: false,

  saleComplete: { inApp: false, email: false },
  saleReturned: { inApp: false, email: false },
  saleEdited: { inApp: false, email: false },
  saleDeleted: { inApp: false, email: false },

  stockPurchased: { inApp: false, email: false },
  stockAddedToInventory: { inApp: false, email: false },
  purchaseDeleted: { inApp: false, email: false },

  stockIssued: { inApp: false, email: false },
  stockTransferCompleted: { inApp: false, email: false },

  productionStarted: { inApp: false, email: false },
  productionCompleted: { inApp: false, email: false },
  productionCancelled: { inApp: false, email: false }
};

export default function NotificationPreferencesPage() {
  // Store settings per owner
  const [notificationSettings, setNotificationSettings] = useState<Record<OwnerKey, NotificationSettings>>({
    inventory: { ...defaultSettings },
    jungle: { ...defaultSettings },
    marketplace: { ...defaultSettings },
    analytics: { ...defaultSettings }
  });

  // Which owner is active
  const [selectedOwner, setSelectedOwner] = useState<OwnerKey>('inventory');

  // update methods (scoped to selectedOwner)
  const updateNotificationSetting = (setting: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [selectedOwner]: {
        ...prev[selectedOwner],
        [setting]: value as any
      }
    }));
  };

  const updateNestedSetting = (category: keyof NotificationSettings, type: 'inApp' | 'email', value: boolean) => {
    setNotificationSettings((prev) => {
      const current = prev[selectedOwner][category] as { inApp: boolean; email: boolean };
      return {
        ...prev,
        [selectedOwner]: {
          ...prev[selectedOwner],
          [category]: {
            ...current,
            [type]: value
          }
        }
      };
    });
  };

  // config objects
  type Section = {
    icon: any;
    title: string;
    items: { key: keyof NotificationSettings; label: string; highlighted?: boolean }[];
  };

  const sections: Section[] = [
    {
      icon: Icons.sales,
      title: 'Sale',
      items: [
        { key: 'saleComplete', label: 'When a sale is done', highlighted: true },
        { key: 'saleReturned', label: 'When a sale is returned' },
        { key: 'saleEdited', label: 'When a sale is completely edited', highlighted: true },
        { key: 'saleDeleted', label: 'When a sale is deleted' }
      ]
    },
    {
      icon: Icons.purchase,
      title: 'Purchase',
      items: [
        { key: 'stockPurchased', label: 'When new stock is purchased', highlighted: true },
        { key: 'stockAddedToInventory', label: 'When purchased stock is added to inventory' },
        { key: 'purchaseDeleted', label: 'When a purchase is deleted', highlighted: true }
      ]
    },
    {
      icon: Icons.transferStock,
      title: 'Transfer Stock',
      items: [
        { key: 'stockIssued', label: 'When stock is issued', highlighted: true },
        { key: 'stockTransferCompleted', label: 'When stock transfer is completed' }
      ]
    },
    {
      icon: Icons.production,
      title: 'Production',
      items: [
        { key: 'productionStarted', label: 'When production is started', highlighted: true },
        { key: 'productionCompleted', label: 'When production is completed' },
        { key: 'productionCancelled', label: 'When production is cancelled', highlighted: true }
      ]
    }
  ];

  return (
    <main className="p-3 ">
      <div className="max-w-7xl">
        {/* Header Section */}
        <div className="mb-3 gap-2">
          <div>
            <h1 className="text-heading-1 font-bold text-black mb-1">
              Notification Preferences
            </h1>
            <p className="text-body-small text-gray-500">
              Manage how you want to be notified about important updates
            </p>
          </div>

          {/* Owner Switcher */}
          <div className="flex justify-center mt-3">
            <div className="flex items-center gap-2">
              {/* Inventory */}
              <div className="relative group cursor-pointer" onClick={() => setSelectedOwner('inventory')}>
                <Image src={Icons.owneranalytics} alt="owner analytics" width={16} height={16} className={`w-8 h-8 rounded p-1 transition border ${selectedOwner === 'inventory' ? 'border-[#795CF5] bg-[#795CF512]' : 'border-transparent'
                  }`} />

                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-white border border-[#E5E7EB] text-black text-body-tiny font-medium rounded px-2 py-0.5 whitespace-nowrap z-10 shadow-sm">
                  Owners Inventory
                </div>
              </div>

              {/* Jungle */}
              <div className="relative group cursor-pointer" onClick={() => setSelectedOwner('jungle')}>
                <Image src={Icons.ownerjungle} alt="owner jungle" width={20} height={20} className={`w-8 h-8 rounded p-1 transition border ${selectedOwner === 'jungle' ? 'border-[#795CF5] bg-[#795CF512]' : 'border-transparent'
                  }`} />
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-white border border-[#E5E7EB] text-black text-body-tiny font-medium rounded px-2 py-0.5 whitespace-nowrap z-10 shadow-sm">
                  Owners Jungle
                </div>
              </div>

              {/* Marketplace */}
              <div className="relative group cursor-pointer" onClick={() => setSelectedOwner('marketplace')}>
                <Image src={Icons.ownermarketplace} alt="owner marketplace" width={16} height={16} className={`w-8 h-8 rounded p-1 transition border ${selectedOwner === 'marketplace' ? 'border-[#795CF5] bg-[#795CF512]' : 'border-transparent'
                  }`} />
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-white border border-[#E5E7EB] text-black text-body-tiny font-medium rounded px-2 py-0.5 whitespace-nowrap z-10 shadow-sm">
                  Owner Marketplace
                </div>
              </div>

              {/* Analytics */}
              <div className="relative group cursor-pointer" onClick={() => setSelectedOwner('analytics')}>
                <Image src={Icons.owneranalytics} alt="owner analytics" width={16} height={16} className={`w-8 h-8 rounded p-1 transition border ${selectedOwner === 'analytics' ? 'border-[#795CF5] bg-[#795CF512]' : 'border-transparent'
                  }`} />
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-white border border-[#E5E7EB] text-black text-body-tiny font-medium rounded px-2 py-0.5 whitespace-nowrap z-10 shadow-sm">
                  Analytics
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Methods */}
        <div className="bg-white border border-gray-300 rounded p-5 mb-5">
          <h2 className="text-body-medium-bold font-medium text-black mb-2">
            Notification Methods
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* In-App Notifications */}
            <div className="flex items-center gap-2 p-3 border border-gray-300 rounded">
              <Image src={Icons.notificationblue} height={20} width={20} alt="Bell Icon" />
              <span className="text-body-small text-black">In-App Notifications</span>
              <div className="ml-auto">
                <input
                  type="checkbox"
                  checked={notificationSettings[selectedOwner].inAppNotifications}
                  onChange={(e) => updateNotificationSetting('inAppNotifications', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                />
              </div>
            </div>

            {/* Email Notifications */}
            <div className="flex items-center gap-2 p-3 border border-gray-300 rounded">
              <Image src={Icons.emailblue} height={20} width={20} alt="Email Icon" />
              <span className="text-body-small text-black">Email Notifications</span>
              <div className="ml-auto">
                <input
                  type="checkbox"
                  checked={notificationSettings[selectedOwner].emailNotifications}
                  onChange={(e) => updateNotificationSetting('emailNotifications', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
          {sections.map((section) => (
            <NotificationSection
              key={section.title}
              icon={section.icon}
              title={section.title}
              items={section.items}
              settings={notificationSettings[selectedOwner]}
              updateNestedSetting={updateNestedSetting}
            />
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            className="px-3 py-2 rounded text-white text-body-medium font-medium transition-colors cursor-pointer bg-[#795CF5] hover:bg-[#7C3AED]"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </main>
  );
}
