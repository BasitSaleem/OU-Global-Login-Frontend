'use client';

import { useState } from 'react';
import {
  ShoppingCart,
  Clipboard,
  Truck,
  Factory
} from 'lucide-react';

export default function NotificationPreferencesPage() {
  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    // Global settings
    inAppNotifications: false,
    emailNotifications: false,
    
    // Sale notifications
    saleComplete: { inApp: false, email: false },
    saleReturned: { inApp: false, email: false },
    saleEdited: { inApp: false, email: false },
    saleDeleted: { inApp: false, email: false },
    
    // Purchase notifications
    stockPurchased: { inApp: false, email: false },
    stockAddedToInventory: { inApp: false, email: false },
    purchaseDeleted: { inApp: false, email: false },
    
    // Transfer Stock notifications
    stockIssued: { inApp: false, email: false },
    stockTransferCompleted: { inApp: false, email: false },
    
    // Production notifications
    productionStarted: { inApp: false, email: false },
    productionCompleted: { inApp: false, email: false },
    productionCancelled: { inApp: false, email: false }
  });

  const updateNotificationSetting = (setting: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const updateNestedSetting = (category: string, type: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev] as any,
        [type]: value
      }
    }));
  };

  return (
    <main className="p-8">
      <div className="max-w-7xl">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black mb-2">Notification Preferences</h1>
            <p className="text-base text-gray-500">Manage how you want to be notified about important updates</p>
          </div>
          
          {/* Icon Images */}
          <div className="flex items-center gap-2.5">
            <img src="https://api.builder.io/api/v1/image/assets/TEMP/bcff51bc038083aa17f692d66b4f8521dac82c55?width=76" alt="" className="w-10 h-10 rounded" />
            <img src="https://api.builder.io/api/v1/image/assets/TEMP/eeed242f35b2e1aa1a69fb85fb47383ef68ac0af?width=78" alt="" className="w-10 h-10 rounded" />
            <img src="https://api.builder.io/api/v1/image/assets/TEMP/2e5e61c17217b60ae9dfbc6168fcccfea3b25ebb?width=76" alt="" className="w-10 h-10 rounded" />
            <img src="https://api.builder.io/api/v1/image/assets/TEMP/72b1ea421112224fa1bea68adcd733be5aa8666b?width=76" alt="" className="w-10 h-10 rounded" />
          </div>
        </div>

        {/* Notification Methods */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-black mb-4">Notification Methods</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* In-App Notifications */}
            <div className="flex items-center gap-4 p-4 border border-gray-300 rounded-lg">
              <svg width="24" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.0001 18.4609V19.2109C14.0001 20.0394 13.7072 20.7465 13.1214 21.3323C12.5356 21.918 11.8285 22.2109 11.0001 22.2109C10.1717 22.2109 9.46458 21.918 8.87879 21.3323C8.293 20.7465 8.00011 20.0394 8.00011 19.2109V18.4609M19.0476 16.9342C17.8439 15.4609 16.994 14.7109 16.994 10.6492C16.994 6.92969 15.0946 5.60453 13.5314 4.96094C13.3237 4.87563 13.1282 4.67969 13.065 4.46641C12.7907 3.53313 12.022 2.71094 11.0001 2.71094C9.97824 2.71094 9.20902 3.53359 8.93761 4.46734C8.87433 4.68297 8.67886 4.87563 8.4712 4.96094C6.90605 5.60547 5.00855 6.92594 5.00855 10.6492C5.0062 14.7109 4.15636 15.4609 2.95261 16.9342C2.45386 17.5445 2.89073 18.4609 3.76308 18.4609H18.2418C19.1095 18.4609 19.5435 17.5417 19.0476 16.9342Z" stroke="#795CF5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-base text-black">In-App Notifications</span>
              <div className="ml-auto">
                <input
                  type="checkbox"
                  checked={notificationSettings.inAppNotifications}
                  onChange={(e) => updateNotificationSetting('inAppNotifications', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300"
                />
              </div>
            </div>
            
            {/* Email Notifications */}
            <div className="flex items-center gap-4 p-4 border border-gray-300 rounded-lg">
              <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.75" y="0.75" width="19.5" height="13.5" rx="1.25" stroke="#795CF5" strokeWidth="1.5"/>
                <path d="M0.75 3.75L10.5 8.25L20.25 3.75" stroke="#795CF5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-base text-black">Email Notifications</span>
              <div className="ml-auto">
                <input
                  type="checkbox"
                  checked={notificationSettings.emailNotifications}
                  onChange={(e) => updateNotificationSetting('emailNotifications', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sale Notifications */}
          <div className="bg-white border border-gray-300 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingCart className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-medium text-black">Sale</h3>
            </div>
            
            <div className="space-y-2">
              {/* When a sale is done */}
              <div className="flex items-center justify-between px-3 py-3 rounded-lg" style={{ backgroundColor: 'rgba(121, 92, 245, 0.07)' }}>
                <span className="text-base text-black">When a sale is done</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.saleComplete.inApp}
                      onChange={(e) => updateNestedSetting('saleComplete', 'inApp', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-base text-black">In App</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.saleComplete.email}
                      onChange={(e) => updateNestedSetting('saleComplete', 'email', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-base text-black">Email</span>
                  </label>
                </div>
              </div>
              
              {/* When a sale is returned */}
              <div className="flex items-center justify-between px-3 py-3 rounded-lg">
                <span className="text-base text-black">When a sale is returned</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.saleReturned.inApp}
                      onChange={(e) => updateNestedSetting('saleReturned', 'inApp', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-base text-black">In App</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.saleReturned.email}
                      onChange={(e) => updateNestedSetting('saleReturned', 'email', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-base text-black">Email</span>
                  </label>
                </div>
              </div>
              
              {/* When a sale is completely edited */}
              <div className="flex items-center justify-between px-3 py-3 rounded-lg" style={{ backgroundColor: 'rgba(121, 92, 245, 0.07)' }}>
                <span className="text-base text-black">When a sale is completely edited</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.saleEdited.inApp}
                      onChange={(e) => updateNestedSetting('saleEdited', 'inApp', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-base text-black">In App</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.saleEdited.email}
                      onChange={(e) => updateNestedSetting('saleEdited', 'email', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-base text-black">Email</span>
                  </label>
                </div>
              </div>
              
              {/* When a sale is deleted */}
              <div className="flex items-center justify-between px-3 py-3 rounded-lg">
                <span className="text-base text-black">When a sale is deleted</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.saleDeleted.inApp}
                      onChange={(e) => updateNestedSetting('saleDeleted', 'inApp', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-base text-black">In App</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.saleDeleted.email}
                      onChange={(e) => updateNestedSetting('saleDeleted', 'email', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-base text-black">Email</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Notifications */}
          <div className="bg-white border border-gray-300 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Clipboard className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-medium text-black">Purchase</h3>
            </div>
            
            <div className="space-y-2">
              {/* When new stock is purchased */}
              <div className="flex items-center justify-between px-3 py-3 rounded-lg" style={{ backgroundColor: 'rgba(121, 92, 245, 0.07)' }}>
                <span className="text-base text-black">When new stock is purchased</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.stockPurchased.inApp}
                      onChange={(e) => updateNestedSetting('stockPurchased', 'inApp', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-base text-black">In App</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.stockPurchased.email}
                      onChange={(e) => updateNestedSetting('stockPurchased', 'email', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-base text-black">Email</span>
                  </label>
                </div>
              </div>
              
              {/* When purchased stock is added to inventory */}
              <div className="flex items-center justify-between px-3 py-3 rounded-lg">
                <span className="text-base text-black">When purchased stock is added to inventory</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.stockAddedToInventory.inApp}
                      onChange={(e) => updateNestedSetting('stockAddedToInventory', 'inApp', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-base text-black">In App</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.stockAddedToInventory.email}
                      onChange={(e) => updateNestedSetting('stockAddedToInventory', 'email', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-base text-black">Email</span>
                  </label>
                </div>
              </div>
              
              {/* When a purchase is deleted */}
              <div className="flex items-center justify-between px-3 py-3 rounded-lg" style={{ backgroundColor: 'rgba(121, 92, 245, 0.07)' }}>
                <span className="text-base text-black">When a purchase is deleted</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.purchaseDeleted.inApp}
                      onChange={(e) => updateNestedSetting('purchaseDeleted', 'inApp', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-base text-black">In App</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.purchaseDeleted.email}
                      onChange={(e) => updateNestedSetting('purchaseDeleted', 'email', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-base text-black">Email</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Transfer Stock Notifications */}
          <div className="bg-white border border-gray-300 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Truck className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-medium text-black">Transfer Stock</h3>
            </div>
            
            <div className="space-y-2">
              {/* When stock is issued */}
              <div className="flex items-center justify-between px-3 py-3 rounded-lg" style={{ backgroundColor: 'rgba(121, 92, 245, 0.07)' }}>
                <span className="text-base text-black">When stock is issued</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.stockIssued.inApp}
                      onChange={(e) => updateNestedSetting('stockIssued', 'inApp', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-base text-black">In App</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.stockIssued.email}
                      onChange={(e) => updateNestedSetting('stockIssued', 'email', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-base text-black">Email</span>
                  </label>
                </div>
              </div>
              
              {/* When stock transfer is completed */}
              <div className="flex items-center justify-between px-3 py-3 rounded-lg">
                <span className="text-base text-black">When stock transfer is completed</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.stockTransferCompleted.inApp}
                      onChange={(e) => updateNestedSetting('stockTransferCompleted', 'inApp', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-base text-black">In App</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.stockTransferCompleted.email}
                      onChange={(e) => updateNestedSetting('stockTransferCompleted', 'email', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-base text-black">Email</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Production Notifications */}
          <div className="bg-white border border-gray-300 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Factory className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-medium text-black">Production</h3>
            </div>
            
            <div className="space-y-2">
              {/* When production is started */}
              <div className="flex items-center justify-between px-3 py-3 rounded-lg" style={{ backgroundColor: 'rgba(121, 92, 245, 0.07)' }}>
                <span className="text-base text-black">When production is started</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.productionStarted.inApp}
                      onChange={(e) => updateNestedSetting('productionStarted', 'inApp', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-base text-black">In App</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.productionStarted.email}
                      onChange={(e) => updateNestedSetting('productionStarted', 'email', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-base text-black">Email</span>
                  </label>
                </div>
              </div>
              
              {/* When production is completed */}
              <div className="flex items-center justify-between px-3 py-3 rounded-lg">
                <span className="text-base text-black">When production is completed</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.productionCompleted.inApp}
                      onChange={(e) => updateNestedSetting('productionCompleted', 'inApp', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-base text-black">In App</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.productionCompleted.email}
                      onChange={(e) => updateNestedSetting('productionCompleted', 'email', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-base text-black">Email</span>
                  </label>
                </div>
              </div>
              
              {/* When production is cancelled */}
              <div className="flex items-center justify-between px-3 py-3 rounded-lg" style={{ backgroundColor: 'rgba(121, 92, 245, 0.07)' }}>
                <span className="text-base text-black">When production is cancelled</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.productionCancelled.inApp}
                      onChange={(e) => updateNestedSetting('productionCancelled', 'inApp', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-base text-black">In App</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notificationSettings.productionCancelled.email}
                      onChange={(e) => updateNestedSetting('productionCancelled', 'email', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-base text-black">Email</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button 
            className="px-6 py-2.5 rounded-lg text-white text-base font-medium transition-colors"
            style={{ backgroundColor: '#795CF5' }}
          >
            Save Preferences
          </button>
        </div>
      </div>
    </main>
  );
}
