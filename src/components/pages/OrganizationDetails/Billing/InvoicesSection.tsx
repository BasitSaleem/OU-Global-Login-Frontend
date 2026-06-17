import React from "react";

import InvoiceHistoryTable from "./InvoiceHistoryTable";
import { Organization } from "@/apiHooks.ts/organization/organization.types";
import { Dots } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";

interface InvoicesSectionPropsType {
  organization?: Partial<Organization>;
  loading: boolean;
}

const InvoicesSection = ({
  organization,
  loading,
}: InvoicesSectionPropsType) => {
  // const [emailNotification, setEmailNotification] = useState<boolean>(false);
  // const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="mb-9 w-full">
      <div className="text-center md:text-left">
        <h1 className="text-heading-1 font-bold pt-8">
          {loading ? <Dots text="Loading invoices" /> : "Invoices"}
        </h1>
        {/* <p className="text-body-small">
          {loading ? <div className="flex flex-col items-start gap-2 ml-2"><Skeleton width={200} height={10} /> <Skeleton width={150} height={10} /> </div> : "Invoices are generated every 24 hours and transactions are rolled into one invoice during this period."}
        </p> */}
      </div>
      {/* 
      <div className="border rounded-xl mb-9">
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 py-4 gap-4 sm:gap-0 ">
            <div className="text-left w-full sm:w-auto">
              <h1 className="font-semibold">
                Receive email notifications for new invoices
              </h1>
              <p className="text-body-small py-1">
                An invoice will be sent to the email address listed below.
              </p>
            </div>
            <Button
              onClick={() => setEmailNotification(!emailNotification)}
              className={`w-12 h-6 rounded-full cursor-pointer p-1 flex items-center transition-colors border shrink-0 ${
                emailNotification ? "bg-primary" : "bg-primary/20"
              }`}
              aria-pressed={emailNotification}
              aria-label="Toggle email notification"
            >
              <span
                className={`w-4 h-4 bg-bg-secondary rounded-full transition-transform mr-6 ${
                  emailNotification ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </Button>
          </div>
          <hr className="mx-3" />
          <div className="p-4 space-y-4">
            <Input
              label="Recipient email"
              placeholder="Enter email"
              defaultValue={user?.email}
              helperText="Adding new email..."
              readOnly
            />

            <div className="space-y-2">
              <h1 className="font-semibold text-sm">Invoice details</h1>
              <p className="text-body-small text-xs">
                This information will help us verify the correct tax on your
                invoice.
              </p>
              <Input
                label="Country"
                isRequired={true}
                placeholder="Select Country"
              />
            </div>
          </div>
        </div>
      </div> */}

      {/* <div className="mb-4">
        <h1 className="font-bold text-sm mb-2">
          Additional Invoice Memo{" "}
          <span className="font-normal text-gray-500">(optional)</span>
        </h1>
        <p className="text-body-small mb-2">
          Add any additional details that will be displayed on your invoice.
        </p>
        <Input placeholder="" />
      </div> */}
      {loading ? (
        <div className="flex flex-col border border-border h-auto rounded-xl animate-pulse p-4 gap-4">
          <div className="flex gap-4 justify-between w-full">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                width="100%"
                height={24}
                className={index > 1 ? "hidden sm:block" : ""}
              />
            ))}
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4 justify-between w-full">
                <Skeleton width="40%" height={16} />
                <Skeleton width="30%" height={16} />
                <Skeleton width="20%" height={16} className="hidden sm:block" />
                <Skeleton width="10%" height={16} className="hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <InvoiceHistoryTable
          org={organization !== undefined ? organization : {}}
        />
      )}
    </div>
  );
};

export default InvoicesSection;
