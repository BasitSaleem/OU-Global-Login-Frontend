"use client"
import { DashboardLayout } from "@/components/layout";
import { Icons } from "@/components/utils/icons";
import Image from "next/image";
import { useState } from "react";
import PlanSection from "@/components/pages/OrganizationDetails/Billing/PlanSection";
import RenewalSection from "@/components/pages/OrganizationDetails/Billing/RenewalSection";
import PaymentMethodSection from "@/components/pages/OrganizationDetails/Billing/PaymentMethodSection";
import InvoicesSection from "@/components/pages/OrganizationDetails/Billing/InvoicesSection";

type OwnerKey = 'inventory' | 'jungle' | 'marketplace' | 'analytics';

const BillingContent = () => {
    const [selectedOwner, setSelectedOwner] = useState<OwnerKey>('inventory');

    return (
        <div className="px-2 py-12 w-full mx-auto   md:px-11 ">
            <h1 className="font-bold text-2xl text-center md:text-left">Billing</h1>

            <div className="flex justify-center mt-3">
                <div className="flex items-center gap-2 mb-3">
                    <div className="relative group cursor-pointer" onClick={() => setSelectedOwner('inventory')}>
                        <Image
                            src={Icons.owneranalytics}
                            alt="owner analytics"
                            width={16}
                            height={16}
                            className={`w-8 h-8 rounded-lg p-1 transition border ${selectedOwner === 'inventory'
                                ? 'border-primary bg-bg-secondary'
                                : 'border-transparent'
                                }`}
                        />
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-bg-secondary border text-black text-body-tiny font-medium rounded px-2 py-1 whitespace-nowrap z-10 shadow-sm">
                            Owners Inventory
                        </div>
                    </div>

                    <div className="relative group cursor-pointer" onClick={() => setSelectedOwner('jungle')}>
                        <Image
                            src={Icons.ownerjungle}
                            alt="owner jungle"
                            width={20}
                            height={20}
                            className={`w-8 h-8 rounded-lg p-1 transition border ${selectedOwner === 'jungle'
                                ? 'border-primary bg-bg-secondary'
                                : 'border-transparent'
                                }`}
                        />
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-bg-secondary border text-black text-body-tiny font-medium rounded px-2 py-1 whitespace-nowrap z-10 shadow-sm">
                            Owners Jungle
                        </div>
                    </div>

                    <div className="relative group cursor-pointer" onClick={() => setSelectedOwner('marketplace')}>
                        <Image
                            src={Icons.ownermarketplace}
                            alt="owner marketplace"
                            width={16}
                            height={16}
                            className={`w-8 h-8 rounded-lg p-1 transition border ${selectedOwner === 'marketplace'
                                ? 'border-primary bg-bg-secondary'
                                : 'border-transparent'
                                }`}
                        />
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-bg-secondary border text-black text-body-tiny font-medium rounded px-2 py-1 whitespace-nowrap z-10 shadow-sm">
                            Owner Marketplace
                        </div>
                    </div>

                    <div className="relative group cursor-pointer" onClick={() => setSelectedOwner('analytics')}>
                        <Image
                            src={Icons.owneranalytics}
                            alt="owner analytics"
                            width={16}
                            height={16}
                            className={`w-8 h-8 rounded-lg p-1 transition border ${selectedOwner === 'analytics'
                                ? 'border-primary bg-bg-secondary'
                                : 'border-transparent'
                                }`}
                        />
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-bg-secondary border text-black text-body-tiny font-medium rounded px-2 py-1 whitespace-nowrap z-10 shadow-sm">
                            Analytics
                        </div>
                    </div>
                </div>
            </div>

            <PlanSection />
            <RenewalSection />
            <PaymentMethodSection />
            <InvoicesSection />
        </div>
    );
};

export default function Page() {
    return (
        <BillingContent />
    );
}