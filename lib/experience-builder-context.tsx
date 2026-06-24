"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { TourSummary } from "./types";

interface ExperienceBuilderState {
  selectedTours: TourSummary[];
  addTour: (tour: TourSummary) => void;
  removeTour: (tourId: string) => void;
  isSelected: (tourId: string) => boolean;
  clearAll: () => void;
  totalPrice: number;
  totalDurationMinutes: number;
}

const ExperienceBuilderContext = createContext<ExperienceBuilderState | null>(null);

export function ExperienceBuilderProvider({ children }: { children: ReactNode }) {
  const [selectedTours, setSelectedTours] = useState<TourSummary[]>([]);

  const addTour = useCallback((tour: TourSummary) => {
    setSelectedTours((prev) =>
      prev.some((t) => t.id === tour.id) ? prev : [...prev, tour]
    );
  }, []);

  const removeTour = useCallback((tourId: string) => {
    setSelectedTours((prev) => prev.filter((t) => t.id !== tourId));
  }, []);

  const isSelected = useCallback(
    (tourId: string) => selectedTours.some((t) => t.id === tourId),
    [selectedTours]
  );

  const clearAll = useCallback(() => setSelectedTours([]), []);

  const totalPrice = selectedTours.reduce((sum, t) => sum + (t.priceFrom ?? 0), 0);
  const totalDurationMinutes = selectedTours.reduce(
    (sum, t) => sum + (t.durationMinutes ?? 0),
    0
  );

  return (
    <ExperienceBuilderContext.Provider
      value={{ selectedTours, addTour, removeTour, isSelected, clearAll, totalPrice, totalDurationMinutes }}
    >
      {children}
    </ExperienceBuilderContext.Provider>
  );
}

export function useExperienceBuilder(): ExperienceBuilderState {
  const ctx = useContext(ExperienceBuilderContext);
  if (!ctx) throw new Error("useExperienceBuilder must be inside ExperienceBuilderProvider");
  return ctx;
}

/** Safe version — returns null when called outside the provider */
export function useExperienceBuilderOptional(): ExperienceBuilderState | null {
  return useContext(ExperienceBuilderContext);
}
