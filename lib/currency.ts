const TRM_ENDPOINT =
  "https://www.datos.gov.co/resource/32sa-8pi3.json?$limit=1&$order=vigenciadesde%20DESC";

const MARKUP = 0.05;
const FALLBACK_TRM = 4000;

export interface ExchangeRateData {
  trm: number;
  rate: number;
  markup: number;
  source: "banrep" | "fallback";
  updatedAt: string;
}

export async function getExchangeRate(): Promise<ExchangeRateData> {
  try {
    const res = await fetch(TRM_ENDPOINT, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`TRM request failed with status ${res.status}`);

    const [entry] = (await res.json()) as { valor: string; vigenciadesde: string }[];
    const trm = Number(entry?.valor);
    if (!Number.isFinite(trm) || trm <= 0) throw new Error("Invalid TRM value received");

    return {
      trm,
      rate: Math.round(trm * (1 + MARKUP) * 100) / 100,
      markup: MARKUP,
      source: "banrep",
      updatedAt: entry.vigenciadesde,
    };
  } catch {
    return {
      trm: FALLBACK_TRM,
      rate: Math.round(FALLBACK_TRM * (1 + MARKUP) * 100) / 100,
      markup: MARKUP,
      source: "fallback",
      updatedAt: new Date().toISOString(),
    };
  }
}
