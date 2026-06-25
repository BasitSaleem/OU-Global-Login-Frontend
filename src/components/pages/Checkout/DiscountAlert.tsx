import Image from "next/image";

const DiscountAlert = ({ yearlySavings }: { yearlySavings: string }) => {
  return (
    <div className="relative mb-6 overflow-hidden rounded-xl border border-primary/20 bg-primary/5 p-3 sm:p-4 transition-colors hover:bg-primary/10">
      <div className="flex items-center justify-center gap-3">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white shadow-sm border border-primary/10">
          <Image
            src="/save.gif"
            alt="Discount savings"
            width={100}
            height={100}
            className="object-contain select-none mix-blend-multiply"
            unoptimized
          />
        </div>
        <p className="text-sm sm:text-[15px] font-medium text-primary m-0">
          You save <span className="font-bold">${yearlySavings}</span>/year with annual billing!
        </p>
      </div>
    </div>
  );
};

export default DiscountAlert;
