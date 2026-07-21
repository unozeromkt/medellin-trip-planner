"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Currency = "COP" | "USD";

const STORAGE_KEY = "mtp-currency";
const FALLBACK_RATE = 4200;

interface CurrencyState {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  toggleCurrency: () => void;
  rate: number;
  formatPrice: (priceCOP: number) => string;
}

const CurrencyContext = createContext<CurrencyState | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("COP");
  const [rate, setRate] = useState(FALLBACK_RATE);

  useEffect(() => {
    // Deliberately reading localStorage post-mount (not in the initializer) so the
    // first client render matches the server-rendered "COP" default and avoids a
    // hydration mismatch; the resulting extra render is an accepted, known tradeoff.
    const stored = window.localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored === "COP" || stored === "USD") setCurrencyState(stored);
  }, []);

  useEffect(() => {
    fetch("/api/exchange-rate")
      .then((res) => res.json())
      .then((data: { rate: number }) => {
        if (Number.isFinite(data.rate) && data.rate > 0) setRate(data.rate);
      })
      .catch(() => {});
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    window.localStorage.setItem(STORAGE_KEY, c);
  }, []);

  const toggleCurrency = useCallback(() => {
    setCurrency(currency === "COP" ? "USD" : "COP");
  }, [currency, setCurrency]);

  const formatPrice = useCallback(
    (priceCOP: number) => {
      if (currency === "USD") {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(priceCOP / rate);
      }
      return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      }).format(priceCOP);
    },
    [currency, rate]
  );

  const value = useMemo(
    () => ({ currency, setCurrency, toggleCurrency, rate, formatPrice }),
    [currency, setCurrency, toggleCurrency, rate, formatPrice]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyState {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
}
