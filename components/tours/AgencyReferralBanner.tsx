type Props = {
  name: string;
  logoUrl: string | null;
};

export function AgencyReferralBanner({ name, logoUrl }: Props) {
  return (
    <div className="bg-white border-b border-[#E2E8ED]">
      <div className="container mx-auto px-4 py-3 flex items-center gap-3">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt={name}
            className="w-9 h-9 rounded-full object-cover shrink-0 border border-[#E2E8ED]"
          />
        ) : null}
        <p className="text-sm font-body text-[#0D1B3D]">
          Estás viendo esta página gracias a{" "}
          <span className="font-semibold">{name}</span>
        </p>
      </div>
    </div>
  );
}
