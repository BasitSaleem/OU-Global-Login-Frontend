import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const InvoiceHistorySkeleton = () => {
  return (
    <div className="overflow-x-auto border rounded-lg mt-6">
      <table className="min-w-full divide-y divide-gray-200">
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
              className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {[1, 2, 3].map((_, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <Skeleton height="20px" width="80px" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Skeleton height="20px" width="150px" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Skeleton height="20px" width="60px" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex justify-center">
                  <Skeleton height="20px" width="20px" circle />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceHistorySkeleton;
