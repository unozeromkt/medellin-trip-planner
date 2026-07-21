import { config } from "dotenv";
config({ path: ".env.local", override: true });
config({ path: ".env" });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ── Destinations ─────────────────────────────────────────────────
  const destinations = await Promise.all([
    prisma.destination.upsert({
      where: { slug: "medellin" },
      update: { rating: 4.8, reviewCount: 1240 },
      create: {
        name: "Medellín",
        slug: "medellin",
        description: "La ciudad de la eterna primavera. Capital de Antioquia y epicentro de la transformación urbana de Colombia.",
        coverImage: "/img/featured_destinations/medellin-aerea.jpg",
        region: "Antioquia",
        rating: 4.8,
        reviewCount: 1240,
        sortOrder: 1,
      },
    }),
    prisma.destination.upsert({
      where: { slug: "guatape" },
      update: { rating: 4.9, reviewCount: 890 },
      create: {
        name: "Guatapé",
        slug: "guatape",
        description: "El pueblo más colorido de Colombia, hogar de la Piedra del Peñol y el embalse más espectacular del país.",
        coverImage: "/img/featured_destinations/guatape.jpg",
        region: "Antioquia",
        rating: 4.9,
        reviewCount: 890,
        sortOrder: 2,
      },
    }),
    prisma.destination.upsert({
      where: { slug: "santa-fe-de-antioquia" },
      update: { rating: 4.5, reviewCount: 320 },
      create: {
        name: "Santa Fe de Antioquia",
        slug: "santa-fe-de-antioquia",
        description: "Ciudad colonial declarada Patrimonio Histórico Nacional. Calles empedradas, arquitectura española y clima cálido.",
        coverImage: "/img/featured_destinations/santa-fe-antioquia.jpg",
        region: "Antioquia",
        rating: 4.5,
        reviewCount: 320,
        sortOrder: 3,
      },
    }),
    prisma.destination.upsert({
      where: { slug: "oriente-antioqueno" },
      update: { rating: 4.7, reviewCount: 410 },
      create: {
        name: "Oriente Antioqueño",
        slug: "oriente-antioqueno",
        description: "Embalses, montañas y pueblos cafeteros. Un paraíso natural a menos de una hora de Medellín.",
        coverImage: "/img/featured_destinations/Rionegro-Antioquia.jpg",
        region: "Antioquia",
        rating: 4.7,
        reviewCount: 410,
        sortOrder: 4,
      },
    }),
    prisma.destination.upsert({
      where: { slug: "doradal" },
      update: { rating: 4.6, reviewCount: 185 },
      create: {
        name: "Doradal",
        slug: "doradal",
        description: "Puerta de entrada al Magdalena Medio. Parque Temático Hacienda Nápoles y naturaleza salvaje.",
        coverImage: "/img/featured_destinations/doradal-rio-claro.jpg",
        region: "Antioquia",
        rating: 4.6,
        reviewCount: 185,
        sortOrder: 5,
      },
    }),
    prisma.destination.upsert({
      where: { slug: "jardin" },
      update: { rating: 4.8, reviewCount: 560 },
      create: {
        name: "Jardín",
        slug: "jardin",
        description: "Considerado el pueblo más bonito de Antioquia. Café de origen, cascadas y arquitectura republicana intacta.",
        coverImage: "/img/featured_destinations/jardin.jpg",
        region: "Antioquia",
        rating: 4.8,
        reviewCount: 560,
        sortOrder: 6,
      },
    }),
  ]);

  // ── Categories ────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: "nightlife" },       update: {}, create: { name: "Vida Nocturna",      slug: "nightlife",       icon: "Moon",      color: "#0D1B3D", sortOrder: 1 } }),
    prisma.category.upsert({ where: { slug: "city-tours" },      update: {}, create: { name: "Tours Urbanos",      slug: "city-tours",      icon: "Buildings", color: "#2BB7A6", sortOrder: 2 } }),
    prisma.category.upsert({ where: { slug: "adventure" },       update: {}, create: { name: "Aventura",           slug: "adventure",       icon: "Mountain",  color: "#4B5E7A", sortOrder: 3 } }),
    prisma.category.upsert({ where: { slug: "party" },           update: {}, create: { name: "Fiesta",             slug: "party",           icon: "Confetti",  color: "#FFC97A", sortOrder: 4 } }),
    prisma.category.upsert({ where: { slug: "nature" },          update: {}, create: { name: "Naturaleza",         slug: "nature",          icon: "Leaf",      color: "#2BB7A6", sortOrder: 5 } }),
    prisma.category.upsert({ where: { slug: "gastronomy" },      update: {}, create: { name: "Gastronomía",        slug: "gastronomy",      icon: "ForkKnife", color: "#FFC97A", sortOrder: 6 } }),
    prisma.category.upsert({ where: { slug: "vip-experiences" }, update: {}, create: { name: "Experiencias VIP",   slug: "vip-experiences", icon: "Crown",     color: "#0D1B3D", sortOrder: 7 } }),
    prisma.category.upsert({ where: { slug: "culture" },         update: {}, create: { name: "Cultura",            slug: "culture",         icon: "Landmark",  color: "#A8CBE6", sortOrder: 8 } }),
    prisma.category.upsert({ where: { slug: "transportation" },  update: {}, create: { name: "Transporte",         slug: "transportation",  icon: "Bus",       color: "#4B5E7A", sortOrder: 9 } }),
  ]);

  // ── Operators ─────────────────────────────────────────────────────
  const operators = await Promise.all([
    prisma.operator.upsert({
      where: { slug: "turtle-bus" },
      update: { logoUrl: "/logos/logo-turtlebus.webp" },
      create: { name: "Turtle Bus", slug: "turtle-bus", description: "Tours temáticos únicos en Medellín a bordo de nuestro icónico bus.", commercialName: "Turtle Bus Medellín", contactEmail: "info@turtlebus.co", status: "active", logoUrl: "/logos/logo-turtlebus.webp" },
    }),
    prisma.operator.upsert({
      where: { slug: "aeroturex" },
      update: { logoUrl: "/logos/aeroturex-logo.png" },
      create: { name: "Aeroturex", slug: "aeroturex", description: "City tours y experiencias urbanas de alta calidad en Medellín.", commercialName: "Aeroturex Colombia", contactEmail: "info@aeroturex.co", status: "active", logoUrl: "/logos/aeroturex-logo.png" },
    }),
    prisma.operator.upsert({
      where: { slug: "guatape-travel" },
      update: { logoUrl: "/logos/logo-web-guatape-travel-180px.png" },
      create: { name: "Guatapé Travel", slug: "guatape-travel", description: "Especialistas en tours a Guatapé, la Piedra del Peñol y alrededores.", commercialName: "Guatapé Travel", contactEmail: "info@guatapetravel.co", status: "active", logoUrl: "/logos/logo-web-guatape-travel-180px.png" },
    }),
    prisma.operator.upsert({
      where: { slug: "chivas-celebraciones" },
      update: { logoUrl: "/logos/chivas-logo.png" },
      create: { name: "Chivas & Trolley Tours", slug: "chivas-celebraciones", description: "Experiencias de fiesta, chivas y eventos especiales en Medellín.", commercialName: "Chivas y Celebraciones", contactEmail: "info@chivasmedellin.co", status: "active", logoUrl: "/logos/chivas-logo.png" },
    }),
  ]);

  const [destMedellin, destGuatape, destSantaFe, , , destJardin] = destinations;
  const [catNightlife, catCityTours, catAdventure, catParty, catNature, catGastronomy, catVip, catCulture, catTransport] = categories;
  const [opTurtleBus, opAeroturex, opGuatapeTravel, opChivas] = operators;

  // ── Tours ─────────────────────────────────────────────────────────
  const toursData = [
    {
      operatorId: opTurtleBus.id, destinationId: destMedellin.id,
      title: "Turtle Bus City Tour", slug: "turtle-bus-city-tour",
      shortDescription: "Recorre los barrios más icónicos de Medellín a bordo de nuestro colorido bus temático.",
      coverImage: "https://picsum.photos/seed/medellin-bus/800/500",
      rating: 4.8, reviewCount: 124,
      priceFrom: 85000, durationMinutes: 180, isFeatured: true, isOffer: false,
      departureTimes: ["09:00", "14:00"], returnTime: "17:00", isFullDay: false,
      zone: "sur", physicalIntensity: "low", operatingDays: [1,2,3,4,5,6,7],
      pickupIncluded: false, bookingAdvanceDays: 1,
      tags: ["mañana", "tarde", "cultural", "familiar", "urbano"],
      categories: [catCityTours.id, catTransport.id],
    },
    {
      operatorId: opTurtleBus.id, destinationId: destMedellin.id,
      title: "Turtle Bus Nightlife Tour", slug: "turtle-bus-nightlife-tour",
      shortDescription: "Descubre la vibrante vida nocturna de Medellín desde el Turtle Bus con paradas en los mejores spots.",
      coverImage: "https://picsum.photos/seed/medellin-night/800/500",
      rating: 4.9, reviewCount: 89,
      priceFrom: 120000, durationMinutes: 240, isFeatured: true, isOffer: false,
      departureTimes: ["21:00"], returnTime: "01:00", isFullDay: false,
      zone: "sur", physicalIntensity: "low", operatingDays: [4,5,6,7],
      pickupIncluded: false, bookingAdvanceDays: 1,
      tags: ["noche", "adultos", "festivo", "grupal"],
      categories: [catNightlife.id, catTransport.id],
    },
    {
      operatorId: opAeroturex.id, destinationId: destMedellin.id,
      title: "Medellín Panorámica", slug: "medellin-panoramica",
      shortDescription: "Los mejores miradores, barrios históricos y rincones secretos de Medellín en un tour exclusivo.",
      coverImage: "https://picsum.photos/seed/medellin-view/800/500",
      rating: 4.7, reviewCount: 203,
      priceFrom: 75000, durationMinutes: 240, isFeatured: true, isOffer: false,
      departureTimes: ["09:00", "13:00"], returnTime: "17:00", isFullDay: false,
      zone: "centro", physicalIntensity: "low", operatingDays: [1,2,3,4,5,6,7],
      pickupIncluded: true, bookingAdvanceDays: 1,
      tags: ["mañana", "tarde", "cultural", "familiar", "fotográfico"],
      categories: [catCityTours.id, catCulture.id],
    },
    {
      operatorId: opAeroturex.id, destinationId: destMedellin.id,
      title: "Comuna 13 Tour", slug: "comuna-13-tour",
      shortDescription: "Historia, arte urbano, transformación social y las escaleras eléctricas más famosas de Latinoamérica.",
      coverImage: "https://picsum.photos/seed/graffiti-art/800/500",
      rating: 4.9, reviewCount: 312,
      priceFrom: 65000, durationMinutes: 180, isFeatured: false, isOffer: false,
      departureTimes: ["09:00", "14:00"], returnTime: "17:00", isFullDay: false,
      zone: "centro", physicalIntensity: "medium", operatingDays: [1,2,3,4,5,6,7],
      pickupIncluded: false, bookingAdvanceDays: 1,
      tags: ["mañana", "tarde", "cultural", "histórico", "fotográfico"],
      categories: [catCulture.id, catCityTours.id],
    },
    {
      operatorId: opGuatapeTravel.id, destinationId: destGuatape.id,
      title: "Guatapé Full Day", slug: "guatape-full-day",
      shortDescription: "El pueblo más colorido de Colombia + subida a la Piedra del Peñol + tour en lancha por el embalse.",
      coverImage: "https://picsum.photos/seed/guatape-rock/800/500",
      rating: 4.9, reviewCount: 445,
      priceFrom: 130000, durationMinutes: 600, isFeatured: true, isOffer: true,
      departureTimes: ["07:00"], returnTime: "17:30", isFullDay: true,
      zone: "fuera-medellin", physicalIntensity: "medium", operatingDays: [1,2,3,4,5,6,7],
      pickupIncluded: true, bookingAdvanceDays: 2,
      tags: ["día-completo", "naturaleza", "familiar", "fotográfico", "acuático"],
      categories: [catNature.id, catAdventure.id],
    },
    {
      operatorId: opGuatapeTravel.id, destinationId: destGuatape.id,
      title: "Tour en Lancha por el Embalse", slug: "tour-lancha-embalse-guatape",
      shortDescription: "Navega por las cristalinas aguas del embalse de Guatapé y conoce las islas de sus alrededores.",
      coverImage: "https://picsum.photos/seed/lake-boat/800/500",
      rating: 4.6, reviewCount: 78,
      priceFrom: 95000, durationMinutes: 120, isFeatured: false, isOffer: false,
      departureTimes: ["10:00", "13:00", "15:00"], returnTime: "17:00", isFullDay: false,
      zone: "fuera-medellin", physicalIntensity: "low", operatingDays: [1,2,3,4,5,6,7],
      pickupIncluded: false, bookingAdvanceDays: 1,
      tags: ["mañana", "tarde", "acuático", "familiar", "naturaleza"],
      categories: [catNature.id, catAdventure.id],
    },
    {
      operatorId: opChivas.id, destinationId: destMedellin.id,
      title: "Chiva Parrandera Medellín", slug: "chiva-parrandera-medellin",
      shortDescription: "La rumba más auténtica de Medellín a bordo de una chiva tradicional con música en vivo y trago incluido.",
      coverImage: "https://picsum.photos/seed/party-bus/800/500",
      rating: 4.8, reviewCount: 167,
      priceFrom: 150000, durationMinutes: 300, isFeatured: true, isOffer: false,
      departureTimes: ["20:00"], returnTime: "01:00", isFullDay: false,
      zone: "centro", physicalIntensity: "low", operatingDays: [4,5,6,7],
      pickupIncluded: false, bookingAdvanceDays: 1,
      tags: ["noche", "festivo", "adultos", "grupal", "cultural"],
      categories: [catParty.id, catNightlife.id],
    },
    {
      operatorId: opChivas.id, destinationId: destMedellin.id,
      title: "Chiva VIP Privada", slug: "chiva-vip-privada",
      shortDescription: "Chiva exclusiva para grupos privados, despedidas de soltero/a, cumpleaños y eventos corporativos.",
      coverImage: "https://picsum.photos/seed/vip-event/800/500",
      rating: 5.0, reviewCount: 34,
      priceFrom: 800000, durationMinutes: 360, isFeatured: false, isOffer: false,
      departureTimes: ["19:00", "21:00"], returnTime: "02:00", isFullDay: false,
      zone: "centro", physicalIntensity: "low", operatingDays: [1,2,3,4,5,6,7],
      pickupIncluded: true, bookingAdvanceDays: 3,
      tags: ["noche", "privado", "premium", "eventos", "adultos"],
      categories: [catVip.id, catParty.id],
    },
    {
      operatorId: opAeroturex.id, destinationId: destSantaFe.id,
      title: "Santa Fe de Antioquia Colonial", slug: "santa-fe-antioquia-colonial",
      shortDescription: "Descubre la ciudad colonial más importante de Antioquia con guía experto y almuerzo típico incluido.",
      coverImage: "https://picsum.photos/seed/colonial-church/800/500",
      rating: 4.5, reviewCount: 56,
      priceFrom: 110000, durationMinutes: 480, isFeatured: false, isOffer: false,
      departureTimes: ["07:00"], returnTime: "16:00", isFullDay: true,
      zone: "fuera-medellin", physicalIntensity: "low", operatingDays: [2,3,4,5,6,7],
      pickupIncluded: true, bookingAdvanceDays: 2,
      tags: ["día-completo", "cultural", "histórico", "familiar", "gastronómico"],
      categories: [catCulture.id, catCityTours.id],
    },
    {
      operatorId: opTurtleBus.id, destinationId: destMedellin.id,
      title: "Medellín VIP Experience", slug: "medellin-vip-experience",
      shortDescription: "Restaurantes gourmet, miradores exclusivos, transporte premium y experiencias que no están en los mapas.",
      coverImage: "https://picsum.photos/seed/luxury-city/800/500",
      rating: 4.9, reviewCount: 41,
      priceFrom: 350000, durationMinutes: 480, isFeatured: true, isOffer: false,
      departureTimes: ["10:00"], returnTime: "19:00", isFullDay: true,
      zone: "sur", physicalIntensity: "low", operatingDays: [1,2,3,4,5,6,7],
      pickupIncluded: true, bookingAdvanceDays: 3,
      tags: ["día-completo", "premium", "gastronómico", "romántico", "privado"],
      categories: [catVip.id, catCityTours.id],
    },
    {
      operatorId: opAeroturex.id, destinationId: destMedellin.id,
      title: "Tour en Bici por El Poblado", slug: "tour-bici-el-poblado",
      shortDescription: "Pedalea por los barrios más trendy de Medellín: El Poblado, Provenza y el corazón de la ciudad.",
      coverImage: "https://picsum.photos/seed/bike-city/800/500",
      rating: 4.7, reviewCount: 93,
      priceFrom: 55000, durationMinutes: 180, isFeatured: false, isOffer: false,
      departureTimes: ["08:00", "10:00"], returnTime: "13:00", isFullDay: false,
      zone: "sur", physicalIntensity: "medium", operatingDays: [1,2,3,4,5,6,7],
      pickupIncluded: false, bookingAdvanceDays: 1,
      tags: ["mañana", "activo", "urbano", "fotográfico"],
      categories: [catCityTours.id, catAdventure.id],
    },
    {
      operatorId: opTurtleBus.id, destinationId: destMedellin.id,
      title: "Tour Pablo Escobar", slug: "tour-pablo-escobar",
      shortDescription: "Conoce la historia real del narcotráfico colombiano con perspectiva crítica, educativa y local.",
      coverImage: "https://picsum.photos/seed/medellin-history/800/500",
      rating: 4.6, reviewCount: 287,
      priceFrom: 70000, durationMinutes: 240, isFeatured: false, isOffer: false,
      departureTimes: ["09:00", "14:00"], returnTime: "18:00", isFullDay: false,
      zone: "norte", physicalIntensity: "low", operatingDays: [1,2,3,4,5,6,7],
      pickupIncluded: false, bookingAdvanceDays: 1,
      tags: ["mañana", "tarde", "cultural", "histórico"],
      categories: [catCulture.id, catCityTours.id],
    },
    {
      operatorId: opAeroturex.id, destinationId: destMedellin.id,
      title: "Parapente sobre Medellín", slug: "parapente-medellin",
      shortDescription: "Vuela sobre el Valle de Aburrá en parapente en tándem y admira Medellín desde las alturas.",
      coverImage: "https://picsum.photos/seed/paragliding/800/500",
      rating: 4.9, reviewCount: 156,
      priceFrom: 180000, durationMinutes: 60, isFeatured: true, isOffer: false,
      departureTimes: ["07:00", "09:00", "11:00", "14:00"], returnTime: "16:00", isFullDay: false,
      zone: "norte", physicalIntensity: "high", operatingDays: [1,2,3,4,5,6,7],
      pickupIncluded: false, bookingAdvanceDays: 1,
      tags: ["mañana", "tarde", "adrenalina", "aventura", "fotográfico"],
      categories: [catAdventure.id, catCityTours.id],
    },
    {
      operatorId: opGuatapeTravel.id, destinationId: destGuatape.id,
      title: "Kayak en el Embalse de Guatapé", slug: "kayak-embalse-guatape",
      shortDescription: "Explora las orillas del embalse en kayak y descubre rincones inaccesibles desde tierra.",
      coverImage: "https://picsum.photos/seed/kayak-lake/800/500",
      rating: 4.8, reviewCount: 44,
      priceFrom: 80000, durationMinutes: 150, isFeatured: false, isOffer: false,
      departureTimes: ["09:00", "14:00"], returnTime: "16:30", isFullDay: false,
      zone: "fuera-medellin", physicalIntensity: "medium", operatingDays: [1,2,3,4,5,6,7],
      pickupIncluded: false, bookingAdvanceDays: 1,
      tags: ["mañana", "tarde", "acuático", "aventura", "naturaleza"],
      categories: [catAdventure.id, catNature.id],
    },
    {
      operatorId: opGuatapeTravel.id, destinationId: destGuatape.id,
      title: "Atardecer en el Peñol", slug: "atardecer-penol-guatape",
      shortDescription: "Sube a la Piedra del Peñol al atardecer y vive la magia del embalse teñido de naranja y rojo.",
      coverImage: "https://picsum.photos/seed/sunset-rock/800/500",
      rating: 4.9, reviewCount: 71,
      priceFrom: 60000, durationMinutes: 120, isFeatured: false, isOffer: false,
      departureTimes: ["16:00"], returnTime: "18:30", isFullDay: false,
      zone: "fuera-medellin", physicalIntensity: "medium", operatingDays: [1,2,3,4,5,6,7],
      pickupIncluded: false, bookingAdvanceDays: 1,
      tags: ["tarde", "fotográfico", "romántico", "naturaleza"],
      categories: [catNature.id, catAdventure.id],
    },
    {
      operatorId: opChivas.id, destinationId: destMedellin.id,
      title: "Chiva Fiestera Cumpleaños", slug: "chiva-fiestera-cumpleanos",
      shortDescription: "Celebra tu cumpleaños o despedida en nuestra chiva parrandera con decoración, DJ y trago incluido.",
      coverImage: "https://picsum.photos/seed/birthday-party/800/500",
      rating: 4.9, reviewCount: 58,
      priceFrom: 200000, durationMinutes: 240, isFeatured: false, isOffer: false,
      departureTimes: ["19:00", "21:00"], returnTime: "01:00", isFullDay: false,
      zone: "centro", physicalIntensity: "low", operatingDays: [1,2,3,4,5,6,7],
      pickupIncluded: false, bookingAdvanceDays: 2,
      tags: ["noche", "festivo", "adultos", "grupal", "privado", "eventos"],
      categories: [catParty.id, catNightlife.id],
    },
    {
      operatorId: opChivas.id, destinationId: destMedellin.id,
      title: "Chiva de las Flores", slug: "chiva-de-las-flores",
      shortDescription: "Recorre las calles de Medellín en la legendaria Chiva de las Flores durante la Feria de las Flores.",
      coverImage: "https://picsum.photos/seed/flowers-festival/800/500",
      rating: 5.0, reviewCount: 29,
      priceFrom: 130000, durationMinutes: 180, isFeatured: false, isOffer: true,
      departureTimes: ["18:00", "20:00"], returnTime: "23:00", isFullDay: false,
      zone: "centro", physicalIntensity: "low", operatingDays: [5,6,7],
      pickupIncluded: false, bookingAdvanceDays: 2,
      tags: ["noche", "festivo", "cultural", "familiar", "grupal"],
      categories: [catParty.id, catCulture.id],
    },
    // ── 12 Client Tours (real flyer images) ──────────────────────────
    {
      operatorId: opGuatapeTravel.id, destinationId: destGuatape.id,
      title: "Guatapé Full Day", slug: "guatape-full-day",
      shortDescription: "El pueblo más colorido de Colombia + subida a la Piedra del Peñol + tour en lancha por el embalse.",
      coverImage: "/tours/guatape-full-day.jpg",
      rating: 4.9, reviewCount: 445,
      priceFrom: 130000, durationMinutes: 600, isFeatured: true, isOffer: true,
      departureTimes: ["07:00"], returnTime: "17:30", isFullDay: true,
      zone: "fuera-medellin", physicalIntensity: "medium", operatingDays: [1,2,3,4,5,6,7],
      pickupIncluded: true, bookingAdvanceDays: 2,
      tags: ["día-completo", "naturaleza", "familiar", "fotográfico", "acuático"],
      categories: [catNature.id, catAdventure.id],
    },
    {
      operatorId: opGuatapeTravel.id, destinationId: destGuatape.id,
      title: "Guatapé Gastronómico", slug: "guatape-gastronomico",
      shortDescription: "Degustación de la gastronomía típica de Guatapé: trucha fresca, bandeja paisa y postres artesanales.",
      coverImage: "/tours/guatape-gastronomico.jpg",
      rating: 4.8, reviewCount: 112,
      priceFrom: 95000, durationMinutes: 300, isFeatured: true, isOffer: false,
      departureTimes: ["10:00"], returnTime: "15:00", isFullDay: false,
      zone: "fuera-medellin", physicalIntensity: "low", operatingDays: [1,2,3,4,5,6,7],
      pickupIncluded: false, bookingAdvanceDays: 1,
      tags: ["gastronómico", "familiar", "cultural", "mañana"],
      categories: [catGastronomy.id, catCulture.id],
    },
    {
      operatorId: opGuatapeTravel.id, destinationId: destGuatape.id,
      title: "Guatapé Aventura", slug: "guatape-aventura",
      shortDescription: "Rappel, escalada en El Peñol, kayak y tirolesa en el corazón del embalse más hermoso de Colombia.",
      coverImage: "/tours/guatape-aventura.jpg",
      rating: 4.9, reviewCount: 88,
      priceFrom: 145000, durationMinutes: 480, isFeatured: true, isOffer: false,
      departureTimes: ["08:00"], returnTime: "16:00", isFullDay: true,
      zone: "fuera-medellin", physicalIntensity: "high", operatingDays: [1,2,3,4,5,6,7],
      pickupIncluded: true, bookingAdvanceDays: 2,
      tags: ["día-completo", "adrenalina", "aventura", "acuático", "naturaleza"],
      categories: [catAdventure.id, catNature.id],
    },
    {
      operatorId: opGuatapeTravel.id, destinationId: destGuatape.id,
      title: "Guatapé en Tuk-Tuk", slug: "guatape-tuktuk",
      shortDescription: "Recorre las coloridas calles de Guatapé en tuk-tuk privado y descubre los zócalos más icónicos del pueblo.",
      coverImage: "/tours/guatape-tuktuk.jpg",
      rating: 4.8, reviewCount: 67,
      priceFrom: 55000, durationMinutes: 90, isFeatured: true, isOffer: false,
      departureTimes: ["09:00", "11:00", "14:00", "16:00"], returnTime: "17:30", isFullDay: false,
      zone: "fuera-medellin", physicalIntensity: "low", operatingDays: [1,2,3,4,5,6,7],
      pickupIncluded: false, bookingAdvanceDays: 1,
      tags: ["mañana", "tarde", "familiar", "fotográfico", "cultural"],
      categories: [catCityTours.id, catCulture.id],
    },
    {
      operatorId: opGuatapeTravel.id, destinationId: destGuatape.id,
      title: "Guatapé en Helicóptero", slug: "guatape-helicoptero",
      shortDescription: "Vuelo panorámico en helicóptero sobre el embalse de Guatapé y la Piedra del Peñol. Una experiencia irrepetible.",
      coverImage: "/tours/guatape-helicoptero.jpg",
      rating: 5.0, reviewCount: 38,
      priceFrom: 480000, durationMinutes: 30, isFeatured: true, isOffer: false,
      departureTimes: ["08:00", "10:00", "12:00", "14:00", "16:00"], returnTime: "17:00", isFullDay: false,
      zone: "fuera-medellin", physicalIntensity: "low", operatingDays: [1,2,3,4,5,6,7],
      pickupIncluded: false, bookingAdvanceDays: 3,
      tags: ["premium", "romántico", "fotográfico", "adrenalina", "naturaleza"],
      categories: [catVip.id, catAdventure.id],
    },
    {
      operatorId: opChivas.id, destinationId: destMedellin.id,
      title: "City Tour Medellín en Chiva", slug: "city-tour-medellin-chiva",
      shortDescription: "Recorre los barrios más emblemáticos de Medellín a bordo de la auténtica chiva paisa con música y animación.",
      coverImage: "/tours/city-tour-medellin-chiva.jpg",
      rating: 4.8, reviewCount: 203,
      priceFrom: 110000, durationMinutes: 210, isFeatured: true, isOffer: false,
      departureTimes: ["09:00", "14:00"], returnTime: "17:30", isFullDay: false,
      zone: "centro", physicalIntensity: "low", operatingDays: [1,2,3,4,5,6,7],
      pickupIncluded: false, bookingAdvanceDays: 1,
      tags: ["mañana", "tarde", "cultural", "familiar", "grupal"],
      categories: [catCityTours.id, catCulture.id],
    },
    {
      operatorId: opChivas.id, destinationId: destMedellin.id,
      title: "Gastrochiva Medellín", slug: "gastrochiva-medellin",
      shortDescription: "Tour gastronómico en chiva por los mejores restaurantes y plazas de mercado de Medellín. Degustaciones incluidas.",
      coverImage: "/tours/gastrochiva.jpg",
      rating: 4.9, reviewCount: 95,
      priceFrom: 160000, durationMinutes: 240, isFeatured: true, isOffer: false,
      departureTimes: ["11:00", "17:00"], returnTime: "21:00", isFullDay: false,
      zone: "centro", physicalIntensity: "low", operatingDays: [2,3,4,5,6,7],
      pickupIncluded: false, bookingAdvanceDays: 1,
      tags: ["gastronómico", "cultural", "adultos", "tarde", "noche"],
      categories: [catGastronomy.id, catCulture.id],
    },
    {
      operatorId: opChivas.id, destinationId: destMedellin.id,
      title: "Party Bus Medellín", slug: "party-bus-medellin",
      shortDescription: "La fiesta sobre ruedas más famosa de Medellín. DJ en vivo, barra de licores y las mejores discotecas de la ciudad.",
      coverImage: "/tours/party-bus.jpg",
      rating: 4.9, reviewCount: 178,
      priceFrom: 180000, durationMinutes: 300, isFeatured: true, isOffer: false,
      departureTimes: ["21:00"], returnTime: "02:00", isFullDay: false,
      zone: "centro", physicalIntensity: "low", operatingDays: [4,5,6,7],
      pickupIncluded: false, bookingAdvanceDays: 2,
      tags: ["noche", "festivo", "adultos", "grupal", "adrenalina"],
      categories: [catParty.id, catNightlife.id],
    },
    {
      operatorId: opTurtleBus.id, destinationId: destMedellin.id,
      title: "Destino Aventura", slug: "destino-aventura-medellin",
      shortDescription: "Senderismo, tirolesa, rappel y adrenalina pura en los cerros y quebradas que rodean a Medellín.",
      coverImage: "/tours/destino-aventura.jpg",
      rating: 4.8, reviewCount: 134,
      priceFrom: 120000, durationMinutes: 360, isFeatured: true, isOffer: false,
      departureTimes: ["07:00", "08:00"], returnTime: "15:00", isFullDay: true,
      zone: "norte", physicalIntensity: "high", operatingDays: [1,2,3,4,5,6,7],
      pickupIncluded: true, bookingAdvanceDays: 1,
      tags: ["día-completo", "adrenalina", "aventura", "naturaleza", "activo"],
      categories: [catAdventure.id, catNature.id],
    },
    {
      operatorId: opAeroturex.id, destinationId: destMedellin.id,
      title: "Recorrido por la Comuna 13", slug: "recorrido-comuna-13",
      shortDescription: "El barrio que se reinventó. Arte urbano, escaleras eléctricas, historia real y los mejores grafitis de Colombia.",
      coverImage: "/tours/recorrido-comuna-13.jpg",
      rating: 4.9, reviewCount: 321,
      priceFrom: 68000, durationMinutes: 180, isFeatured: true, isOffer: false,
      departureTimes: ["09:00", "14:00"], returnTime: "17:00", isFullDay: false,
      zone: "centro", physicalIntensity: "medium", operatingDays: [1,2,3,4,5,6,7],
      pickupIncluded: false, bookingAdvanceDays: 1,
      tags: ["mañana", "tarde", "cultural", "histórico", "fotográfico", "grupal"],
      categories: [catCulture.id, catCityTours.id],
    },
    {
      operatorId: opAeroturex.id, destinationId: destJardin.id,
      title: "Tour del Café — Jardín", slug: "tour-del-cafe-jardin",
      shortDescription: "Recorre una finca cafetera en Jardín, conoce el proceso del café de origen y cata profesional incluida.",
      coverImage: "/tours/tour-del-cafe.jpg",
      rating: 4.9, reviewCount: 156,
      priceFrom: 145000, durationMinutes: 480, isFeatured: true, isOffer: false,
      departureTimes: ["07:00"], returnTime: "16:00", isFullDay: true,
      zone: "fuera-medellin", physicalIntensity: "low", operatingDays: [1,2,3,4,5,6,7],
      pickupIncluded: true, bookingAdvanceDays: 2,
      tags: ["día-completo", "gastronómico", "cultural", "naturaleza", "familiar"],
      categories: [catGastronomy.id, catNature.id],
    },
    {
      operatorId: opTurtleBus.id, destinationId: destMedellin.id,
      title: "Aventura en Parapente", slug: "aventura-parapente-medellin",
      shortDescription: "Vuelo en parapente en tándem sobre el Valle de Aburrá. Vista 360° de Medellín desde las nubes.",
      coverImage: "/tours/aventura-parapente.jpg",
      rating: 4.9, reviewCount: 167,
      priceFrom: 180000, durationMinutes: 60, isFeatured: true, isOffer: false,
      departureTimes: ["07:00", "09:00", "11:00", "14:00"], returnTime: "16:00", isFullDay: false,
      zone: "norte", physicalIntensity: "high", operatingDays: [1,2,3,4,5,6,7],
      pickupIncluded: false, bookingAdvanceDays: 1,
      tags: ["mañana", "tarde", "adrenalina", "aventura", "fotográfico"],
      categories: [catAdventure.id, catCityTours.id],
    },
  ];

  const createdTours: Record<string, string> = {};

  for (const tourData of toursData) {
    const { categories: tourCategories, ...data } = tourData;
    const existing = await prisma.tour.findUnique({ where: { slug: data.slug } });
    let tour;
    if (existing) {
      tour = await prisma.tour.update({
        where: { slug: data.slug },
        data: { coverImage: data.coverImage, rating: data.rating, reviewCount: data.reviewCount, operatingDays: data.operatingDays },
      });
    } else {
      tour = await prisma.tour.create({
        data: {
          ...data,
          status: "published",
          publishedAt: new Date(),
          tourCategories: { create: tourCategories.map((categoryId) => ({ categoryId })) },
        },
      });
    }
    createdTours[data.slug] = tour.id;
  }

  // ── Tour Images, Itinerary, FAQs for detailed tours ───────────────
  const guatapeId = createdTours["guatape-full-day"];
  const turtleBusId = createdTours["turtle-bus-city-tour"];

  // Clear existing related records to avoid duplicates
  await prisma.tourImage.deleteMany({ where: { tourId: { in: [guatapeId, turtleBusId] } } });
  await prisma.tourItineraryItem.deleteMany({ where: { tourId: { in: [guatapeId, turtleBusId] } } });
  await prisma.tourFaq.deleteMany({ where: { tourId: { in: [guatapeId, turtleBusId] } } });

  // Update description, meetingPoint, capacity and includes/excludes for detailed tours
  await prisma.tour.update({
    where: { id: guatapeId },
    data: {
      description: `El tour más popular de Antioquia. Comenzamos temprano desde Medellín en transporte cómodo con aire acondicionado. Al llegar a Guatapé, subimos la icónica Piedra del Peñol (740 escalones) para una vista panorámica espectacular del embalse y sus 69 islas.\n\nDespués, recorremos el colorido pueblo de Guatapé, famoso por sus zócalos pintados con escenas de la vida cotidiana. Al mediodía, disfrutamos de un almuerzo típico en restaurante a orillas del embalse.\n\nPor la tarde, subimos a bordo de una lancha privada para navegar por las aguas del embalse y conocer la isla de Pablo Escobar y otras islas privadas con sus fincas lujosas.`,
      meetingPoint: "Parque de las Luces, Medellín (frente al Centro Administrativo La Alpujarra)",
      capacityMin: 4,
      capacityMax: 16,
      includes: ["Transporte ida y vuelta desde Medellín", "Guía bilingüe (español/inglés)", "Entrada a la Piedra del Peñol", "Tour en lancha por el embalse (30 min)", "Almuerzo típico antioqueño", "Botella de agua"],
      excludes: ["Gastos personales", "Souvenirs", "Propinas", "Snacks adicionales"],
      images: {
        create: [
          { url: "https://picsum.photos/seed/guatape-rock/1200/700", altText: "La Piedra del Peñol", isCover: true, sortOrder: 0 },
          { url: "https://picsum.photos/seed/guatape-lake/1200/700", altText: "Embalse de Guatapé", isCover: false, sortOrder: 1 },
          { url: "https://picsum.photos/seed/guatape-town/1200/700", altText: "Pueblo de Guatapé", isCover: false, sortOrder: 2 },
          { url: "https://picsum.photos/seed/guatape-boat/1200/700", altText: "Tour en lancha", isCover: false, sortOrder: 3 },
        ],
      },
      itinerary: {
        create: [
          { stepNumber: 1, title: "Salida desde Medellín", description: "Encuentro en el Parque de las Luces. Salida en transporte privado.", duration: "7:00 AM" },
          { stepNumber: 2, title: "Llegada a Guatapé y subida a la Piedra", description: "740 escalones hasta la cima con vista 360° del embalse.", duration: "9:30 AM – 11:00 AM" },
          { stepNumber: 3, title: "Recorrido por el pueblo colorido", description: "Caminata por las calles y zócalos pintados de Guatapé.", duration: "11:00 AM – 12:30 PM" },
          { stepNumber: 4, title: "Almuerzo típico antioqueño", description: "Bandeja paisa o trucha del embalse en restaurante con vista.", duration: "12:30 PM – 2:00 PM" },
          { stepNumber: 5, title: "Tour en lancha por el embalse", description: "Navegación privada: isla de Pablo Escobar, fincas y miradores acuáticos.", duration: "2:00 PM – 3:00 PM" },
          { stepNumber: 6, title: "Regreso a Medellín", description: "Salida desde el muelle hacia Medellín.", duration: "3:30 PM – 5:30 PM" },
        ],
      },
      faqs: {
        create: [
          { question: "¿Es apto para niños?", answer: "Sí, aunque la subida a la Piedra tiene 740 escalones. Recomendamos buena condición física. Los niños menores de 5 años no pagan entrada." },
          { question: "¿Qué debo llevar?", answer: "Ropa cómoda, protector solar, gorra, cámara y algo de efectivo para souvenirs y gastos adicionales." },
          { question: "¿El tour opera si llueve?", answer: "Sí, el tour opera en todas las condiciones climáticas. El tour en lancha puede ajustarse según el clima." },
          { question: "¿Puedo reservar para grupos privados?", answer: "¡Por supuesto! Contáctanos por WhatsApp para cotizaciones de grupos privados con transporte exclusivo." },
        ],
      },
    },
  });

  await prisma.tour.update({
    where: { id: turtleBusId },
    data: {
      description: `Sube a bordo del icónico Turtle Bus y descubre Medellín desde una perspectiva única. Recorremos los barrios más representativos: El Centro Histórico, El Poblado, Laureles y Envigado, con paradas estratégicas en los mejores puntos de la ciudad.\n\nNuestros guías locales te contarán la historia de transformación de Medellín, sus proyectos de innovación urbana y los secretos de cada barrio. Un tour imprescindible para entender por qué Medellín es la ciudad más innovadora de Colombia.`,
      meetingPoint: "Hotel Dann Carlton, El Poblado",
      capacityMin: 2,
      capacityMax: 20,
      includes: ["Transporte en Turtle Bus", "Guía local bilingüe", "Visita a El Poblado, Laureles, El Centro", "Parada para foto en los mejores miradores", "Snack de bienvenida"],
      excludes: ["Almuerzo", "Bebidas adicionales", "Propinas"],
      images: {
        create: [
          { url: "https://picsum.photos/seed/medellin-bus/1200/700", altText: "Turtle Bus en Medellín", isCover: true, sortOrder: 0 },
          { url: "https://picsum.photos/seed/medellin-city/1200/700", altText: "Ciudad de Medellín", isCover: false, sortOrder: 1 },
          { url: "https://picsum.photos/seed/medellin-view/1200/700", altText: "Vista panorámica", isCover: false, sortOrder: 2 },
        ],
      },
      itinerary: {
        create: [
          { stepNumber: 1, title: "Encuentro y bienvenida", description: "Abordamos el Turtle Bus en El Poblado.", duration: "9:00 AM" },
          { stepNumber: 2, title: "El Poblado y Parque del Poblado", description: "El barrio más cosmopolita de Medellín.", duration: "9:15 AM – 10:00 AM" },
          { stepNumber: 3, title: "Laureles y Estadio", description: "Barrio residencial y gastronómico de los paisas.", duration: "10:00 AM – 10:45 AM" },
          { stepNumber: 4, title: "Centro Histórico", description: "Plaza Botero, Parque Berrío, Edificio Coltejer.", duration: "11:00 AM – 12:00 PM" },
        ],
      },
      faqs: {
        create: [
          { question: "¿Cuánto dura el tour?", answer: "Aproximadamente 3 horas, incluyendo las paradas fotográficas." },
          { question: "¿En qué idiomas se hace el tour?", answer: "En español e inglés. Para otros idiomas, contáctanos con anticipación." },
        ],
      },
    },
  });

  // ── Wholesale Packages ────────────────────────────────────────────
  const wholesalePackagesData = [
    {
      slug: "medellin-essentials", name: "Medellín Essentials",
      duration: "2D / 1N", durationDays: 2, category: "Ciudad",
      destinations: ["Medellín"], operatorCount: 2,
      experiences: ["Tour Ciudad Innovación", "Chiva Nocturna Premium", "Visita El Poblado"],
      netRate: 185, commission: 18, minPax: 2, maxPax: 20,
      highlight: false, badge: "Más vendido",
      coverImage: null,
      audiences: ["Entre amigos", "Parejas", "Cultura"],
      description: "El paquete de entrada perfecta a Medellín. En dos días tus clientes recorren los barrios más icónicos de la ciudad —desde la transformación urbana de las Comunas hasta la fiesta paisa de una Chiva nocturna— sin perder el ritmo ni el presupuesto.",
      itinerary: [
        { day: 1, title: "Medellín: innovación y cultura", activities: ["Recibimiento en aeropuerto o hotel (transfer incluido)", "Tour Ciudad Innovación: Metro Cable, Parque Explora, Jardín Botánico", "Almuerzo en el Mercado del Río (por cuenta del pasajero)", "Tarde libre en El Poblado — Parque Lleras y Zona Rosa", "Visita guiada nocturna a El Poblado"] },
        { day: 2, title: "Barrios y Chiva nocturna", activities: ["Tour grafiti y arte urbano en la Comuna 13 (incluido)", "Recorrido por el Centro Histórico — Plaza Botero", "Tarde libre para compras y gastronomía", "Chiva Nocturna Premium: 3 horas recorriendo los barrios iluminados de Medellín con música en vivo y aguardiente", "Traslado a hotel al finalizar"] },
      ],
      included: ["1 noche de alojamiento en hotel 3★ en El Poblado", "Transporte en vehículo privado entre actividades", "Guía bilingüe certificado (español / inglés)", "Tour Ciudad Innovación completo", "Tour grafiti Comuna 13", "Chiva Nocturna Premium con bebida de bienvenida", "Seguro de asistencia en viaje"],
      excluded: ["Tiquetes aéreos", "Comidas y bebidas no indicadas", "Gastos personales", "Propinas"],
      paxPricing: [{ label: "2–3 pax", netRatePP: 185, commission: 18 }, { label: "4–7 pax", netRatePP: 170, commission: 20 }, { label: "8–15 pax", netRatePP: 155, commission: 22 }, { label: "16+ pax", netRatePP: null, commission: null, note: "Consultar" }],
      operatorBreakdown: [{ name: "Turtle Bus", experience: "Tour Ciudad Innovación + Chiva Nocturna Premium" }, { name: "Metro Cultura", experience: "Tour grafiti y arte urbano, visita El Poblado" }],
      cancelPolicy: "Cancelación gratuita hasta 7 días antes de la fecha de inicio. Entre 7 y 3 días: 50% de penalidad. Menos de 72 horas: sin reembolso.",
      sortOrder: 1,
    },
    {
      slug: "guatape-weekend", name: "Guatapé Weekend",
      duration: "2D / 1N", durationDays: 2, category: "Naturaleza",
      destinations: ["Guatapé", "Medellín"], operatorCount: 2,
      experiences: ["Guatapé + El Peñol", "Paseo en lancha", "Tour zócalos", "Atardecer en el embalse"],
      netRate: 220, commission: 20, minPax: 2, maxPax: 15,
      highlight: false, badge: null,
      coverImage: null,
      audiences: ["Parejas", "Entre amigos", "Familias", "Relax"],
      description: "El pueblo más colorido de Colombia en un fin de semana completo. Subida a la Piedra del Peñol, paseo en lancha por el embalse y una noche en el corazón de Guatapé para vivir el ritmo local sin apuros.",
      itinerary: [
        { day: 1, title: "Guatapé: el pueblo y la piedra", activities: ["Salida desde Medellín en transporte privado (2h)", "Subida a La Piedra del Peñol (649 escalones, vista 360°)", "Almuerzo tradicional en el pueblo (bandeja paisa — incluida)", "Recorrido guiado por los zócalos del pueblo", "Check-in en hostal boutique frente al embalse", "Tarde libre para explorar el malecón"] },
        { day: 2, title: "Embalse y regreso", activities: ["Desayuno en el hostal (incluido)", "Paseo en lancha privada por el embalse (1.5 horas)", "Visita a islas y miradores del embalse", "Almuerzo de pescado fresco (por cuenta del pasajero)", "Regreso a Medellín en transporte privado"] },
      ],
      included: ["1 noche en hostal boutique frente al embalse", "Transporte privado Medellín – Guatapé – Medellín", "Entrada a La Piedra del Peñol", "Almuerzo día 1 (bandeja paisa)", "Desayuno día 2", "Paseo en lancha privada 1.5h", "Guía especializado Guatapé Travel", "Seguro de asistencia en viaje"],
      excluded: ["Tiquetes aéreos", "Comidas no indicadas", "Bebidas alcohólicas", "Gastos personales"],
      paxPricing: [{ label: "2–3 pax", netRatePP: 220, commission: 20 }, { label: "4–7 pax", netRatePP: 200, commission: 22 }, { label: "8–15 pax", netRatePP: 185, commission: 22 }, { label: "16+ pax", netRatePP: null, commission: null, note: "Consultar" }],
      operatorBreakdown: [{ name: "Guatapé Travel", experience: "Guía local, lancha, zócalos y logística en Guatapé" }, { name: "Turtle Bus", experience: "Transporte privado Medellín – Guatapé – Medellín" }],
      cancelPolicy: "Cancelación gratuita hasta 5 días antes. Entre 5 y 2 días: 50% de penalidad. Menos de 48 horas: sin reembolso.",
      sortOrder: 2,
    },
    {
      slug: "antioquia-explorer", name: "Antioquia Explorer",
      duration: "4D / 3N", durationDays: 4, category: "Cultural",
      destinations: ["Medellín", "Guatapé", "Jardín"], operatorCount: 4,
      experiences: ["Tour ciudad completo", "Guatapé día completo", "Aventura en Jardín", "Chiva + noche paisa"],
      netRate: 520, commission: 22, minPax: 2, maxPax: 12,
      highlight: true, badge: "Destacado",
      coverImage: null,
      audiences: ["Entre amigos", "Grupos", "Cultura"],
      description: "El gran recorrido por Antioquia. Cuatro días que combinan innovación urbana, naturaleza espectacular y tradición cafetera. El paquete más completo del catálogo y el que mejor convierte en viajeros de alto valor.",
      itinerary: [
        { day: 1, title: "Bienvenida a Medellín", activities: ["Transfer aeropuerto / hotel", "Tour barrio El Poblado y Parque Lleras", "Visita al Museo de Antioquia y Plaza Botero", "Cena de bienvenida en restaurante paisa (incluida)"] },
        { day: 2, title: "Ciudad de la innovación", activities: ["Metro Cable hasta Santo Domingo", "Tour Parque Explora + Planetario de Medellín", "Recorrido por la Comuna 13 con artistas locales", "Tarde libre en Laureles", "Chiva Nocturna Premium con música en vivo"] },
        { day: 3, title: "Guatapé y El Peñol", activities: ["Salida temprana hacia Guatapé", "Subida a La Piedra del Peñol (vista 360°)", "Almuerzo típico en Guatapé (incluido)", "Paseo en lancha por el embalse", "Recorrido por los zócalos del pueblo", "Regreso a Medellín"] },
        { day: 4, title: "Aventura en Jardín", activities: ["Salida hacia Jardín (2.5h desde Medellín)", "Senderismo hasta cascada La Escalera", "Recorrido por el Parque Principal y arquitectura republicana", "Café de origen: visita a finca cafetera con cata incluida", "Regreso a Medellín y traslado a aeropuerto"] },
      ],
      included: ["3 noches en hotel 3★ El Poblado", "Todos los traslados en vehículo privado", "Guía bilingüe durante todo el recorrido", "Cena bienvenida día 1", "Almuerzo típico día 3 (Guatapé)", "Entrada a La Piedra del Peñol", "Paseo en lancha privada", "Chiva Nocturna Premium", "Visita finca cafetera con cata", "Seguro de asistencia en viaje"],
      excluded: ["Tiquetes aéreos", "Comidas no indicadas", "Bebidas adicionales", "Gastos personales y propinas"],
      paxPricing: [{ label: "2–3 pax", netRatePP: 520, commission: 22 }, { label: "4–7 pax", netRatePP: 490, commission: 23 }, { label: "8–12 pax", netRatePP: 460, commission: 25 }, { label: "13+ pax", netRatePP: null, commission: null, note: "Consultar" }],
      operatorBreakdown: [{ name: "Turtle Bus", experience: "Transporte privado todo el recorrido" }, { name: "Metro Cultura", experience: "Tour grafiti, innovación y vida nocturna" }, { name: "Guatapé Travel", experience: "Guatapé, El Peñol y embalse" }, { name: "Colombia Coffee Routes", experience: "Aventura en Jardín y finca cafetera" }],
      cancelPolicy: "Cancelación gratuita hasta 10 días antes. Entre 10 y 5 días: 30% de penalidad. Entre 5 y 2 días: 60%. Menos de 48 horas: sin reembolso.",
      sortOrder: 3,
    },
    {
      slug: "colombia-cultural", name: "Colombia Cultural",
      duration: "5D / 4N", durationDays: 5, category: "Cultural",
      destinations: ["Medellín", "Guatapé", "Jardín"], operatorCount: 5,
      experiences: ["Tour grafiti Medellín", "Guatapé completo", "Ruta del café", "Mercado artesanal", "Chiva VIP"],
      netRate: 680, commission: 22, minPax: 2, maxPax: 10,
      highlight: false, badge: null,
      coverImage: null,
      audiences: ["Parejas", "Cultura", "Relax"],
      description: "Para agencias que trabajan con viajeros culturales de alto valor. Cinco días en los que Medellín, Guatapé y la región cafetera cuentan la historia de Colombia desde sus manifestaciones más auténticas: arte, gastronomía, tradición y transformación social.",
      itinerary: [
        { day: 1, title: "Llegada y primer contacto", activities: ["Transfer aeropuerto y check-in", "Tarde libre para aclimatarse al ritmo de la ciudad", "Cena de bienvenida en restaurante de cocina colombiana contemporánea (incluida)"] },
        { day: 2, title: "Arte urbano y transformación", activities: ["Tour grafiti y arte urbano — Comunas 13 y 4", "Visita al Centro de Desarrollo Cultural de Moravia", "Recorrido fotográfico por el Centro Histórico", "Almuerzo en el Mercado del Río (incluido)", "Tarde: Museo de Arte Moderno de Medellín"] },
        { day: 3, title: "Guatapé completo", activities: ["Día completo en Guatapé: El Peñol, lancha, zócalos", "Almuerzo de trucha fresca (incluido)", "Visita al taller de un artesano local de zócalos", "Regreso y Chiva VIP con degustación de coctelería artesanal"] },
        { day: 4, title: "Ruta del café en Jardín", activities: ["Salida hacia Jardín", "Visita a finca cafetera de origen con proceso de beneficio", "Cata de café especial con barista certificado", "Mercado artesanal de productores locales", "Almuerzo campesino en la finca (incluido)", "Regreso a Medellín"] },
        { day: 5, title: "Innovación y despedida", activities: ["Tour Distrito de Innovación — Ruta N y hub tecnológico", "Tiempo libre para compras en centros artesanales", "Almuerzo libre", "Transfer al aeropuerto"] },
      ],
      included: ["4 noches en hotel 4★ en El Poblado", "Todos los traslados en vehículo privado", "Guía cultural bilingüe certificado", "Cena bienvenida día 1", "Almuerzo días 2, 3 y 4", "Entrada a museos indicados", "Paseo en lancha Guatapé", "Chiva VIP con coctelería artesanal", "Visita finca cafetera con cata de especialidad", "Visita taller artesanal zócalos", "Seguro de asistencia en viaje"],
      excluded: ["Tiquetes aéreos", "Comidas no indicadas", "Bebidas adicionales", "Propinas y gastos personales"],
      paxPricing: [{ label: "2–3 pax", netRatePP: 680, commission: 22 }, { label: "4–7 pax", netRatePP: 640, commission: 23 }, { label: "8–10 pax", netRatePP: 600, commission: 25 }, { label: "11+ pax", netRatePP: null, commission: null, note: "Consultar" }],
      operatorBreakdown: [{ name: "Turtle Bus", experience: "Transporte privado y logística general" }, { name: "Metro Cultura", experience: "Tour arte urbano, museos, Distrito de Innovación" }, { name: "Guatapé Travel", experience: "Día completo en Guatapé y Chiva VIP" }, { name: "Colombia Coffee Routes", experience: "Ruta del café y finca cafetera en Jardín" }, { name: "Chivas & Trolley Tours", experience: "Chiva VIP con coctelería artesanal" }],
      cancelPolicy: "Cancelación gratuita hasta 14 días antes. Entre 14 y 7 días: 25% de penalidad. Entre 7 y 3 días: 60%. Menos de 72 horas: sin reembolso.",
      sortOrder: 4,
    },
    {
      slug: "medellin-vip", name: "Medellín VIP",
      duration: "3D / 2N", durationDays: 3, category: "Premium",
      destinations: ["Medellín"], operatorCount: 3,
      experiences: ["Tour privado ciudad", "Parapente Medellín", "Cena gourmet + Chiva Premium"],
      netRate: 890, commission: 25, minPax: 2, maxPax: 8,
      highlight: false, badge: "Premium",
      coverImage: null,
      audiences: ["Parejas", "Premium", "Relax"],
      description: "El producto de mayor margen del catálogo. Diseñado para viajeros premium que exigen privacidad, personalización y experiencias únicas. Grupos pequeños, guía exclusivo y acceso a actividades que no están disponibles en el mercado masivo.",
      itinerary: [
        { day: 1, title: "Recibimiento VIP y ciudad privada", activities: ["Recibimiento en sala VIP del aeropuerto y transfer en vehículo premium", "Check-in prioritario en hotel 5★ El Poblado", "Tour privado ciudad: sin grupos, vehículo exclusivo, guía senior", "Acceso privado a la terraza panorámica del Edificio Coltejer", "Cena gourmet maridada en restaurante El Cielo (reserva incluida)"] },
        { day: 2, title: "Parapente y experiencia aérea", activities: ["Desayuno en el hotel", "Traslado privado a la zona de vuelo (Las Palmas)", "Sesión de parapente biplaza con instructor certificado (30–40 min de vuelo)", "Almuerzo panorámico con vista a la ciudad (incluido)", "Tarde libre: spa en el hotel o shopping en El Tesoro", "Chiva Premium exclusiva: grupo privado, barra libre premium, música en vivo"] },
        { day: 3, title: "Última mañana y partida", activities: ["Desayuno tardío en el hotel", "Experiencia de cocina colombiana: clase con chef local (opcional, incluida)", "Check-out tardío (hasta las 14:00)", "Transfer premium al aeropuerto"] },
      ],
      included: ["2 noches en hotel 5★ El Poblado con desayunos", "Transfer en vehículo premium (SUV o minivan)", "Guía senior bilingüe en exclusiva", "Tour privado ciudad con acceso a puntos exclusivos", "Sesión de parapente biplaza certificado", "Almuerzo panorámico día 2", "Cena gourmet maridada El Cielo", "Chiva Premium privada con barra libre premium", "Clase de cocina colombiana con chef", "Seguro de asistencia en viaje premium"],
      excluded: ["Tiquetes aéreos", "Consumos adicionales fuera de la barra libre", "Gastos personales y propinas"],
      paxPricing: [{ label: "2–3 pax", netRatePP: 890, commission: 25 }, { label: "4–6 pax", netRatePP: 850, commission: 25 }, { label: "7–8 pax", netRatePP: 810, commission: 25 }, { label: "9+ pax", netRatePP: null, commission: null, note: "Consultar" }],
      operatorBreakdown: [{ name: "Aeroturex", experience: "Parapente biplaza con instructor certificado" }, { name: "Metro Cultura", experience: "Tour privado ciudad y accesos exclusivos" }, { name: "Chivas & Trolley Tours", experience: "Chiva Premium privada con barra libre" }],
      cancelPolicy: "Cancelación gratuita hasta 14 días antes. Entre 14 y 7 días: 40% de penalidad. Menos de 7 días: sin reembolso. Para grupos de 6+, política especial aplica.",
      sortOrder: 5,
    },
    {
      slug: "nature-innovation", name: "Nature & Innovation",
      duration: "4D / 3N", durationDays: 4, category: "Aventura",
      destinations: ["Medellín", "Guatapé"], operatorCount: 4,
      experiences: ["Parques naturales Medellín", "Innovación urbana", "Kayak en Guatapé", "Rapel + tirolesa"],
      netRate: 560, commission: 20, minPax: 4, maxPax: 16,
      highlight: false, badge: null,
      coverImage: null,
      audiences: ["Adrenalina", "Entre amigos", "Grupos"],
      description: "Para segmentos de aventura y ecoturismo. Cuatro días alternando la naturaleza verde de los parques de Medellín, la tecnología del Distrito de Innovación y la adrenalina de los deportes acuáticos y de altura en Guatapé.",
      itinerary: [
        { day: 1, title: "Verde urbano de Medellín", activities: ["Transfer aeropuerto y check-in", "Jardín Botánico de Medellín — visita guiada", "Parque Arví: senderismo y avistamiento de aves", "Cable Metrocable hasta el parque", "Almuerzo campestre en Parque Arví (incluido)"] },
        { day: 2, title: "Innovación y adrenalina urbana", activities: ["Tour Distrito de Innovación — Ruta N", "Visita al Centro de Ciencia Parque Explora", "Tarde: escalada en roca en el complejo deportivo Los Bernal", "Noche libre en El Poblado"] },
        { day: 3, title: "Kayak y aventura en Guatapé", activities: ["Salida hacia Guatapé (2h)", "Kayak en el embalse (2 horas con guía certificado)", "Almuerzo de trucha (incluido)", "Rapel en La Piedra del Peñol — cara norte (1 descenso incluido)", "Tirolesa panorámica sobre el embalse", "Regreso a Medellín"] },
        { day: 4, title: "Morning run y cierre", activities: ["Salida en bicicleta por el Parque Lineal La Presidenta", "Brunch incluido en restaurante saludable", "Tiempo libre para compras", "Transfer al aeropuerto"] },
      ],
      included: ["3 noches en hotel 3★ El Poblado", "Transporte privado en minivan", "Guía de aventura certificado", "Entrada Parque Arví y cable", "Almuerzo días 1 y 3", "Kayak 2h en Guatapé", "Rapel en La Piedra del Peñol", "Tirolesa panorámica embalse", "Brunch día 4", "Seguro de aventura y asistencia en viaje"],
      excluded: ["Tiquetes aéreos", "Comidas no indicadas", "Bebidas adicionales", "Equipo fotográfico de aventura (disponible para alquiler)", "Propinas"],
      paxPricing: [{ label: "4–7 pax", netRatePP: 560, commission: 20 }, { label: "8–11 pax", netRatePP: 530, commission: 22 }, { label: "12–16 pax", netRatePP: 500, commission: 22 }, { label: "17+ pax", netRatePP: null, commission: null, note: "Consultar" }],
      operatorBreakdown: [{ name: "Aeroturex", experience: "Kayak, rapel y tirolesa en Guatapé" }, { name: "Turtle Bus", experience: "Transporte privado y logística" }, { name: "Metro Cultura", experience: "Tour innovación y Parque Explora" }, { name: "Guatapé Travel", experience: "Coordinación en Guatapé y el embalse" }],
      cancelPolicy: "Cancelación gratuita hasta 7 días antes. Entre 7 y 3 días: 40% de penalidad. Menos de 72 horas: sin reembolso. Actividades de aventura sujetas a condiciones climáticas.",
      sortOrder: 6,
    },
  ];

  for (const pkg of wholesalePackagesData) {
    await prisma.wholesalePackage.upsert({
      where: { slug: pkg.slug },
      update: {
        netRate: pkg.netRate,
        commission: pkg.commission,
        highlight: pkg.highlight,
        badge: pkg.badge,
        audiences: pkg.audiences,
        coverImage: pkg.coverImage,
      },
      create: pkg,
    });
  }

  console.log("✅ Seed complete.");
  console.log(`   ${destinations.length} destinos`);
  console.log(`   ${categories.length} categorías`);
  console.log(`   ${operators.length} operadores`);
  console.log(`   ${toursData.length} tours`);
  console.log(`   ${wholesalePackagesData.length} paquetes mayoristas`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
