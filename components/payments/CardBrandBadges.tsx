export function CardBrandBadges({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className ?? ""}`}>
      <span className="inline-flex items-center justify-center h-5 px-1.5 rounded bg-white border border-[#E2E8ED] text-[10px] font-bold italic text-[#1A1F71]">
        VISA
      </span>
      <span className="inline-flex items-center justify-center h-5 w-7 rounded bg-white border border-[#E2E8ED]">
        <svg viewBox="0 0 36 24" className="h-3.5 w-5" aria-label="Mastercard">
          <circle cx="14" cy="12" r="7" fill="#EB001B" />
          <circle cx="22" cy="12" r="7" fill="#F79E1B" fillOpacity="0.85" />
        </svg>
      </span>
      <span className="inline-flex items-center justify-center h-5 px-1.5 rounded bg-[#2E77BC] text-[9px] font-bold text-white tracking-wide">
        AMEX
      </span>
    </div>
  );
}
