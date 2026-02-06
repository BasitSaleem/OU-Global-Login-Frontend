import { CheckCircle } from "lucide-react"; // assuming you're using feather icons
import { FiCircle } from "react-icons/fi";   // optional for the dot icon

const ChangePasswordRuleItem = ({
  valid,
  children,
}: {
  valid: boolean;
  children: React.ReactNode;
}) => (
  <li
    className={`flex items-center gap-2 transition-colors ${
      valid ? "text-primary" : "text-body-small"
    }`}
  >
    {valid ? (
      <CheckCircle size={16} className="text-primary" />
    ) : (
       <FiCircle size={16} className="text-gray-400" />
    )}
    <span>{children}</span>
  </li>
);


export default ChangePasswordRuleItem