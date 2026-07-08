"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Search, CalendarIcon, DollarSign, MapPin, Tag, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import {
  Moon, Buildings, Mountains, Confetti, Leaf, ForkKnife, Crown, Palette, Bus,
} from "@phosphor-icons/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import type { Destination, Category } from "@/lib/types";

/* ─── icon map for categories ────────────────────────────── */
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  nightlife: Moon,
  "city-tours": Buildings,
  adventure: Mountains,
  party: Confetti,
  nature: Leaf,
  gastronomy: ForkKnife,
  "vip-experiences": Crown,
  culture: Palette,
  transportation: Bus,
};

/* ─── budget options ─────────────────────────────────────── */
const BUDGETS = [
  { value: "hasta-250k", label: "Hasta $250.000", sublabel: "COP por persona", min: 0, max: 250000 },
  { value: "250k-500k", label: "$250K – $500K", sublabel: "COP por persona", min: 250000, max: 500000 },
  { value: "500k-1m", label: "$500K – $1.000.000", sublabel: "COP por persona", min: 500000, max: 1000000 },
  { value: "mas-1m", label: "Más de $1.000.000", sublabel: "COP por persona", min: 1000000, max: Infinity },
];

function formatDate(date: Date): string {
  return date.toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
}

interface HeroSearchProps {
  destinations: Destination[];
  categories: Category[];
}

