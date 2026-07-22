export type CountryCode = { code: string; label: string };

export const COUNTRY_CODES: CountryCode[] = [
  { code: "+57", label: "Colombia (+57)" },
  { code: "+52", label: "México (+52)" },
  { code: "+1", label: "EE.UU./Canadá (+1)" },
  { code: "+34", label: "España (+34)" },
  { code: "+54", label: "Argentina (+54)" },
  { code: "+55", label: "Brasil (+55)" },
  { code: "+51", label: "Perú (+51)" },
  { code: "+593", label: "Ecuador (+593)" },
  { code: "+56", label: "Chile (+56)" },
  { code: "+507", label: "Panamá (+507)" },
  { code: "+506", label: "Costa Rica (+506)" },
  { code: "+0", label: "Otro" },
];

export const DEFAULT_COUNTRY_CODE = "+57";
