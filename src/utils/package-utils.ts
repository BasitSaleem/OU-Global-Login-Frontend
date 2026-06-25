export const returnPackageName = (planName: string) => {
  if (planName.toUpperCase().includes("PRO")) {
    return "Pro";
  }
  if (planName.toUpperCase().includes("BUSINESS")) {
    return "Business";
  }
  if (planName.toUpperCase().includes("BASIC")) {
    return "Basic";
  }
  if (planName.toUpperCase().includes("PREMIUM")) {
    return "Enterprise";
  }
  if (planName.toUpperCase().includes("ENTERPRISE")) {
    return "Enterprise";
  }
  return "Plan";
};

export const getPlanTextColor = ({
  isBasic,
  isPro,
  isBusiness,
  isEnterprise,
}: {
  isBasic?: boolean;
  isPro?: boolean;
  isBusiness?: boolean;
  isEnterprise?: boolean;
}) => {
  if (isBasic) {
    return "text-[#1AD1B9]";
  }

  if (isPro || isBusiness) {
    return "text-[#38ACCC]";
  }

  if (isEnterprise) {
    return "text-[#5588DF]";
  }

  return "text-[#1AD1B9]";
};
