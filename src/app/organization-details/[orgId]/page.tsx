"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
const page = () => {
  const params = useParams();
  const orgId = params.orgId;
  const router = useRouter();
  useEffect(() => {
    if (orgId) {
      router.replace(`/organization-details/${orgId as string}/payment-methods`);
    }
  }, [orgId, router]);
  return null;
};
export default page;
