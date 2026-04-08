import React from 'react';
import { Input } from '@/components/ui';

interface NotificationSectionProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: { key: keyof any; label: string; highlighted?: boolean }[];
  settings: any;
  updateNestedSetting: (category: keyof any, type: 'inApp' | 'email', value: boolean) => void;
}

export const NotificationSection: React.FC<NotificationSectionProps> = ({
  icon: Icon,
  title,
  items,
  settings,
  updateNestedSetting,
}) => {
  return (
    <div className="bg-bg-secondary border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="text-primary" />
        <h3 className="text-body-medium-bold font-medium text-black">{title}</h3>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.key as string}
            className={`flex items-center justify-between px-2 py-1.5 rounded-lg ${item.highlighted ? 'bg-primary/20' : ''}`}
          >
            <span className="flex-1 text-body-small text-black">{item.label}</span>
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1 cursor-pointer">
                <Input
                  type="checkbox"
                  checked={(settings[item.key] as any).inApp}
                  onChange={(e) => updateNestedSetting(item.key, 'inApp', e.target.checked)}
                  className="w-3 h-3 rounded-lg cursor-pointer"
                />
                <span className="text-body-tiny text-black mt-1">In App</span>
              </div>
              <label className="flex items-center gap-1 cursor-pointer">
                <Input
                  type="checkbox"
                  checked={(settings[item.key] as any).email}
                  onChange={(e) => updateNestedSetting(item.key, 'email', e.target.checked)}
                  className="w-3 h-3 rounded-lg cursor-pointer"
                />
                <span className="text-body-tiny text-black mt-1">Email</span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
