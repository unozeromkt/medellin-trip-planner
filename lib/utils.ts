import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCOP(amount: number) {
  return `COP $${Math.round(amount).toLocaleString("es-CO")}`
}

type Rgb = [number, number, number]

const BRAND_NAVY: Rgb = [13, 27, 61]

function parseHex(hex: string): Rgb | null {
  const match = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i.exec(hex.trim())
  if (!match) return null
  const full =
    match[1].length === 3
      ? match[1]
          .split("")
          .map((c) => c + c)
          .join("")
      : match[1]
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as Rgb
}

function relativeLuminance([r, g, b]: Rgb) {
  const [rl, gl, bl] = [r, g, b].map((channel) => {
    const s = channel / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl
}

function contrastWithWhite(rgb: Rgb) {
  return 1.05 / (relativeLuminance(rgb) + 0.05)
}

/**
 * Los colores de categoría vienen de la DB, así que uno claro (p. ej. #7DD3C0)
 * deja el texto blanco del badge ilegible. Oscurece hacia el navy de marca
 * hasta que el blanco encima supere el umbral AA de 4.5:1.
 */
export function darkenForWhiteText(hex: string, target = 4.5) {
  const rgb = parseHex(hex)
  if (!rgb) return "#0D1B3D"

  let current = rgb
  for (let step = 0; step < 16 && contrastWithWhite(current) < target; step++) {
    current = current.map((channel, i) =>
      Math.round(channel + (BRAND_NAVY[i] - channel) * 0.15),
    ) as Rgb
  }

  return `#${current.map((c) => c.toString(16).padStart(2, "0")).join("")}`
}
