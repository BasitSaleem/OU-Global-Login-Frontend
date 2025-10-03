"use client"
import { Icons } from "@/components/utils/icons";
import OrgCard from "../Organizations/organizations";
import { useAppSelector } from "@/redux/store";
import { useGetOrganizationProducts, useGetOrganizations } from "@/apiHooks.ts/organization/organization.api";
import OrganizationProductCard from "../Organizations/OrganizationProductCard";
import { OgOrganization } from "@/apiHooks.ts/organization/organization.types";
export default function HomePage() {
  // const orgs: any = [
  //   // {
  //   //   initials: "RS",
  //   //   color: "#F95C5B",
  //   //   title: "Marketing",
  //   //   subtitle: "Organization",
  //   // },
  //   // {
  //   //   initials: "S",
  //   //   color: "#795CF5",
  //   //   title: "Spotify",
  //   //   subtitle: "Organization",
  //   // },
  //   // {
  //   //   initials: "RS",
  //   //   color: "#B11E67",
  //   //   title: "Al-Asif Interiors",
  //   //   subtitle: "Organization",
  //   // },
  // ];
  const { user } = useAppSelector((s) => s.auth);
  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Welcome Hero Section */}
        <div
          className="rounded-lg p-6 relative overflow-hidden"
          style={{ backgroundColor: "rgba(121, 92, 245, 0.07)" }}
        >
          {/* Background Illustration */}
          <div className="absolute right-0 top-0 opacity-10">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/d357815c619928a7802f3725dd398cd9da43a059?width=512"
              alt=""
              className="w-64 h-64"
            />
          </div>

          <div className="relative z-10 max-w-2xl">
            <p className="text-body-small text-gray-500 mb-1">
              Thursday, July 31
            </p>
            <h1 className="text-heading-1 font-bold text-black mb-3">
              Hello, {user?.first_name} {user?.last_name}
            </h1>

            {/* Quote Card */}
            <div className="bg-white rounded p-4 max-w-xl">
              <p className="text-body-medium text-gray-600 cursor-auto">
                You don't have to be great to start, but you have to start to be
                great. <span className="font-bold">Zig Ziglar</span>
              </p>
            </div>
          </div>

          {/* Welcome Illustration */}
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 hidden xl:block">
            <img
              src={Icons.homepageimage}
              alt="Welcome illustration"
              className="w-72 h-72"
            />
          </div>
        </div>

        {/* Your Products Section */}
        <OrganizationProductCard />
        {/* Recent Section */}
        <div>
          <h2 className="text-heading-2 mb-2">Recent</h2>

          <div className="space-y-2 cursor-pointer">
            {/* {
              orgs.length === 0 && (
                <>
                  <p className='flex justify-center align-middle'>No Recent Activity</p>
                </>
              )
            } */}
            {/* Will Make this Dynamic Once Recent Is Implemented */}
            {/* {orgs.map((org: any, i)= => (
              <OrgCard key={i} {...org} />
            ))} */}
          </div>
        </div>

        {/* What's New Section */}
        <div className="bg-white border border-gray-200 rounded p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            {/* Left Side */}
            <div>
              <h3 className="text-heading-3 font-bold text-black mb-2">
                What's New
              </h3>
              <p className="text-body-small text-gray-600">
                Check out our latest updates and features
              </p>
            </div>

            {/* Right Side */}
            <button onClick={() => {
              window.location.href = '/view-all-product'
            }} className="w-full sm:w-auto text-white text-body-small px-3 py-2 rounded hover:opacity-90 transition-opacity cursor-pointer bg-[#795CF5]">
              Explore All Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

