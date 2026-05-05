"use client";

import React, { useState } from "react";

import OrgInvoiceItem from "./OrgInvoiceItem";
import OrgMidCycleInvoiceItem from "./OrgMidCycleInvoiceItem";
import { useGetOrgInvoices } from "@/apiHooks.ts/invoice/inovice.api";
import InvoiceHistorySkeleton from "./InvoiceHistorySkeleton";

import InvoiceDetailModal from "./InvoiceDetailModal";
import { Invoice } from "@/apiHooks.ts/invoice/invoice.types";
import { Organization } from "@/apiHooks.ts/organization/organization.types";
import { isMidCycleInvoice } from "@/utils/invoicesUtils";

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
                Subtotal
              </th>

              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                Discount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                Net Total
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                Tax
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
              invoices.map((inv, index) =>
                isMidCycleInvoice(inv) ? (
                  <OrgMidCycleInvoiceItem
                    key={inv.id || index}
                    invoice={inv}
                    onView={handleViewInvoice}
                    orgName={org.name || ""}
                  />
                ) : (
                  <OrgInvoiceItem
                    key={inv.id || index}
                    invoice={inv}
                    onView={handleViewInvoice}
                    orgName={org.name || ""}
                  />
                ),
              )
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="px-6 py-10 text-center text-sm text-gray-500"
                >
                  No Invoices Found.
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
