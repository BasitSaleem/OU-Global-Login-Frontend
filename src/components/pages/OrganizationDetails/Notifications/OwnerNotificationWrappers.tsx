import React from 'react';
import { OwnerNotificationPanel } from '@/components/pages/OrganizationDetails/Notifications/OwnerNotificationPanel';
import { NotificationSettings } from '@/app/organization-details/[orgId]/notifications/page';
import { OwnerKey } from '@/app/organization-details/[orgId]/notifications/page';

interface Props {
  settings: NotificationSettings;
  updateNestedSetting: (category: keyof NotificationSettings, type: 'inApp' | 'email', value: boolean) => void;
}

export const InventoryNotification: React.FC<Props> = ({ settings, updateNestedSetting }) => (
  <OwnerNotificationPanel owner="inventory" settings={settings} updateNestedSetting={updateNestedSetting} />
);

export const JungleNotification: React.FC<Props> = ({ settings, updateNestedSetting }) => (
  <OwnerNotificationPanel owner="jungle" settings={settings} updateNestedSetting={updateNestedSetting} />
);

export const MarketplaceNotification: React.FC<Props> = ({ settings, updateNestedSetting }) => (
  <OwnerNotificationPanel owner="marketplace" settings={settings} updateNestedSetting={updateNestedSetting} />
);

export const AnalyticsNotification: React.FC<Props> = ({ settings, updateNestedSetting }) => (
  <OwnerNotificationPanel owner="analytics" settings={settings} updateNestedSetting={updateNestedSetting} />
);
