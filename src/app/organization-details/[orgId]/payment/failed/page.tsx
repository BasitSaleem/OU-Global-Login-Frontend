"use client";

import { XCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PaymentFailedPage() {
  const params = useParams();
  const orgId = params.orgId;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 w-full">
      <div className="bg-background border  rounded-2xl shadow-sm p-8 max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-full p-4">
            <XCircle className="w-12 h-12" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            Payment Failed
          </h1>
          <p className="text-text">
            We couldn't process your payment. Please try again or use a
            different payment method.
          </p>
        </div>

        <div className="pt-4 flex flex-col space-y-3">
          <Link
            href={`/organization-details/${atob(orgId as string)}/billing`}
            className="inline-flex items-center justify-center rounded-lg bg-primary text-white px-6 py-2.5 text-sm font-medium  hover:bg-primary/80 transition-colors w-full"
          >
            Return to Billing
          </Link>
        </div>
      </div>
    </div>
  );
}
