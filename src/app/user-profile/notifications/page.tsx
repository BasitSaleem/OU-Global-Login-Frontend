'use client';

import { useState } from 'react';
import { ShoppingCart, Clipboard, Truck, Factory } from 'lucide-react';
import Image from 'next/image';
import bell from '../../../../public/bell.svg';
import Union from '../../../../public//Union.svg';


// reusable section component
function NotificationSection({
  icon: Icon,
  title,
  items,
  settings,
  updateNestedSetting
}: {
  icon: any;
  title: string;
  items: { key: keyof typeof settings; label: string; highlighted?: boolean }[];
  settings: any;
  updateNestedSetting: (category: string, type: string, value: boolean) => void;
}) {
  return (
    <div className="bg-white border border-gray-300 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Icon className="w-6 h-6 text-[#795CF5]" />
        <h3 className="text-base sm:text-lg  font-medium text-black">{title}</h3>
      </div>

      <div className="space-y-2">
        {items.map((item, idx) => (
         <div
  key={item.key as string}
  className={`flex items-center justify-between px-3 py-3 rounded-lg ${
    item.highlighted ? 'bg-[rgba(121,92,245,0.07)]' : ''
  }`}
>
  {/* Label text */}
  <span className="flex-1 text-sm sm:text-base text-black">{item.label}</span>

  {/* Checkboxes */}
  <div className="flex items-center gap-4 shrink-0">
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={settings[item.key].inApp}
        onChange={(e) =>
          updateNestedSetting(item.key as string, 'inApp', e.target.checked)
        }
        className="w-4 h-4 rounded border-gray-300 cursor-pointer"
      />
      <span className="text-sm sm:text-base text-black">In App</span>
    </label>

    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={settings[item.key].email}
        onChange={(e) =>
          updateNestedSetting(item.key as string, 'email', e.target.checked)
        }
        className="w-4 h-4 rounded border-gray-300 cursor-pointer"
      />
      <span className="text-sm sm:text-base text-black">Email</span>
    </label>
  </div>
</div>

        ))}
      </div>
    </div>
  );
}

export default function NotificationPreferencesPage() {
  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
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
  });

  const updateNotificationSetting = (setting: string, value: boolean) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: value
    }));
  };

