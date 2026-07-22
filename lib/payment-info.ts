export type PaymentMethodId = "bancolombia" | "nequi" | "llave" | "pse";

export type PaymentMethodInfo = {
  id: PaymentMethodId;
  label: string;
  enabled: boolean;
  note?: string;
  fields: { label: string; value: string }[];
};

export const PAYMENT_METHODS: PaymentMethodInfo[] = [
  {
    id: "bancolombia",
    label: "Bancolombia",
    enabled: true,
    fields: [
      { label: "Titular", value: "Medellín Trip Planner SAS" },
      { label: "NIT", value: "901.234.567-8" },
      { label: "Tipo de cuenta", value: "Cuenta de ahorros" },
      { label: "Número de cuenta", value: "123-456789-01" },
    ],
  },
  {
    id: "nequi",
    label: "Nequi",
    enabled: true,
    fields: [
      { label: "Titular", value: "Medellín Trip Planner SAS" },
      { label: "Número Nequi", value: "300 123 4567" },
    ],
  },
  {
    id: "llave",
    label: "Llave (Bre-B)",
    enabled: true,
    fields: [
      { label: "Titular", value: "Medellín Trip Planner SAS" },
      { label: "Llave", value: "@medellintripplanner" },
    ],
  },
  {
    id: "pse",
    label: "PSE",
    enabled: false,
    note: "Próximamente",
    fields: [],
  },
];

export function getPaymentMethod(id: string | null | undefined): PaymentMethodInfo | undefined {
  return PAYMENT_METHODS.find((m) => m.id === id);
}
