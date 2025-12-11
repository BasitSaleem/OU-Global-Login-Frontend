import React from 'react';
import { SvgIcon } from "@/components/ui/SvgIcon";
import { Button } from "@/components/ui";
import { IdCard } from "lucide-react";

const PaymentMethodSection = () => {
    return (
        <>
            <div className="text-center md:text-left mb-6">
                <h1 className="text-heading-1 font-bold pt-8 pb-4">
                    Payment method
                </h1>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center w-full h-full bg-bg-secondary rounded-lg border px-4 py-3 gap-3 sm:gap-0">
                <div className="flex flex-col sm:flex-row justify-start items-center gap-2 sm:gap-3 text-center sm:text-left">
                    <SvgIcon name="visa" width={30} height={30} />
                    <p className="text-body-small">Visa -- 5616 Expires 08/2028</p>
                </div>
                <Button className="bg-primary/40 p-1.5 text-sm border-0 rounded-3xl px-4 text-primary w-full sm:w-auto">
                    Primary
                </Button>
            </div>
            <div className="border flex justify-center items-center my-6 py-2 rounded-lg gap-2 text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">
                <IdCard color="gray" />
                Add Card
            </div>
        </>
    );
};

export default PaymentMethodSection;
