"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import PaymentSuccessModal from "@/components/modals/PaymentSuccessModal";

export default function PaymentSuccessPage() {
  const params = useParams();
  const orgId = params.orgId;
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 w-full">
      <PaymentSuccessModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        planName="Your New Plan"
      />

      <div className="bg-bg-secondary border p-8 max-w-md w-full text-center space-y-6 rounded-3xl shadow-sm">
        <div className="flex justify-center">
          <Image src="/Icons/payment.png" alt="Payment Success" width={100} height={100} />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-primary">
            Payment Successful
          </h1>
          <p className="text-text/70">
            Thank you for your payment. Your transaction has been completed
            successfully.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href={`/organization-details/${orgId}/billing`}
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold bg-primary text-white transition-all hover:scale-[1.02] active:scale-[0.98] w-full shadow-lg shadow-primary/20"
          >
            Return to Billing
          </Link>
        </div>
      </div>
    </div>
  );
}
