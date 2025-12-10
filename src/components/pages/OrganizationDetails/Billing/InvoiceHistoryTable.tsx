import React from 'react';
import { Download } from "lucide-react";

const InvoiceHistoryTable = () => {
    const invoices = [
        { date: "01/12/2024", invoice: "Invoice #001 - Dec 2024", amount: "$10.00" },
        { date: "01/11/2024", invoice: "Invoice #002 - Nov 2024", amount: "$10.00" },
    ];

    return (
        <div className="overflow-x-auto border rounded-lg mt-6">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#8B5CF6]">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Invoice
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {invoices.map((inv, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {inv.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 underline cursor-pointer">
                                {inv.invoice}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {inv.amount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                <button className="text-gray-500 hover:text-gray-700">
                                    <Download size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InvoiceHistoryTable;
