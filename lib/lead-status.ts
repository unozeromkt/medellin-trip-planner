export const LEAD_STATUS_LABEL: Record<string, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  quoted: "Cotizado",
  reserved: "Reservado",
  won: "Ganado",
  lost: "Perdido",
  cancelled: "Cancelado",
};

export const LEAD_STATUS_OPTIONS = Object.entries(LEAD_STATUS_LABEL).map(([value, label]) => ({ value, label }));
