"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import {
  Bell,
  ChartColumnIncreasing,
  ClipboardCheck,
  Mail,
  ShoppingCart,
  Truck,
} from "lucide-react";
import OwnersProductItem, {
  OwnerKey,
} from "@/components/pages/OrganizationDetails/Billing/OwnersProductItem";
import OpBillingSection from "@/components/pages/OrganizationDetails/Billing/OpBillingSection";
import { useParams } from "next/navigation";
import { NotificationSection } from "@/components/pages/OrganizationDetails/Notifications/NotificationSection";
import { useOrganizationDetails } from "@/apiHooks.ts/organization/organization.api";
// Types
export type NotificationSettings = {
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

const owners: {
  value: OwnerKey;
  toolTipText: string;
  iconUrl: string;
  isDisabled: boolean;
}[] = [
  {
    value: "inventory",
    toolTipText: "Owners Inventory",
    iconUrl: "OI",
    isDisabled: false,
  },
  // {
  //   value: "jungle",
  //   toolTipText: "Owners Jungle",
  //   iconUrl: "OJ",
  //   isDisabled: false,
  // },
  // {
  //   value: "marketplace",
  //   toolTipText: "Owner Marketplace",
  //   iconUrl: "OM",
  //   isDisabled: false,
  // },
  // {
  //   value: "analytics",
  //   toolTipText: "Analytics",
  //   iconUrl: "OA",
  //   isDisabled: false,
  // },
  {
    value: "pulse",
    toolTipText: "Owners Pulse",
    iconUrl: "OP",
    isDisabled: false,
  },
];
// reusable section component
// NotificationSection is imported from a separate component file.

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
  productionCancelled: { inApp: false, email: false },
};

