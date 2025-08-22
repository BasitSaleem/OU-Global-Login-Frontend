import DashboardLayout from '@/components/layout/dashboard-layout';
import { Check, X } from 'lucide-react';

function OrganizationsContent() {
  const organizations = [
    {
      id: 'add-new',
      isAddNew: true
    },
    {
      id: 'post-purchase',
      name: 'Post Purchase Management App',
      abbreviation: 'PP',
      backgroundColor: '#137F6A',
      members: 22,
      teamAvatars: [
        'https://api.builder.io/api/v1/image/assets/TEMP/7fd2f890b4abf6aa5cd76445ffcc9957a83e42e3?width=45',
        'https://api.builder.io/api/v1/image/assets/TEMP/eeba95fb24805ac80d3b36cb6a990d34b4176828?width=44',
        'https://api.builder.io/api/v1/image/assets/TEMP/7000f111604e6213be239f655b1f14bf7339f909?width=44',
        'https://api.builder.io/api/v1/image/assets/TEMP/584fddd84549d988e9433a787ad9fc197c0238e1?width=45'
      ]
    },
    {
      id: 'marketing',
      name: 'Marketing',
      abbreviation: 'M',
      backgroundColor: '#F95C5B',
      members: 22,
      teamAvatars: [
        'https://api.builder.io/api/v1/image/assets/TEMP/7fd2f890b4abf6aa5cd76445ffcc9957a83e42e3?width=45',
        'https://api.builder.io/api/v1/image/assets/TEMP/eeba95fb24805ac80d3b36cb6a990d34b4176828?width=44',
        'https://api.builder.io/api/v1/image/assets/TEMP/7000f111604e6213be239f655b1f14bf7339f909?width=44'
      ]
    },
    {
      id: 'al-asif',
      name: 'Al-Asif Interiors',
      abbreviation: 'AI',
      backgroundColor: '#B11E67',
      members: 22,
      teamAvatars: [
        'https://api.builder.io/api/v1/image/assets/TEMP/7fd2f890b4abf6aa5cd76445ffcc9957a83e42e3?width=45',
        'https://api.builder.io/api/v1/image/assets/TEMP/eeba95fb24805ac80d3b36cb6a990d34b4176828?width=44',
        'https://api.builder.io/api/v1/image/assets/TEMP/7000f111604e6213be239f655b1f14bf7339f909?width=44',
        'https://api.builder.io/api/v1/image/assets/TEMP/584fddd84549d988e9433a787ad9fc197c0238e1?width=45'
      ]
    },
    {
      id: 'operations',
      name: 'Operations',
      abbreviation: 'O',
      backgroundColor: '#1AD1B9',
      members: 22,
      teamAvatars: [
        'https://api.builder.io/api/v1/image/assets/TEMP/7fd2f890b4abf6aa5cd76445ffcc9957a83e42e3?width=45',
        'https://api.builder.io/api/v1/image/assets/TEMP/eeba95fb24805ac80d3b36cb6a990d34b4176828?width=44',
        'https://api.builder.io/api/v1/image/assets/TEMP/7000f111604e6213be239f655b1f14bf7339f909?width=44'
      ]
    },
    {
      id: 'spotify',
      name: 'Spotify',
      abbreviation: 'S',
      backgroundColor: '#795CF5',
      members: 22,
      teamAvatars: [
        'https://api.builder.io/api/v1/image/assets/TEMP/7fd2f890b4abf6aa5cd76445ffcc9957a83e42e3?width=45',
        'https://api.builder.io/api/v1/image/assets/TEMP/eeba95fb24805ac80d3b36cb6a990d34b4176828?width=44',
        'https://api.builder.io/api/v1/image/assets/TEMP/7000f111604e6213be239f655b1f14bf7339f909?width=44',
        'https://api.builder.io/api/v1/image/assets/TEMP/584fddd84549d988e9433a787ad9fc197c0238e1?width=45'
      ]
    },
    {
      id: 'brandscope',
      name: 'Brandscope',
      abbreviation: 'B',
      backgroundColor: '#FF7C3B',
      members: 22,
      teamAvatars: [
        'https://api.builder.io/api/v1/image/assets/TEMP/7fd2f890b4abf6aa5cd76445ffcc9957a83e42e3?width=45',
        'https://api.builder.io/api/v1/image/assets/TEMP/eeba95fb24805ac80d3b36cb6a990d34b4176828?width=44'
      ]
    },
    {
      id: 'red-star',
      name: 'Red Star Technologies',
      abbreviation: 'RS',
      backgroundColor: '#137F6A',
      members: 22,
      teamAvatars: [
        'https://api.builder.io/api/v1/image/assets/TEMP/7fd2f890b4abf6aa5cd76445ffcc9957a83e42e3?width=45'
      ]
    },
    {
      id: 'wallace',
      name: 'Wallace Willer McLeod Project Management Web...',
      abbreviation: 'WW',
      backgroundColor: '#795CF5',
      members: 22,
      teamAvatars: [
        'https://api.builder.io/api/v1/image/assets/TEMP/7fd2f890b4abf6aa5cd76445ffcc9957a83e42e3?width=45',
        'https://api.builder.io/api/v1/image/assets/TEMP/eeba95fb24805ac80d3b36cb6a990d34b4176828?width=44',
        'https://api.builder.io/api/v1/image/assets/TEMP/7000f111604e6213be239f655b1f14bf7339f909?width=44',
        'https://api.builder.io/api/v1/image/assets/TEMP/584fddd84549d988e9433a787ad9fc197c0238e1?width=45'
      ]
    }
  ];

  const pendingInvitations = [
    {
      id: 'al-asif-exteriors',
      name: 'Al-Asif Exteriors',
      abbreviation: 'AE',
      backgroundColor: '#B11E67',
      invitedBy: 'Sarah Chen',
      product: 'Owners Inventory',
      timeAgo: '2 hours ago'
    },
    {
      id: 'sales-dept',
      name: 'Sales Department',
      abbreviation: 'SD',
      backgroundColor: '#1AD1B9',
      invitedBy: 'Mike Wilson',
      product: 'Owners Marketplace',
      timeAgo: '2 hours ago'
    },
    {
      id: 'space-group',
      name: 'Space Group',
      abbreviation: 'SG',
      backgroundColor: '#F95C5B',
      invitedBy: 'Wilson',
      product: 'Owners Inventory',
      timeAgo: '2 hours ago'
    }
  ];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Your Organizations Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-black">Your Organizations</h1>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium" style={{ backgroundColor: '#795CF5' }}>
                {organizations.length - 1}
              </div>
            </div>
            <button className="text-primary text-base font-medium hover:underline">
              View More
            </button>
          </div>
          
          {/* Organizations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map((org) => (
              <div key={org.id} className={`${org.isAddNew ? '' : 'bg-white border border-gray-200'} rounded-lg ${org.isAddNew ? '' : 'p-6'}  hover:shadow-sm transition-shadow`}>
                {org.isAddNew ? (
                  /* Add New Card */
                  <div
                    className="flex flex-col items-center justify-center text-center h-full rounded-lg"
                    style={{ backgroundColor: 'rgba(121, 92, 245, 0.07)' }}
                  >
                    <div className="mb-4">
                      <svg width="71" height="71" viewBox="0 0 71 71" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M35.5 14.791V56.2077" stroke="#795CF5" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14.7915 35.5H56.2082" stroke="#795CF5" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-base font-medium text-primary">Add New</span>
                  </div>
                ) : (
                  /* Organization Card */
                  <div className="flex flex-col h-full">
                    {/* Top section with logo, name and star */}
                    <div className="flex items-start gap-4 mb-6">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-lg font-medium"
                        style={{ backgroundColor: org.backgroundColor }}
                      >
                        {org.abbreviation}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-black leading-tight">{org.name}</h3>
                      </div>
                      <div className="flex-shrink-0">
                        <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.04894 0.92705C7.3483 0.00573924 8.6517 0.00573965 8.95106 0.92705L10.0206 4.21885C10.1545 4.63087 10.5385 4.90983 10.9717 4.90983H14.4329C15.4016 4.90983 15.8044 6.14945 15.0207 6.71885L12.2205 8.75329C11.87 9.00793 11.7234 9.4593 11.8572 9.87132L12.9268 13.1631C13.2261 14.0844 12.1717 14.8506 11.388 14.2812L8.58779 12.2467C8.2373 11.9921 7.7627 11.9921 7.41221 12.2467L4.61204 14.2812C3.82833 14.8506 2.77385 14.0844 3.0732 13.1631L4.14277 9.87132C4.27665 9.4593 4.12999 9.00793 3.7795 8.75329L0.979333 6.71885C0.195619 6.14945 0.598395 4.90983 1.56712 4.90983H5.02832C5.46154 4.90983 5.8455 4.63087 5.97937 4.21885L7.04894 0.92705Z" fill="#795CF5"/>
                        </svg>
                      </div>
                    </div>

                    {/* Bottom purple section */}
                    <div className="mt-auto">
                      <div
                        className="flex items-center justify-between px-4 py-2 rounded-lg"
                        style={{ backgroundColor: 'rgba(121, 92, 245, 0.07)' }}
                      >
                        <span className="text-base font-medium text-primary">{org.members} members</span>
                        <div className="flex items-center -space-x-1">
                          {org.teamAvatars?.map((avatarUrl, index) => (
                            <img
                              key={index}
                              src={avatarUrl}
                              alt={`Team member ${index + 1}`}
                              className="w-6 h-6 rounded-full border-2 border-white"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pending Invitations Section */}
        <div>
          <h2 className="text-xl font-bold text-black mb-6">Pending Invitations</h2>
          
          <div className="space-y-4">
            {pendingInvitations.map((invitation) => (
              <div key={invitation.id} className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-lg font-medium"
                    style={{ backgroundColor: invitation.backgroundColor }}
                  >
                    {invitation.abbreviation}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-black">{invitation.name}</h3>
                    <p className="text-sm text-gray-500">
                      Invited by {invitation.invitedBy} • {invitation.product} • {invitation.timeAgo}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity" style={{ backgroundColor: '#795CF5' }}>
                    <Check className="w-4 h-4" />
                    Accept
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <X className="w-4 h-4" />
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <DashboardLayout>
      <OrganizationsContent />
    </DashboardLayout>
  );
}
