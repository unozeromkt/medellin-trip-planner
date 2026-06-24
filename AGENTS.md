<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Medellín Trip Planner — Agent Instructions

You are working on **Medellín Trip Planner**, a premium curated tourism marketplace for Medellín, Antioquia and future Colombia expansion.

---

## Product vision

- Not a generic tours website.
- A curated multi-operator travel experience planner.
- B2C first. WhatsApp conversion first.
- Provider portal and admin required.
- B2B agency portal in phase 2.
- AI trip assistant in future phases.

---

## Tech stack

- **Next.js 16 App Router** — full-stack
- **TypeScript** — strict
- **Tailwind CSS v4 + shadcn/ui** — UI
- **motion** (npm package "motion") — animations
- **PostgreSQL + Prisma** — database
- **next-auth v5 (beta)** — authentication
- **react-hook-form + zod** — forms
- **lucide-react + @phosphor-icons/react** — icons

---

## Brand identity — MUST follow exactly

### Colors
| Token | Hex | Usage |
|---|---|---|
| `bg-[#0D1B3D]` / `text-foreground` | `#0D1B3D` | Primary text, navbar, dark sections |
| `bg-primary` / `text-primary` | `#2BB7A6` | CTAs, links, primary buttons, "Planner" in logo |
| `bg-secondary` | `#A8CBE6` | Secondary accents, hover states |
| `bg-background` | `#F1F3F6` | Page background, light sections |
| `bg-accent` | `#FFC97A` | Offers, badges, accents, tagline dash |

Use CSS variables: `--color-brand-navy`, `--color-brand-teal`, `--color-brand-sky`, `--color-brand-mist`, `--color-brand-amber`

### Typography
- **Headings / Titles**: `font-heading` class → **Sora** (`var(--font-sora)`)
- **Body / UI / Forms**: `font-body` class → **Inter** (`var(--font-inter)`)

### Logo
- "Medellín" = small, normal weight, navy
- "Trip" = large, bold, navy
- "Planner" = large, bold, teal (`#2BB7A6`)
- Tagline: "Experiencias por toda Colombia" with amber `—` dash

### Design direction
- Premium OTA-style (Airbnb Experiences meets Viator meets GetYourGuide)
- Clean, modern, trustworthy, global
- Strong photography, spacious layouts, polished cards
- Subtle animations, never distracting
- Colombia without clichés — no excessive folklore
- NO generic AI gradients (no purple-to-pink, no rainbow backgrounds)

---

## Architecture rules

- Single Next.js app — no microservices in MVP
- App Router with route groups: `(public)`, `(auth)`, `admin`, `provider`, `agency`
- Server Actions for mutations, Route Handlers for external APIs/webhooks
- All forms validated with Zod + react-hook-form
- Role-based access: `admin | editor | operator | agency | customer`

---

## Conversion rules

- ALWAYS save lead to DB BEFORE redirecting to WhatsApp
- Every tour page must have a sticky WhatsApp CTA
- Experience builder must generate a structured WhatsApp message
- Use `lib/whatsapp.ts` → `buildWhatsAppMessage()` for all WhatsApp URLs

---

## Icon usage

| Context | Library |
|---|---|
| UI, admin, navigation | `lucide-react` |
| Tourism categories, experiences | `@phosphor-icons/react` |
| Maps, routes, transport | `@tabler/icons-react` |

---

## Animation rules (motion library)

- Durations: 150ms–450ms only
- Always respect `prefers-reduced-motion`
- Animate: hero entry, card hover, filter transitions, builder selection, modals
- Never animate in a way that delays conversion or navigation

---

## Before writing any code

1. Identify which module you're working on (B2C / Admin / Provider / API)
2. Find the relevant route group in `app/`
3. Reuse existing components from `components/`
4. Add Zod validation for all user inputs
5. Add loading and empty states
6. Test responsive behavior (mobile-first)
7. Add basic accessibility (semantic HTML, aria labels, keyboard nav)
8. Keep SEO metadata updated for public pages
