"use client";

import React, { useState } from "react";

import OrgInvoiceItem from "./OrgInvoiceItem";
import { useGetOrgInvoices } from "@/apiHooks.ts/invoice/inovice.api";
import InvoiceHistorySkeleton from "./InvoiceHistorySkeleton";

import InvoiceDetailModal from "./InvoiceDetailModal";
import { Invoice } from "@/apiHooks.ts/invoice/invoice.types";
import { Organization } from "@/apiHooks.ts/organization/organization.types";

const InvoiceHistoryTable = ({ org }: { org: Partial<Organization> }) => {
  const { data, isLoading } = useGetOrgInvoices(org.id);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <InvoiceHistorySkeleton />;
  }

  const invoices = data?.invoices || [];

  console.log(invoices);

  return (
    <>
      <div className="overflow-x-auto border rounded-lg mt-6">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-[#8B5CF6]">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                Invoice
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody className=" divide-y divide-border">
            {invoices.length > 0 ? (
              invoices.map((inv, index) => (
                <OrgInvoiceItem
                  key={inv.id || index}
                  invoice={inv}
                  onView={handleViewInvoice}
                  orgName={org.name || ""}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-sm text-gray-500"
                >
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <InvoiceDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        invoice={selectedInvoice}
        orgName={org.name!}
      />
    </>
  );
};

export default InvoiceHistoryTable;
