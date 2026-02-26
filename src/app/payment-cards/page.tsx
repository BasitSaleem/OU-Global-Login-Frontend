"use client";
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout";
import PaymentMethodCard from "@/components/pages/OrganizationDetails/PaymentMethods/PaymentMethodCard";
import DeletePaymentModal from "@/components/pages/OrganizationDetails/PaymentMethods/DeletePaymentModal";

import StripeWrapper from "@/components/pages/OrganizationDetails/PaymentMethods/StripeWrapper";

import {
  useDeletePaymentMethod,
  useGetPaymentMethods,
  useMakePrimaryPaymentMethod,
} from "@/apiHooks.ts/paymentMethod/paymentMethod.api";
import PaymentCardSkeleton from "@/components/pages/OrganizationDetails/PaymentMethods/PaymentCardSkeleton";
import ErrorMessage from "@/components/ErrorMessage";
import { PaymentMethod } from "@/apiHooks.ts/paymentMethod/paymentMethod.types";

export interface PaymentCardsType {
  id: string;
  cardType: "visa" | "mastercard";
  last4: string;
  expiry: string;
  isPrimary: boolean;
  cardHolderName: string;
}

const PaymentCardsPage = () => {
  const { data, isLoading, error } = useGetPaymentMethods();
  const { mutateAsync: deletePaymentMethod } = useDeletePaymentMethod(() =>
    setDeleteId(null),
  );
  const makePrimaryMutation = useMakePrimaryPaymentMethod();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAddClick = () => {
    setModalMode("add");
    setSelectedMethod(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (method: PaymentMethod) => {
    setModalMode("edit");
    setSelectedMethod(method);
    setIsModalOpen(true);
  };

  const handleDeleteClick = () => {
    deletePaymentMethod(deleteId!);
  };

  const handleSave = (data: any) => {
    if (modalMode === "add") {
    } else if (modalMode === "edit" && selectedMethod) {
    }
  };

  return (
    <DashboardLayout>
      <div className="px-4 py-12 w-full mx-auto md:px-11">
        <div className="flex items-center gap-2 mb-6">
          <h1 className="font-bold text-2xl">Payment Method</h1>
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-medium bg-primary">
            {data?.paymentMethods?.length || 0}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <PaymentMethodCard variant="add" onAdd={handleAddClick} />
          {/* <AddPaymentCardForm clientSecret="" /> */}
          {isModalOpen && modalMode === "add" && (
            <StripeWrapper
              onClose={() => setIsModalOpen(false)}
              // onSave={(pm) => {
              //   handleSave(pm);
              //   setIsModalOpen(false);
              // }}
            />
          )}
          {isLoading && <PaymentCardSkeleton />}
          {error && (
            <ErrorMessage
              message={
                (error as any)?.message ||
                "Failed to load payment methods. Please try again."
              }
            />
          )}
          {data?.paymentMethods &&
            data?.paymentMethods.map((method: PaymentMethod) => (
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
                onEdit={() => handleEditClick(method)}
                onDelete={() => setDeleteId(method.id)}
                onMakePrimary={() => makePrimaryMutation.mutate(method.id)}
              />
            ))}
        </div>

        {isModalOpen && modalMode === "edit" && (
          <StripeWrapper mode="edit" onClose={() => setIsModalOpen(false)} />
        )}
        <DeletePaymentModal
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onDelete={handleDeleteClick}
          // initialData={selectedMethod}
        />
      </div>
    </DashboardLayout>
  );
};

export default PaymentCardsPage;
