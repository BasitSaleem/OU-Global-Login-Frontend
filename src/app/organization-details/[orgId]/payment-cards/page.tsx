"use client";
import React, { useState, useMemo, useCallback } from "react";

import PaymentMethodCard from "@/components/pages/OrganizationDetails/PaymentMethods/PaymentMethodCard";
import DeletePaymentModal from "@/components/pages/OrganizationDetails/PaymentMethods/DeletePaymentModal";

import StripeWrapper from "@/components/pages/OrganizationDetails/PaymentMethods/StripeWrapper";

import {
  useDeletePaymentMethod,
  useGetPaymentMethods,
  useMakePrimaryPaymentMethod,
} from "@/apiHooks.ts/paymentMethod/paymentMethod.api";
import PaymentCardSkeleton from "@/components/pages/OrganizationDetails/PaymentMethods/PaymentCardSkeleton";
import { PaymentMethod } from "@/apiHooks.ts/paymentMethod/paymentMethod.types";
import { AuthGuard } from "@/components/HOCs/auth-guard";
import { useParams } from "next/navigation";

export interface PaymentCardsType {
  id: string;
  cardType: "visa" | "mastercard" | "amex" | "discover" | "jcb" | "diners" | "unionpay";
  last4: string;
  expiry: string;
  isPrimary: boolean;
  cardHolderName: string;
}

const PaymentCardsPage = () => {
  const { orgId } = useParams<{ orgId: string }>();
  const { data, isLoading, error } = useGetPaymentMethods(orgId);

  const makePrimaryMutation = useMakePrimaryPaymentMethod();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  const { mutateAsync: deletePaymentMethod, isPending: isDeleting } =
    useDeletePaymentMethod();

  // Filter out deleted items from the displayed list
  const visiblePaymentMethods = useMemo(() => {
    if (!data?.paymentMethods) return [];
    return data.paymentMethods.filter(
      (method: PaymentMethod) => !deletedIds.has(method.id),
    );
  }, [data?.paymentMethods, deletedIds]);

  const handleAddClick = () => {
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleDeleteClick = useCallback(async () => {
    if (!deleteId) return;
    try {
      await deletePaymentMethod(deleteId);
      setDeletedIds((prev) => new Set(prev).add(deleteId));
      setDeleteId(null);
    } catch {
    }
  }, [deleteId, deletePaymentMethod]);

  return (
    <AuthGuard>
      <div className="px-4 py-12 w-full mx-auto md:px-11">
        <div className="flex items-center gap-2 mb-6">
          <h1 className="font-bold text-2xl">Payment Cards</h1>
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-medium bg-primary">
            {visiblePaymentMethods.length}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          <PaymentMethodCard variant="add" onAdd={handleAddClick} />

          {isModalOpen && modalMode === "add" && (
            <StripeWrapper
              orgId={orgId}
              onClose={() => setIsModalOpen(false)}
            />
          )}
          {isLoading && <PaymentCardSkeleton />}
          {/* {error && (
            <ErrorMessage
              message={
                (error as any)?.message ||
                "Failed to load payment methods. Please try again."
              }
            />
          )} */}
          {visiblePaymentMethods.map((method: PaymentMethod) => (
            <PaymentMethodCard
              key={method.id}
              variant="display"
              cardType={method.brand}
              last4={method.last4}
              isMakePrimaryLoading={
                makePrimaryMutation.isPending &&
                makePrimaryMutation.variables === method.id
              }
              expiry={`${method.exp_month}/${method.exp_year}`}
              isPrimary={method.is_primary}
              onDelete={() => setDeleteId(method.id)}
              onMakePrimary={() => makePrimaryMutation.mutate(method.id)}
            />
          ))}
        </div>
        <DeletePaymentModal
          isOpen={!!deleteId}
          isDeleting={isDeleting}
          onClose={() => setDeleteId(null)}
          onDelete={handleDeleteClick}
        // initialData={selectedMethod}
        />
      </div>
    </AuthGuard>
  );
};

export default PaymentCardsPage;
