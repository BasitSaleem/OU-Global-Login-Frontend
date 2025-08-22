import DashboardLayout from '@/components/layout/dashboard-layout';

function NotificationsPage() {
  const sidebarFilters = [
    { id: 'all', label: 'All', active: true },
    { id: 'today', label: 'Today', active: false }
  ];

  const productFilters = [
    { id: 'all-products', label: 'All Products', active: false },
    { id: 'owners-inventory', label: 'Owners Inventory', active: false },
    { id: 'owners-marketplace', label: 'Owners Marketplace', active: true }
  ];

  const notifications = [
    {
      id: 1,
      avatar: 'BS',
      avatarColor: '#137F6A',
      name: 'Basit Saleem',
      action: 'updated a page',
      title: 'Owners AI Bot',
      subtitle: 'Al-Asif • Owners Inventory',
      updates: '+3 updates from Basit Saleem',
      time: 'Just now',
      hasUnreadDot: true,
      hasMarkAsRead: true
    },
    {
      id: 2,
      avatar: 'JS',
      avatarColor: '#B11E67',
      name: 'John Smith',
      action: 'updated a page',
      title: 'Editors AI Bot',
      subtitle: 'Sportifi • Owners Inventory',
      updates: '+2 updates from John Smith',
      time: '2 mins ago',
      hasUnreadDot: true,
      hasMarkAsRead: false
    },
    {
      id: 3,
      avatar: 'AS',
      avatarColor: '#1AD1B9',
      name: 'Alice Sanders',
      action: 'updated a page',
      title: 'Managers AI Bot',
      subtitle: 'RS-Managers-Inventory',
      updates: '+1 update from Alice Sanders',
      time: '1 days ago',
      hasUnreadDot: false,
      hasMarkAsRead: false
    },
    {
      id: 4,
      avatar: 'TH',
      avatarColor: '#FF7C3B',
      name: 'Tom Hanks',
      action: 'updated a page',
      title: 'Admins AI Bot',
      subtitle: 'RS-Admins-Inventory',
      updates: '+5 updates from Tom Hanks',
      time: '1 week ago',
      hasUnreadDot: false,
      hasMarkAsRead: false
    },
    {
      id: 5,
      avatar: 'DS',
      avatarColor: '#F95C5B',
      name: 'David Smith',
      action: 'updated a page',
      title: 'Supervisors AI Bot',
      subtitle: 'RS-Supervisors-Inventory',
      updates: '+4 updates from David Smith',
      time: '2 weeks ago',
      hasUnreadDot: true,
      hasMarkAsRead: false
    },
    {
      id: 6,
      avatar: 'EM',
      avatarColor: '#795CF5',
      name: 'Emma Moore',
      action: 'updated a page',
      title: 'Developers AI Bot',
      titleColor: '#795CF5',
      subtitle: 'RS-Developers-Inventory',
      updates: '+6 updates from Emma Moore',
      updatesColor: '#795CF5',
      time: '1 month ago',
      hasUnreadDot: true,
      hasMarkAsRead: false
    }
  ];

  return (
    <div className="flex bg-white">
      {/* Left Sidebar */}
      <div className="w-[281px] border-r border-gray-200 flex flex-col">
        <div className="p-8 pb-10">
          <h1 className="text-2xl font-bold text-black mb-6">Notifications</h1>
          
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {sidebarFilters.map((filter) => (
              <button
                key={filter.id}
                className={`px-4 py-2 rounded-lg text-base transition-colors ${
                  filter.active
                    ? 'text-primary'
                    : 'text-black hover:bg-gray-50'
                }`}
                style={filter.active ? { backgroundColor: 'rgba(121, 92, 245, 0.07)' } : {}}
              >
                {filter.label}
              </button>
            ))}
          </div>
          
          {/* Products Section */}
          <div>
            <h3 className="text-base font-medium text-black mb-2">PRODUCTS</h3>
            <div className="space-y-1">
              {productFilters.map((product) => (
                <button
                  key={product.id}
                  className={`w-full text-left px-3 py-2 rounded-lg text-base transition-colors ${
                    product.active
                      ? 'text-primary'
                      : 'text-black hover:bg-gray-50'
                  }`}
                  style={product.active ? { backgroundColor: 'rgba(121, 92, 245, 0.07)' } : {}}
                >
                  {product.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Fixed Header */}
        <div className="p-8 pb-6 border-b border-gray-100 bg-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-black">Latest</h2>
            <div className="flex items-center gap-4">
              <button className="text-primary text-base font-medium hover:underline">
                Mark all as read
              </button>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-base">Only show unread</span>
                <div className="w-12 h-6 bg-gray-200 rounded-full p-1 cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full transition-transform"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Notifications List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 pt-6">
            <div className="space-y-6">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-start gap-6">
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-medium flex-shrink-0"
                    style={{ backgroundColor: notification.avatarColor }}
                  >
                    {notification.avatar}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-base text-black">
                        <span className="font-medium">{notification.name}</span> {notification.action}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-base text-gray-500">{notification.time}</span>
                        {notification.hasUnreadDot && (
                          <div className="relative">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#795CF5' }}></div>
                            <div className="absolute -inset-2 border border-gray-200 rounded-full"></div>
                          </div>
                        )}
                        {notification.hasMarkAsRead && (
                          <button className="px-1.5 py-1.5 text-sm text-black border border-gray-200 rounded bg-white hover:bg-gray-50 transition-colors">
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                    <h4
                      className="text-base font-medium mb-1"
                      style={{ color: notification.titleColor || '#231F20' }}
                    >
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-500 mb-2">{notification.subtitle}</p>
                    <p
                      className="text-sm font-bold"
                      style={{ color: notification.updatesColor || '#6B7280' }}
                    >
                      {notification.updates}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <DashboardLayout>
      <NotificationsPage />
    </DashboardLayout>
  );
}
