"use client";

import { Icons } from "@/components/utils/icons";
import { useAppSelector } from "@/redux/store";
import dynamic from "next/dynamic";
const OrganizationProductCard = dynamic(() => import("../Organizations/OrganizationProductCard"));
import { useGetOrganizations } from "@/apiHooks.ts/organization/organization.api";
import { LoadingSpinner } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeletion";
import Link from "next/link";
import { useGetAllPermissions } from "@/apiHooks.ts/auth/auth.api";
import Image from "next/image";
export default function HomePage() {
  const { user } = useAppSelector((s) => s.auth);
  const { data, isPending: loadingOrganizations } = useGetOrganizations(1, 10);
  // const dispatch = useAppDispatch();
  const productCodes = ["OI", "OJ", "OM", "OA"];
  // useEffect(() => {
  //   dispatch(setSSOStatus(false));
  // }, [])

  return (
    <div className="p-4 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="p-6 relative border rounded-xl py-16 overflow-hidden bg-card h-full">
          <div className="relative z-10 max-w-2xl">
            <p className="text-body-small text-gray-500 mb-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            <h1 className="text-heading-1 font-bold text-foreground mb-3">
              Hello, {user?.first_name} {user?.last_name}
            </h1>

            <div className="bg-card-secondary rounded-lg p-4">
              <p className="text-body-medium text-gray-600  cursor-auto">
                You don't have to be great to start, but you have to start to be
                great. <span className="font-bold">Zig Ziglar</span>
              </p>
            </div>
          </div>

          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 hidden xl:block ">
            <Image
              width={500}
              height={500}
              src={Icons.homepageimage}
              alt="Welcome illustration"
              className="w-72 h-72 object-contain"
            />
          </div>
        </div>

        {/* Products Section */}
        <div>
          {data?.organization.length === 0 || undefined ? (
            <h2 className="text-heading-2 mb-3 flex items-center gap-2 text-foreground">
              You Don't have any products
            </h2>
          ) : (
            <h2 className="text-heading-2 mb-3 flex items-center gap-2 text-foreground">
              {loadingOrganizations ? (
                <>
                  <span>Loading your products</span>
                  <LoadingSpinner size={4} />
                </>
              ) : (
                "Your Products"
              )}
            </h2>
          )}

          {data?.organization.length === 0 ? (
            <div className="flex items-center gap-2 mt-4">
              <Link href="/organizations">
                <h2 className="text-primary-600 hover:underline dark:text-primary-400">
                  Create a new organization
                </h2>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {loadingOrganizations ?
                Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="bg-background border p-2 rounded-xl" >
                    <div className="flex items-start gap-3 mb-2">
                      <Skeleton width="30px" height="30px" />
                      <div className="flex-1 min-w-0 space-y-2">
                        <Skeleton width="60%" height="16px" />
                        <Skeleton width="40%" height="12px" />
                      </div>
                    </div>
                    <div className="mt-auto flex items-center justify-between px-2 py-1.5">
                      <div className="flex ml-8 space-x-1">
                        <Skeleton width="25px" height="25px" count={3} />
                      </div>
                    </div>
                  </div>
                )) :
                productCodes.map((code) => (
                  <OrganizationProductCard
                    organizations={data?.organization}
                    metaData={data?.meta}
                    key={code}
                    code={code as any}
                  />
                ))
              }
            </div>
          )}
        </div>

        <div>
          <h2 className="text-heading-2 mb-2 text-foreground">Recent</h2>
          <div className="space-y-2 cursor-pointer">
            <p className="text-gray-500  text-center text-sm">
              No recent activity yet.
            </p>
          </div>
        </div>

        <div className=" bg-bg-secondary border rounded-lg p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-heading-3 font-bold text-foreground mb-2">
                What's New
              </h3>
              <p className="text-body-small text-gray-600 dark:text-gray-400">
                Check out our latest updates and features
              </p>
            </div>

            <Link
              href="/view-all-product"
              className="w-auto text-center text-white px-3 py-2  hover:opacity-90 transition-opacity hover:bg-primary bg-primary rounded-xl"
            >
              Explore All Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}