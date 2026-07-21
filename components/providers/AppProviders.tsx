"use client";

import { ExperienceBuilderProvider } from "@/lib/experience-builder-context";
import { CurrencyProvider } from "@/lib/currency-context";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <CurrencyProvider>
      <ExperienceBuilderProvider>{children}</ExperienceBuilderProvider>
    </CurrencyProvider>
  );
}
