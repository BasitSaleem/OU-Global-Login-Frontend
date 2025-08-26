

type organizations = {
    initials: string;
    color: string;
    title: string;
    subtitle: string;
}

const OrgCard: React.FC<organizations> = ({ initials, color, title, subtitle }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: color }}
        >
          <span className="text-white text-base font-medium">{initials}</span>
        </div>

        {/* Info */}
        <div>
          <h4 className="text-base font-medium">{title}</h4>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default OrgCard;