export default function NotificationPreferencesPage() {
  // Store settings per owner
  const [notificationSettings, setNotificationSettings] = useState<
    Record<OwnerKey, NotificationSettings>
  >({
    inventory: { ...defaultSettings },
    jungle: { ...defaultSettings },
    marketplace: { ...defaultSettings },
    analytics: { ...defaultSettings },
    pulse: { ...defaultSettings },
  });

  // Which owner is active
  const { orgId } = useParams<{ orgId: string }>();
  const { data: organization } = useOrganizationDetails(orgId as string);
  const [selectedOwner, setSelectedOwner] = useState<OwnerKey>("inventory");

  // Only show a switcher icon for the products this organization actually has.
  const productNames = (organization?.products ?? [])
    .map((p) => p.product_name)
    .filter(Boolean) as string[];
  const availableOwners = owners.filter((owner) =>
    productNames.includes(owner.iconUrl),
  );

  // Keep the selected product valid for THIS org: default to the first
  // product the org actually has, and correct the selection if it's not one
  // the org owns.
  useEffect(() => {
    if (
      availableOwners.length &&
      !availableOwners.some((owner) => owner.value === selectedOwner)
    ) {
      setSelectedOwner(availableOwners[0].value);
    }
  }, [availableOwners, selectedOwner]);

  // update methods (scoped to selectedOwner)
  const updateNotificationSetting = (
    setting: keyof NotificationSettings,
    value: boolean,
  ) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [selectedOwner]: {
        ...prev[selectedOwner],
        [setting]: value as any,
      },
    }));
  };

  const updateNestedSetting: any = (
    category: keyof NotificationSettings,
    type: "inApp" | "email",
    value: boolean,
  ) => {
    setNotificationSettings((prev) => {
      const current = prev[selectedOwner][category] as {
        inApp: boolean;
        email: boolean;
      };
      return {
        ...prev,
        [selectedOwner]: {
          ...prev[selectedOwner],
          [category]: {
            ...current,
            [type]: value,
          },
        },
      };
    });
  };

  // config objects
  type Section = {
    icon: any;
    title: string;
    items: {
      key: keyof NotificationSettings;
      label: string;
      highlighted?: boolean;
    }[];
  };

  const sections: Section[] = [
    {
      icon: ShoppingCart,
      title: "Sale",
      items: [
        {
          key: "saleComplete",
          label: "When a sale is done",
          highlighted: true,
        },
        { key: "saleReturned", label: "When a sale is returned" },
        {
          key: "saleEdited",
          label: "When a sale is completely edited",
          highlighted: true,
        },
        { key: "saleDeleted", label: "When a sale is deleted" },
      ],
    },
    {
      icon: ClipboardCheck,
      title: "Purchase",
      items: [
        {
          key: "stockPurchased",
          label: "When new stock is purchased",
          highlighted: true,
        },
        {
          key: "stockAddedToInventory",
          label: "When purchased stock is added to inventory",
        },
        {
          key: "purchaseDeleted",
          label: "When a purchase is deleted",
          highlighted: true,
        },
      ],
    },
    {
      icon: Truck,
      title: "Transfer Stock",
      items: [
        {
          key: "stockIssued",
          label: "When stock is issued",
          highlighted: true,
        },
        {
          key: "stockTransferCompleted",
          label: "When stock transfer is completed",
        },
      ],
    },
    {
      icon: ChartColumnIncreasing,
      title: "Production",
      items: [
        {
          key: "productionStarted",
          label: "When production is started",
          highlighted: true,
        },
        { key: "productionCompleted", label: "When production is completed" },
        {
          key: "productionCancelled",
          label: "When production is cancelled",
          highlighted: true,
        },
      ],
    },
  ];

  return (
    <main className="p-2">
      <div className="w-full max-w-7xl mx-auto px-8">
        <div className="mb-3 gap-2">
          <div>
            <h1 className="text-heading-1 font-bold text-black mb-1 pt-8">
              Notification Preferences
            </h1>
            <p className="text-body-small ">
              Manage how you want to be notified about important updates
            </p>
          </div>

          {/* Owner Icons — only shown when the org has more than one product to switch between */}
          {availableOwners.length > 1 && (
            <div className="flex justify-center md:justify-start mt-3">
              <div className="flex items-center justify-center w-full gap-2 mb-3">
                {availableOwners.map((owner) => (
                  <OwnersProductItem
                    key={owner.value}
                    value={owner.value}
                    toolTipText={owner.toolTipText}
                    iconUrl={owner.iconUrl}
                    isDisabled={owner.isDisabled}
                    selectedOwner={selectedOwner}
                    setSelectedOwner={(value) => setSelectedOwner(value)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {selectedOwner === "pulse" ? (
          <OpBillingSection
            orgId={orgId as string}
            title="Owners Pulse Notifications"
            message="To manage your notification preferences, please navigate to your Owners Pulse account."
          />
        ) : (
          <>
        <div className="bg-bg-secondary border rounded-lg p-5 mb-5">
          <h2 className="text-body-medium-bold font-medium text-black mb-2">
            Notification Methods
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="flex items-center justify-between gap-2 p-3 border rounded-lg">
              <Bell strokeWidth={2} color="#795CF5" size={22} />
              <span className="text-body-small text-black">
                In-App Notifications
              </span>
              <div className="ml-auto">
                <input
                  type="checkbox"
                  checked={
                    notificationSettings[selectedOwner].inAppNotifications
                  }
                  onChange={(e) =>
                    updateNotificationSetting(
                      "inAppNotifications",
                      e.target.checked,
                    )
                  }
                  className="w-4 h-4 rounded-lg cursor-pointer"
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 p-3 border rounded-lg">
              <Mail color="#795CF5" strokeWidth={2} size={22} />
              <span className="text-body-small text-black">
                Email Notifications
              </span>
              <div className="ml-auto">
                <input
                  type="checkbox"
                  checked={
                    notificationSettings[selectedOwner].emailNotifications
                  }
                  onChange={(e) =>
                    updateNotificationSetting(
                      "emailNotifications",
                      e.target.checked,
                    )
                  }
                  className="w-4 h-4 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

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
          <Button
            variant="primary"
            className="text-[#ffff] bg-[#795CF5] hover:bg-[#795CF5]/90"
          >
            Save Preferences
          </Button>
        </div>
          </>
        )}
      </div>
    </main>
  );
}
