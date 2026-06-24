import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Medellín Trip Planner — Experiencias por toda Colombia",
    template: "%s | Medellín Trip Planner",
  },
  description:
    "Descubre y combina las mejores experiencias turísticas en Medellín, Guatapé y Antioquia. Tours curados, operadores verificados y planificación inteligente.",
  keywords: [
    "tours Medellín",
    "experiencias Colombia",
    "Guatapé",
    "turismo Antioquia",
    "trip planner Colombia",
  ],
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Medellín Trip Planner",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${sora.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body bg-background text-foreground">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
