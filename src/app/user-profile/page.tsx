'use client';
import { useUpdateProfile } from '@/apiHooks.ts/auth/auth.api';
import { userProfile } from '@/apiHooks.ts/auth/auth.types';
import { Button, Input } from '@/components/ui';
import ImageUpload from '@/components/UploadImage';
import { setProfile } from '@/redux/slices/auth.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { User } from '@/types/auth.types';
import { useEffect, useRef, useState, useMemo, RefObject } from 'react';
import isEqual from 'lodash/isEqual';
import { Check, Image as ImageIcon } from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutSide';
export default function UserProfilePage() {
  const [uiState, setUiState] = useState({
    sidebarCollapsed: false,
    mobileSidebarOpen: false,
    profileDropdownOpen: false,
    notificationsOpen: false,
    isUploading: false
  });

  const { mutate: updateUser, isPending, isError } = useUpdateProfile()
  const { user } = useAppSelector((s) => s.auth)
  console.log(user, 'user data');
  const [userData, setUserData] = useState<userProfile>({
    profile_url: user?.profile_url,
    first_name: user?.first_name,
    last_name: user?.last_name,
    contact: user?.contact,
    street_address: user?.street_address,
    city: user?.city,
    state: user?.state,
    zip_code: user?.zip_code,
    country: user?.country,
    tax_vat_number: user?.tax_vat_number,
    emergency_contact_name: user?.emergency_contact_name,
    emergency_contact_no: user?.emergency_contact_no

  });
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const originalData = useRef<userProfile | null>(null);

  useEffect(() => {
    if (user && !originalData.current) {
      originalData.current = {
        profile_url: user?.profile_url,
        first_name: user?.first_name,
        last_name: user?.last_name,
        contact: user?.contact,
        street_address: user?.street_address,
        city: user?.city,
        state: user?.state,
        zip_code: user?.zip_code,
        country: user?.country,
        tax_vat_number: user?.tax_vat_number,
        emergency_contact_name: user?.emergency_contact_name,
        emergency_contact_no: user?.emergency_contact_no
      };
    }
  }, [user]);

  const isChanged = useMemo(() => {
    if (!originalData.current) return false;
    return !isEqual(originalData.current, userData);
  }, [userData]);

  const dispatch = useAppDispatch()
  useClickOutside(
    [profileDropdownRef as RefObject<HTMLDivElement>, notificationsRef as RefObject<HTMLDivElement>],
    () => {
      setUiState(prev => ({
        ...prev,
        profileDropdownOpen: false,
        notificationsOpen: false
      }));
    }
  );

  const handleInputChange = (field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      ...(prev),
      [field]: value
    }));
  };
  const handleSaveChanges = async () => {
    setUiState(prev => ({ ...prev, isUploading: true }));
    updateUser(userData)
    dispatch(setProfile({ ...userData, email: user?.email, id: user?.id, role_id: user?.role_id, role: user?.role, status: user?.status } as User))
  };
  return (
    <div className="min-h-screen w-full bg-background flex font-inter">
      <main className="flex-1">
        <div className="flex flex-col sm:flex-row items-start gap-5 p-8">
          <div className="flex flex-col mx-auto w-full md:w-[286px] gap-3 p-3 border rounded-lg bg-bg-secondary shadow-sm py-5">
            <div className="flex flex-col items-center gap-7">
              {userData.profile_url || user?.profile_url ? (
                <div className="relative">
                  <img
                    src={userData.profile_url || user?.profile_url}
                    alt="Profile"
                    className="w-23 h-23 rounded-full object-cover border-2 border-primary"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1 border-2 border-white">
                    <Check color='white' size={15} />
                  </div>
                </div>
              ) : (
                <div className="w-23 h-23 rounded-full flex items-center justify-center bg-[#795CF512]">
                  <ImageIcon color='gray' />
                </div>
              )}

              <div className="w-full">
                <ImageUpload
                  onUploadComplete={(imageUrl: string) => {
                    const freshUrl = `${imageUrl}?t=${Date.now()}`;
                    setUserData(prev => ({ ...prev, profile_url: freshUrl }));
                  }}
                  maxSize={2}
                  acceptedFiles="image/jpeg,image/png,image/webp"
                  id={user?.id!}
                />
              </div>
            </div>

            {/* User Details */}
            <div className="space-y-5 flex flex-col justify-center ml-6">
              <div>
                <label className="text-body-small">Name</label>
                <p className="text-body-medium-bold">
                  {userData.first_name} {userData.last_name}
                </p>
              </div>
              <div>
                <label className="text-body-small">Email</label>
                <p className="text-body-medium-bold">{user?.email}</p>
              </div>
              <div>
                <label className="text-body-small">Contact</label>
                <p className="text-body-medium-bold">{user?.contact ?? "0145678"}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 border rounded-lg w-full bg-bg-secondary shadow-sm">
            <div className="flex items-center justify-between p-5 border-b">
              <h1 className="text-heading-1 font-bold text-black">Profile Information</h1>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-8">
              {/* Basic Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <Input
                  label="First Name"
                  isRequired
                  permission="og:edit::profile"
                  type="text"
                  value={userData.first_name}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                />

                <Input
                  isRequired
                  permission="og:edit::profile"
                  label="Last Name"
                  type="text"
                  value={userData.last_name}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                />

                <Input
                  label="Email"
                  permission="og:edit::profile"
                  isRequired
                  type="email"
                  value={user?.email}
                  disabled
                // onChange={(e) => handleInputChange('email', e.target.value)}
                />

                <Input
                  label="Contact"
                  permission="og:edit::profile"
                  isRequired
                  type="tel"
                  value={userData?.contact ?? ""}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                />
              </div>

              {/* Address Information */}
              <div>
                <h2 className="text-heading-2 font-bold text-black mb-2">Address Information</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <Input
                    label="Street Address"
                    permission="og:edit::profile"
                    type="text"
                    value={userData?.street_address ?? ""}
                    onChange={(e) => handleInputChange('street_address', e.target.value)}
                  />

                  <Input
                    label="City"
                    permission="og:edit::profile"
                    type="text"
                    value={userData?.city ?? ""}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />

                  <Input
                    label="State"
                    permission="og:edit::profile"
                    type="text"
                    value={userData?.state ?? ""}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                  />

                  <Input
                    label="Zip Code"
                    permission="og:edit::profile"
                    type="text"
                    value={userData?.zip_code ?? ""}
                    onChange={(e) => handleInputChange('zip_code', e.target.value)}
                  />

                  <Input
                    label="Country"
                    permission="og:edit::profile"
                    type="text"
                    value={userData?.country ?? ""}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                  />

                  <Input
                    label="Tax/VAT Number"
                    permission="og:edit::profile"
                    type="tel"
                    value={userData?.tax_vat_number ?? ""}
                    onChange={(e) => handleInputChange('tax_vat_number', e.target.value)}
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h2 className="text-heading-2 font-bold text-black mb-2">Emergency Contact</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <Input
                    label="Emergency Contact Name"
                    permission="og:edit::profile"
                    type="text"
                    value={userData?.emergency_contact_name ?? ""}
                    onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                  />

                  <Input
                    label="Emergency Contact Number"
                    permission="og:edit::profile"
                    type="tel"
                    value={userData?.emergency_contact_no ?? ""}
                    onChange={(e) => handleInputChange('emergency_contact_no', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="primary"
                  permission="og:edit::profile"
                  onClick={handleSaveChanges}
                  disabled={isPending || !isChanged}
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}