type organizations = {
    initials: string;
    color: string;
    title: string;
    subtitle: string;
}

const OrgCard: React.FC<organizations> = ({ initials, color, title, subtitle }) => {
  return (
    <div className="bg-white border border-gray-200 rounded p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2">
        {/* Icon */}
        <div
          className="w-7 h-7 rounded flex items-center justify-center"
          style={{ backgroundColor: color }}
        >
          <span className="text-white text-body-small font-medium">{initials}</span>
        </div>

        {/* Info */}
        <div>
          <h4 className="text-body-medium-bold">{title}</h4>
          <p className="text-body-small text-gray-600">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default OrgCard;