const updateNestedSetting = (category: string, type: string, value: boolean) => {
  setNotificationSettings((prev) => {
    const current = prev[category as keyof typeof prev] as { inApp: boolean; email: boolean };
    return {
      ...prev,
      [category]: {
        ...current,
        [type]: value,
      },
    };
  });
};

  // config objects
  const sections = [
    {
      icon: ShoppingCart,
      title: 'Sale',
      items: [
        { key: 'saleComplete', label: 'When a sale is done', highlighted: true },
        { key: 'saleReturned', label: 'When a sale is returned' },
        { key: 'saleEdited', label: 'When a sale is completely edited', highlighted: true },
        { key: 'saleDeleted', label: 'When a sale is deleted' }
      ]
    },
    {
      icon: Clipboard,
      title: 'Purchase',
      items: [
        { key: 'stockPurchased', label: 'When new stock is purchased', highlighted: true },
        { key: 'stockAddedToInventory', label: 'When purchased stock is added to inventory' },
        { key: 'purchaseDeleted', label: 'When a purchase is deleted', highlighted: true }
      ]
    },
    {
      icon: Truck,
      title: 'Transfer Stock',
      items: [
        { key: 'stockIssued', label: 'When stock is issued', highlighted: true },
        { key: 'stockTransferCompleted', label: 'When stock transfer is completed' }
      ]
    },
    {
      icon: Factory,
      title: 'Production',
      items: [
        { key: 'productionStarted', label: 'When production is started', highlighted: true },
        { key: 'productionCompleted', label: 'When production is completed' },
        { key: 'productionCancelled', label: 'When production is cancelled', highlighted: true }
      ]
    }
  ];

  return (
    <main className="p-4 sm:p-8">
      <div className="max-w-7xl">
        {/* Header Section */}
        <div className=" mb-6 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-black mb-2">
              Notification Preferences
            </h1>
            <p className="text-sm sm:text-base text-gray-500">
              Manage how you want to be notified about important updates
            </p>
          </div>
      <div className="flex justify-center mt-5">
  <div className="flex items-center gap-4">
    {/* Icon 1 */}
    <div className="relative group">
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/bcff51bc038083aa17f692d66b4f8521dac82c55?width=76"
        alt="owner inventory"
        className="w-8 h-8 sm:w-10 sm:h-10 rounded cursor-pointer border border-transparent group-hover:border-[#795CF5] group-hover:bg-[#795CF512] p-1 transition"
      />
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-white border border-[#E5E7EB] text-black text-xs sm:text-sm font-medium rounded-md px-3 py-1 whitespace-nowrap z-10 shadow-sm">
        Owners Inventory
      </div>
    </div>

    {/* Icon 2 */}
    <div className="relative group">
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/eeed242f35b2e1aa1a69fb85fb47383ef68ac0af?width=78"
        alt="owner jungle"
        className="w-8 h-8 sm:w-10 sm:h-10 rounded cursor-pointer border border-transparent group-hover:border-[#795CF5] group-hover:bg-[#795CF512] p-1 transition"
      />
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-white border border-[#E5E7EB] text-black text-xs sm:text-sm font-medium rounded-md px-3 py-1 whitespace-nowrap z-10 shadow-sm">
        Owners Jungle
      </div>
    </div>

    {/* Icon 3 */}
    <div className="relative group">
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/2e5e61c17217b60ae9dfbc6168fcccfea3b25ebb?width=76"
        alt="owner marketplace"
        className="w-8 h-8 sm:w-10 sm:h-10 rounded cursor-pointer border border-transparent group-hover:border-[#795CF5] group-hover:bg-[#795CF512] p-1 transition"
      />
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-white border border-[#E5E7EB] text-black text-xs sm:text-sm font-medium rounded-md px-3 py-1 whitespace-nowrap z-10 shadow-sm">
        Owner Marketplace
      </div>
    </div>

    {/* Icon 4 */}
    <div className="relative group">
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/72b1ea421112224fa1bea68adcd733be5aa8666b?width=76"
        alt="Owner Analytics"
        className="w-8 h-8 sm:w-10 sm:h-10 rounded cursor-pointer border border-transparent group-hover:border-[#795CF5] group-hover:bg-[#795CF512] p-1 transition"
      />
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-white border border-[#E5E7EB] text-black text-xs sm:text-sm font-medium rounded-md px-3 py-1 whitespace-nowrap z-10 shadow-sm">
        Analytics
      </div>
    </div>
  </div>
</div>

        </div>

        {/* Notification Methods */}
        <div className="bg-white border border-gray-300 rounded-lg p-4 sm:p-6 mb-6">
          <h2 className="text-base sm:text-lg font-medium text-black mb-4">
            Notification Methods
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* In-App Notifications */}
            <div className="flex items-center gap-4 p-4 border border-gray-300 rounded-lg">
                <Image src={bell} height={24} width={24} alt="Bell Icon" />
              <span className="text-sm sm:text-base text-black">In-App Notifications</span>
              <div className="ml-auto">
                <input
                  type="checkbox"
                  checked={notificationSettings.inAppNotifications}
                  onChange={(e) =>
                    updateNotificationSetting('inAppNotifications', e.target.checked)
                  }
                  className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                />
              </div>
            </div>

            {/* Email Notifications */}
            <div className="flex items-center gap-4 p-4 border border-gray-300 rounded-lg">
              <Image src={Union} height={24} width={24} alt="Bell Icon" />
              <span className="text-sm sm:text-base text-black">Email Notifications</span>
              <div className="ml-auto">
                <input
                  type="checkbox"
                  checked={notificationSettings.emailNotifications}
                  onChange={(e) =>
                    updateNotificationSetting('emailNotifications', e.target.checked)
                  }
                  className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {sections.map((section) => (
            <NotificationSection
              key={section.title}
              icon={section.icon}
              title={section.title}
              items={section.items}
              settings={notificationSettings}
              updateNestedSetting={updateNestedSetting}
            />
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            className="px-6 py-2.5 rounded-lg text-white text-sm sm:text-base font-medium transition-colors cursor-pointer"
            style={{ backgroundColor: '#795CF5' }}
          >
            Save Preferences
          </button>
        </div>
      </div>
    </main>
  );
}
