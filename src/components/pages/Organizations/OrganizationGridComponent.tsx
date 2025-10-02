function newFunction(org: OgOrganization, isPending: boolean, handleFavoriteClick: (e: React.MouseEvent, orgId: string) => void, user: User | null, handleDeleteClick: (org: any) => void): React.ReactNode {
  return <div className="flex flex-col h-[100px]">
    {/* Top section */}
    <div className="flex items-start gap-3 mb-2">
      <div
        className="w-10 h-10 rounded flex items-center justify-center text-white text-body-small font-medium"
        style={{ backgroundColor: "#137F6A" }}
      >
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="truncate text-body-medium-bold text-black leading-tight pt-3">
          {org?.name}
        </h3>
      </div>
      <div className="flex-shrink-0">
        <button
          className=" z-40 hover:scale-110 duration-300"
          disabled={isPending}
          onClick={(e) => {
            handleFavoriteClick(e, org.id);
          } }
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill={org?.favorites?.some((fUser) => fUser.userId === user?.id)
              ? "#795CF5" // filled
              : "none" // empty
            }
            stroke="#795CF5"
            strokeWidth="1.5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.04907 2.92705C9.34843 2.00574 10.6518 2.00574 10.9511 2.92705L12.0207 6.21885C12.1546 6.63087 12.5386 6.90983 12.9718 6.90983H16.433C17.4017 6.90983 17.8045 8.14945 17.0208 8.71885L14.2206 10.7533C13.8701 11.0079 13.7235 11.4593 13.8573 11.8713L14.9269 15.1631C15.2263 16.0844 14.1718 16.8506 13.3881 16.2812L10.5879 14.2467C10.2374 13.9921 9.76279 13.9921 9.4123 14.2467L6.61213 16.2812C5.82842 16.8506 4.77394 16.0844 5.07329 15.1631L6.14286 11.8713C6.27673 11.4593 6.13007 11.0079 5.77958 10.7533L2.97941 8.71885C2.19569 8.14945 2.59847 6.90983 3.56719 6.90983H7.02839C7.46161 6.90983 7.84557 6.63087 7.97944 6.21885L9.04907 2.92705Z" />
          </svg>

        </button>
        <button
          className="z-40 hover:scale-110 duration-300"
          disabled={isPending}
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteClick(org.id);
          } }
        >
          <Trash color="red" fill="red" size={20} />
        </button>
      </div>
    </div>

    {/* Bottom purple section */}
    <div className="mt-auto">
      <div
        className="flex items-center justify-between px-2 py-1.5 rounded"
        style={{ backgroundColor: "rgba(121, 92, 245, 0.07)" }}
      >
        <span className="text-body-small font-medium text-primary">
          {org?.memberships?.length} members
        </span>
        <div className="flex items-center -space-x-0.5">
          {org?.products?.map((product, index) => (
            <img
              key={index}
              src={product.imageUrl ?? "/placeholder.png"}
              alt={product.name}
              className="w-6 h-6 rounded-full border border-white" />
          ))}
        </div>
      </div>
    </div>
  </div>;
}