export function HeroSearch({ destinations, categories }: HeroSearchProps) {
  const router = useRouter();

  const [destinationQuery, setDestinationQuery] = useState("");
  const [selectedDestSlug, setSelectedDestSlug] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const destRef = useRef<HTMLDivElement>(null);

  const [catOpen, setCatOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [travelDate, setTravelDate] = useState<Date | undefined>(undefined);
  const [selectedBudget, setSelectedBudget] = useState<(typeof BUDGETS)[0] | null>(null);

  const suggestions = destinationQuery.length >= 1
    ? destinations.filter(
        (d) =>
          d.name.toLowerCase().includes(destinationQuery.toLowerCase()) ||
          (d.region ?? "").toLowerCase().includes(destinationQuery.toLowerCase())
      )
    : destinations;

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function handleSelectDest(dest: Destination) {
    setDestinationQuery(dest.name);
    setSelectedDestSlug(dest.slug);
    setShowSuggestions(false);
  }

  function handleDestInput(value: string) {
    setDestinationQuery(value);
    setSelectedDestSlug("");
    setShowSuggestions(true);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedDestSlug) params.set("destination", selectedDestSlug);
    else if (destinationQuery.trim()) params.set("q", destinationQuery.trim());
    if (selectedCategory) params.set("category", selectedCategory.slug);
    if (travelDate) params.set("date", travelDate.toISOString().split("T")[0]);
    if (selectedBudget) params.set("budget", selectedBudget.value);
    router.push(`/tours${params.toString() ? `?${params}` : ""}`);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <section className="relative min-h-[78vh] flex items-center overflow-x-hidden">
      <Image
        src="/img/guatape-sky.jpg"
        alt="Embalse de Guatapé, Colombia"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/20 to-black/35" />

      <div className="relative z-10 container mx-auto px-4 py-20 flex flex-col items-center text-center">

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-white/20 border border-white/30 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#2BB7A6]" />
          <span className="text-xs font-semibold text-white tracking-wide">
            Medellín · Guatapé · Colombia
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4 max-w-3xl"
          style={{ textShadow: "0 2px 16px rgba(0,0,0,0.35)" }}
        >
          Explora Colombia{" "}
          <span className="text-[#2BB7A6]">a tu manera.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-white/90 mb-10 max-w-lg leading-relaxed"
          style={{ textShadow: "0 1px 8px rgba(0,0,0,0.3)" }}
        >
          Experiencias curadas, operadores verificados y planificación inteligente para tu próximo viaje.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onSubmit={handleSearch}
          className="w-full max-w-4xl"
        >
          <div className="bg-white rounded-2xl shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

              {/* ── Destination ── */}
              <div ref={destRef} className="relative">
                <div className="flex items-start gap-2 px-4 pt-4 pb-3.5 border-b sm:border-b-0 sm:border-r border-border">
                  <MapPin className="h-4 w-4 text-[#2BB7A6] mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">
                      Destino
                    </label>
                    <input
                      type="text"
                      value={destinationQuery}
                      onChange={(e) => handleDestInput(e.target.value)}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="¿A dónde quieres ir?"
                      autoComplete="off"
                      className="w-full text-sm text-foreground placeholder:text-muted-foreground/50 bg-transparent outline-none"
                    />
                  </div>
                  {destinationQuery && (
                    <button
                      type="button"
                      onClick={() => { setDestinationQuery(""); setSelectedDestSlug(""); }}
                      className="text-muted-foreground/50 hover:text-muted-foreground text-base leading-none mt-0.5"
                    >
                      ×
                    </button>
                  )}
                </div>

                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-xl shadow-xl z-50 max-h-72 overflow-y-auto">
                    {suggestions.map((dest) => (
                      <button
                        key={dest.id}
                        type="button"
                        onMouseDown={() => handleSelectDest(dest)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/60 transition-colors text-left"
                      >
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-muted">
                          {dest.coverImage ? (
                            <Image src={dest.coverImage} alt={dest.name} fill className="object-cover" sizes="40px" />
                          ) : (
                            <div className="w-full h-full bg-muted" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{dest.name}</p>
                          <p className="text-xs text-muted-foreground">{dest.region}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Experience type ── */}
              <Popover open={catOpen} onOpenChange={setCatOpen}>
                <PopoverTrigger
                  className="flex items-start gap-2 px-4 pt-4 pb-3.5 border-b sm:border-b-0 sm:border-r border-border text-left w-full bg-transparent cursor-pointer"
                >
                  <Tag className="h-4 w-4 text-[#2BB7A6] mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">
                      Tipo de experiencia
                    </p>
                    <p className={`text-sm truncate ${selectedCategory ? "text-foreground font-medium" : "text-muted-foreground/60"}`}>
                      {selectedCategory ? selectedCategory.name : "Todas las categorías"}
                    </p>
                  </div>
                  <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground/50 mt-1 shrink-0 transition-transform ${catOpen ? "rotate-180" : ""}`} />
                </PopoverTrigger>
                <PopoverContent className="w-72 p-3" align="start" sideOffset={8}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-1">
                    Tipo de experiencia
                  </p>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {categories.map((cat) => {
                      const Icon = CATEGORY_ICONS[cat.slug] ?? Tag;
                      const color = cat.color ?? "#2BB7A6";
                      const active = selectedCategory?.slug === cat.slug;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => { setSelectedCategory(active ? null : cat); setCatOpen(false); }}
                          className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all text-center ${
                            active
                              ? "border-[#2BB7A6] bg-[#2BB7A6]/10 text-[#2BB7A6]"
                              : "border-border hover:border-border hover:bg-muted/60 text-muted-foreground"
                          }`}
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: active ? color + "20" : color + "15" }}
                          >
                            <Icon size={18} weight="duotone" style={{ color }} />
                          </div>
                          <span className="text-[10px] font-medium leading-tight">{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                  {selectedCategory && (
                    <button
                      type="button"
                      onClick={() => { setSelectedCategory(null); setCatOpen(false); }}
                      className="w-full text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 mt-1 py-1.5 rounded-lg hover:bg-muted transition-colors"
                    >
                      <X className="h-3 w-3" /> Quitar filtro
                    </button>
                  )}
                </PopoverContent>
              </Popover>

              {/* ── Date ── */}
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger
                  className="flex items-start gap-2 px-4 pt-4 pb-3.5 border-b sm:border-b-0 lg:border-r border-border text-left w-full bg-transparent cursor-pointer"
                >
                  <CalendarIcon className="h-4 w-4 text-[#2BB7A6] mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">
                      Fecha tentativa
                    </p>
                    <p className={`text-sm truncate ${travelDate ? "text-foreground font-medium" : "text-muted-foreground/60"}`}>
                      {travelDate ? formatDate(travelDate) : "¿Cuándo viajas?"}
                    </p>
                  </div>
                  {travelDate ? (
                    <span
                      role="button"
                      onClick={(e) => { e.stopPropagation(); setTravelDate(undefined); }}
                      className="text-muted-foreground/50 hover:text-muted-foreground mt-0.5"
                    >
                      <X className="h-3.5 w-3.5" />
                    </span>
                  ) : (
                    <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground/50 mt-1 shrink-0 transition-transform ${dateOpen ? "rotate-180" : ""}`} />
                  )}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start" sideOffset={8}>
                  <Calendar
                    mode="single"
                    selected={travelDate}
                    onSelect={(date) => { setTravelDate(date); if (date) setDateOpen(false); }}
                    disabled={{ before: today }}
                    className="rounded-xl"
                  />
                </PopoverContent>
              </Popover>

              {/* ── Budget ── */}
              <Popover open={budgetOpen} onOpenChange={setBudgetOpen}>
                <PopoverTrigger
                  className="flex items-start gap-2 px-4 pt-4 pb-3.5 text-left w-full bg-transparent cursor-pointer"
                >
                  <DollarSign className="h-4 w-4 text-[#2BB7A6] mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">
                      Presupuesto
                    </p>
                    <p className={`text-sm truncate ${selectedBudget ? "text-foreground font-medium" : "text-muted-foreground/60"}`}>
                      {selectedBudget ? selectedBudget.label : "Cualquier presupuesto"}
                    </p>
                  </div>
                  <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground/50 mt-1 shrink-0 transition-transform ${budgetOpen ? "rotate-180" : ""}`} />
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2" align="end" sideOffset={8}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-2 pt-1">
                    Presupuesto por persona
                  </p>
                  <div className="space-y-1">
                    {BUDGETS.map((b) => {
                      const active = selectedBudget?.value === b.value;
                      return (
                        <button
                          key={b.value}
                          type="button"
                          onClick={() => { setSelectedBudget(active ? null : b); setBudgetOpen(false); }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left ${
                            active
                              ? "bg-[#2BB7A6]/10 border border-[#2BB7A6]/30 text-[#2BB7A6]"
                              : "hover:bg-muted border border-transparent text-foreground"
                          }`}
                        >
                          <div>
                            <p className="text-sm font-semibold leading-tight">{b.label}</p>
                            <p className="text-[11px] text-muted-foreground">{b.sublabel}</p>
                          </div>
                          {active && (
                            <div className="w-4 h-4 rounded-full bg-[#0D1B3D] flex items-center justify-center shrink-0">
                              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>

            </div>

            <div className="px-3 pb-3">
              <button
                type="submit"
                className="w-full bg-[#0D1B3D] hover:bg-[#162246] text-white font-semibold rounded-xl px-6 py-3 flex items-center justify-center gap-2 transition-colors"
              >
                <Search className="h-4 w-4" />
                Buscar experiencias
              </button>
            </div>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-5 flex flex-wrap items-center gap-2"
        >
          <span className="text-xs text-muted-foreground/60 mr-1">Popular:</span>
          {["Guatapé", "Chiva Parrandera", "Comuna 13", "Tour Nocturno", "VIP Experience"].map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => router.push(`/tours?q=${encodeURIComponent(term)}`)}
              className="text-xs text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-full px-3 py-1 transition-colors"
            >
              {term}
            </button>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
