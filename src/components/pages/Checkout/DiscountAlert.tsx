const DiscountAlert = ({ yearlySavings }: { yearlySavings: string }) => {
  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-6">
      <p className="text-sm text-green-700 font-medium text-center">
        🎉 You save ${yearlySavings}/year with annual billing!
      </p>
    </div>
  );
};

export default DiscountAlert;
