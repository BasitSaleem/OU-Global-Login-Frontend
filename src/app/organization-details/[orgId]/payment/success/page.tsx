"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const params = useParams();
  const orgId = params.orgId;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 w-full">
      <div className="bg-background  border rounded-2xl shadow-sm p-8 max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-green-600 text-white  rounded-full p-4">
            <CheckCircle2 className="w-12 h-12" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-primary ">
            Payment Successful
          </h1>
          <p className="text-text">
            Thank you for your payment. Your transaction has been completed
            successfully.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href={`/organization-details/${orgId}/billing`}
            className="inline-flex items-center justify-center rounded-lg px-6 py-2.5 text-sm font-medium bg-primary text-white transition-colors w-full"
          >
            Return to Billing
          </Link>
        </div>
      </div>
    </div>
  );
}
