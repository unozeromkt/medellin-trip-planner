"use client";

import { ExperienceBuilderProvider } from "@/lib/experience-builder-context";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return <ExperienceBuilderProvider>{children}</ExperienceBuilderProvider>;
}
