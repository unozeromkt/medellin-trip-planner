export type PaxPricing = {
  label: string;
  netRatePP: number | null;
  commission: number | null;
  note?: string;
};

export type OperatorInPackage = {
  name: string;
  experience: string;
};

export type ItineraryDay = {
  day: number;
  title: string;
  activities: string[];
};

export type WholesalePackage = {
  id: string;
  slug: string;
  name: string;
  duration: string;
  durationDays: number;
  category: string;
  destinations: string[];
  operatorCount: number;
  experiences: string[];
  netRate: number;
  commission: number;
  minPax: number;
  maxPax: number;
  highlight: boolean;
  badge: string | null;
  // Detail fields
  description: string;
  itinerary: ItineraryDay[];
  included: string[];
  excluded: string[];
  paxPricing: PaxPricing[];
  operatorBreakdown: OperatorInPackage[];
  cancelPolicy: string;
};

export const wholesalePackages: WholesalePackage[] = [
  {
    id: "pkg-1",
    slug: "medellin-essentials",
    name: "Medellín Essentials",
    duration: "2D / 1N",
    durationDays: 2,
    category: "Ciudad",
    destinations: ["Medellín"],
    operatorCount: 2,
    experiences: ["Tour Ciudad Innovación", "Chiva Nocturna Premium", "Visita El Poblado"],
    netRate: 185,
    commission: 18,
    minPax: 2,
    maxPax: 20,
    highlight: false,
    badge: "Más vendido",
    description:
      "El paquete de entrada perfecta a Medellín. En dos días tus clientes recorren los barrios más icónicos de la ciudad —desde la transformación urbana de las Comunas hasta la fiesta paisa de una Chiva nocturna— sin perder el ritmo ni el presupuesto.",
    itinerary: [
      {
        day: 1,
        title: "Medellín: innovación y cultura",
        activities: [
          "Recibimiento en aeropuerto o hotel (transfer incluido)",
          "Tour Ciudad Innovación: Metro Cable, Parque Explora, Jardín Botánico",
          "Almuerzo en el Mercado del Río (por cuenta del pasajero)",
          "Tarde libre en El Poblado — Parque Lleras y Zona Rosa",
          "Visita guiada nocturna a El Poblado",
        ],
      },
      {
        day: 2,
        title: "Barrios y Chiva nocturna",
        activities: [
          "Tour grafiti y arte urbano en la Comuna 13 (incluido)",
          "Recorrido por el Centro Histórico — Plaza Botero",
          "Tarde libre para compras y gastronomía",
          "Chiva Nocturna Premium: 3 horas recorriendo los barrios iluminados de Medellín con música en vivo y aguardiente",
          "Traslado a hotel al finalizar",
        ],
      },
    ],
    included: [
      "1 noche de alojamiento en hotel 3★ en El Poblado",
      "Transporte en vehículo privado entre actividades",
      "Guía bilingüe certificado (español / inglés)",
      "Tour Ciudad Innovación completo",
      "Tour grafiti Comuna 13",
      "Chiva Nocturna Premium con bebida de bienvenida",
      "Seguro de asistencia en viaje",
    ],
    excluded: [
      "Tiquetes aéreos",
      "Comidas y bebidas no indicadas",
      "Gastos personales",
      "Propinas",
    ],
    paxPricing: [
      { label: "2–3 pax", netRatePP: 185, commission: 18 },
      { label: "4–7 pax", netRatePP: 170, commission: 20 },
      { label: "8–15 pax", netRatePP: 155, commission: 22 },
      { label: "16+ pax", netRatePP: null, commission: null, note: "Consultar" },
    ],
    operatorBreakdown: [
      { name: "Turtle Bus", experience: "Tour Ciudad Innovación + Chiva Nocturna Premium" },
      { name: "Metro Cultura", experience: "Tour grafiti y arte urbano, visita El Poblado" },
    ],
    cancelPolicy:
      "Cancelación gratuita hasta 7 días antes de la fecha de inicio. Entre 7 y 3 días: 50% de penalidad. Menos de 72 horas: sin reembolso.",
  },
  {
    id: "pkg-2",
    slug: "guatape-weekend",
    name: "Guatapé Weekend",
    duration: "2D / 1N",
    durationDays: 2,
    category: "Naturaleza",
    destinations: ["Guatapé", "Medellín"],
    operatorCount: 2,
    experiences: ["Guatapé + El Peñol", "Paseo en lancha", "Tour zócalos", "Atardecer en el embalse"],
    netRate: 220,
    commission: 20,
    minPax: 2,
    maxPax: 15,
    highlight: false,
    badge: null,
    description:
      "El pueblo más colorido de Colombia en un fin de semana completo. Subida a la Piedra del Peñol, paseo en lancha por el embalse y una noche en el corazón de Guatapé para vivir el ritmo local sin apuros.",
    itinerary: [
      {
        day: 1,
        title: "Guatapé: el pueblo y la piedra",
        activities: [
          "Salida desde Medellín en transporte privado (2h)",
          "Subida a La Piedra del Peñol (649 escalones, vista 360°)",
          "Almuerzo tradicional en el pueblo (bandeja paisa — incluida)",
          "Recorrido guiado por los zócalos del pueblo",
          "Check-in en hostal boutique frente al embalse",
          "Tarde libre para explorar el malecón",
        ],
      },
      {
        day: 2,
        title: "Embalse y regreso",
        activities: [
          "Desayuno en el hostal (incluido)",
          "Paseo en lancha privada por el embalse (1.5 horas)",
          "Visita a islas y miradores del embalse",
          "Almuerzo de pescado fresco (por cuenta del pasajero)",
          "Regreso a Medellín en transporte privado",
        ],
      },
    ],
    included: [
      "1 noche en hostal boutique frente al embalse",
      "Transporte privado Medellín – Guatapé – Medellín",
      "Entrada a La Piedra del Peñol",
      "Almuerzo día 1 (bandeja paisa)",
      "Desayuno día 2",
      "Paseo en lancha privada 1.5h",
      "Guía especializado Guatapé Travel",
      "Seguro de asistencia en viaje",
    ],
    excluded: [
      "Tiquetes aéreos",
      "Comidas no indicadas",
      "Bebidas alcohólicas",
      "Gastos personales",
    ],
    paxPricing: [
      { label: "2–3 pax", netRatePP: 220, commission: 20 },
      { label: "4–7 pax", netRatePP: 200, commission: 22 },
      { label: "8–15 pax", netRatePP: 185, commission: 22 },
      { label: "16+ pax", netRatePP: null, commission: null, note: "Consultar" },
    ],
    operatorBreakdown: [
      { name: "Guatapé Travel", experience: "Guía local, lancha, zócalos y logística en Guatapé" },
      { name: "Turtle Bus", experience: "Transporte privado Medellín – Guatapé – Medellín" },
    ],
    cancelPolicy:
      "Cancelación gratuita hasta 5 días antes. Entre 5 y 2 días: 50% de penalidad. Menos de 48 horas: sin reembolso.",
  },
  {
    id: "pkg-3",
    slug: "antioquia-explorer",
    name: "Antioquia Explorer",
    duration: "4D / 3N",
    durationDays: 4,
    category: "Cultural",
    destinations: ["Medellín", "Guatapé", "Jardín"],
    operatorCount: 4,
    experiences: ["Tour ciudad completo", "Guatapé día completo", "Aventura en Jardín", "Chiva + noche paisa"],
    netRate: 520,
    commission: 22,
    minPax: 2,
    maxPax: 12,
    highlight: true,
    badge: "Destacado",
    description:
      "El gran recorrido por Antioquia. Cuatro días que combinan innovación urbana, naturaleza espectacular y tradición cafetera. El paquete más completo del catálogo y el que mejor convierte en viajeros de alto valor.",
    itinerary: [
      {
        day: 1,
        title: "Bienvenida a Medellín",
        activities: [
          "Transfer aeropuerto / hotel",
          "Tour barrio El Poblado y Parque Lleras",
          "Visita al Museo de Antioquia y Plaza Botero",
          "Cena de bienvenida en restaurante paisa (incluida)",
        ],
      },
      {
        day: 2,
        title: "Ciudad de la innovación",
        activities: [
          "Metro Cable hasta Santo Domingo",
          "Tour Parque Explora + Planetario de Medellín",
          "Recorrido por la Comuna 13 con artistas locales",
          "Tarde libre en Laureles",
          "Chiva Nocturna Premium con música en vivo",
        ],
      },
      {
        day: 3,
        title: "Guatapé y El Peñol",
        activities: [
          "Salida temprana hacia Guatapé",
          "Subida a La Piedra del Peñol (vista 360°)",
          "Almuerzo típico en Guatapé (incluido)",
          "Paseo en lancha por el embalse",
          "Recorrido por los zócalos del pueblo",
          "Regreso a Medellín",
        ],
      },
      {
        day: 4,
        title: "Aventura en Jardín",
        activities: [
          "Salida hacia Jardín (2.5h desde Medellín)",
          "Senderismo hasta cascada La Escalera",
          "Recorrido por el Parque Principal y arquitectura republicana",
          "Café de origen: visita a finca cafetera con cata incluida",
          "Regreso a Medellín y traslado a aeropuerto",
        ],
      },
    ],
    included: [
      "3 noches en hotel 3★ El Poblado",
      "Todos los traslados en vehículo privado",
      "Guía bilingüe durante todo el recorrido",
      "Cena bienvenida día 1",
      "Almuerzo típico día 3 (Guatapé)",
      "Entrada a La Piedra del Peñol",
      "Paseo en lancha privada",
      "Chiva Nocturna Premium",
      "Visita finca cafetera con cata",
      "Seguro de asistencia en viaje",
    ],
    excluded: [
      "Tiquetes aéreos",
      "Comidas no indicadas",
      "Bebidas adicionales",
      "Gastos personales y propinas",
    ],
    paxPricing: [
      { label: "2–3 pax", netRatePP: 520, commission: 22 },
      { label: "4–7 pax", netRatePP: 490, commission: 23 },
      { label: "8–12 pax", netRatePP: 460, commission: 25 },
      { label: "13+ pax", netRatePP: null, commission: null, note: "Consultar" },
    ],
    operatorBreakdown: [
      { name: "Turtle Bus", experience: "Transporte privado todo el recorrido" },
      { name: "Metro Cultura", experience: "Tour grafiti, innovación y vida nocturna" },
      { name: "Guatapé Travel", experience: "Guatapé, El Peñol y embalse" },
      { name: "Colombia Coffee Routes", experience: "Aventura en Jardín y finca cafetera" },
    ],
    cancelPolicy:
      "Cancelación gratuita hasta 10 días antes. Entre 10 y 5 días: 30% de penalidad. Entre 5 y 2 días: 60%. Menos de 48 horas: sin reembolso.",
  },
  {
    id: "pkg-4",
    slug: "colombia-cultural",
    name: "Colombia Cultural",
    duration: "5D / 4N",
    durationDays: 5,
    category: "Cultural",
    destinations: ["Medellín", "Guatapé", "Jardín"],
    operatorCount: 5,
    experiences: ["Tour grafiti Medellín", "Guatapé completo", "Ruta del café", "Mercado artesanal", "Chiva VIP"],
    netRate: 680,
    commission: 22,
    minPax: 2,
    maxPax: 10,
    highlight: false,
    badge: null,
    description:
      "Para agencias que trabajan con viajeros culturales de alto valor. Cinco días en los que Medellín, Guatapé y la región cafetera cuentan la historia de Colombia desde sus manifestaciones más auténticas: arte, gastronomía, tradición y transformación social.",
    itinerary: [
      {
        day: 1,
        title: "Llegada y primer contacto",
        activities: [
          "Transfer aeropuerto y check-in",
          "Tarde libre para aclimatarse al ritmo de la ciudad",
          "Cena de bienvenida en restaurante de cocina colombiana contemporánea (incluida)",
        ],
      },
      {
        day: 2,
        title: "Arte urbano y transformación",
        activities: [
          "Tour grafiti y arte urbano — Comunas 13 y 4",
          "Visita al Centro de Desarrollo Cultural de Moravia",
          "Recorrido fotográfico por el Centro Histórico",
          "Almuerzo en el Mercado del Río (incluido)",
          "Tarde: Museo de Arte Moderno de Medellín",
        ],
      },
      {
        day: 3,
        title: "Guatapé completo",
        activities: [
          "Día completo en Guatapé: El Peñol, lancha, zócalos",
          "Almuerzo de trucha fresca (incluido)",
          "Visita al taller de un artesano local de zócalos",
          "Regreso y Chiva VIP con degustación de coctelería artesanal",
        ],
      },
      {
        day: 4,
        title: "Ruta del café en Jardín",
        activities: [
          "Salida hacia Jardín",
          "Visita a finca cafetera de origen con proceso de beneficio",
          "Cata de café especial con barista certificado",
          "Mercado artesanal de productores locales",
          "Almuerzo campesino en la finca (incluido)",
          "Regreso a Medellín",
        ],
      },
      {
        day: 5,
        title: "Innovación y despedida",
        activities: [
          "Tour Distrito de Innovación — Ruta N y hub tecnológico",
          "Tiempo libre para compras en centros artesanales",
          "Almuerzo libre",
          "Transfer al aeropuerto",
        ],
      },
    ],
    included: [
      "4 noches en hotel 4★ en El Poblado",
      "Todos los traslados en vehículo privado",
      "Guía cultural bilingüe certificado",
      "Cena bienvenida día 1",
      "Almuerzo días 2, 3 y 4",
      "Entrada a museos indicados",
      "Paseo en lancha Guatapé",
      "Chiva VIP con coctelería artesanal",
      "Visita finca cafetera con cata de especialidad",
      "Visita taller artesanal zócalos",
      "Seguro de asistencia en viaje",
    ],
    excluded: [
      "Tiquetes aéreos",
      "Comidas no indicadas",
      "Bebidas adicionales",
      "Propinas y gastos personales",
    ],
    paxPricing: [
      { label: "2–3 pax", netRatePP: 680, commission: 22 },
      { label: "4–7 pax", netRatePP: 640, commission: 23 },
      { label: "8–10 pax", netRatePP: 600, commission: 25 },
      { label: "11+ pax", netRatePP: null, commission: null, note: "Consultar" },
    ],
    operatorBreakdown: [
      { name: "Turtle Bus", experience: "Transporte privado y logística general" },
      { name: "Metro Cultura", experience: "Tour arte urbano, museos, Distrito de Innovación" },
      { name: "Guatapé Travel", experience: "Día completo en Guatapé y Chiva VIP" },
      { name: "Colombia Coffee Routes", experience: "Ruta del café y finca cafetera en Jardín" },
      { name: "Chivas & Trolley Tours", experience: "Chiva VIP con coctelería artesanal" },
    ],
    cancelPolicy:
      "Cancelación gratuita hasta 14 días antes. Entre 14 y 7 días: 25% de penalidad. Entre 7 y 3 días: 60%. Menos de 72 horas: sin reembolso.",
  },
  {
    id: "pkg-5",
    slug: "medellin-vip",
    name: "Medellín VIP",
    duration: "3D / 2N",
    durationDays: 3,
    category: "Premium",
    destinations: ["Medellín"],
    operatorCount: 3,
    experiences: ["Tour privado ciudad", "Parapente Medellín", "Cena gourmet + Chiva Premium"],
    netRate: 890,
    commission: 25,
    minPax: 2,
    maxPax: 8,
    highlight: false,
    badge: "Premium",
    description:
      "El producto de mayor margen del catálogo. Diseñado para viajeros premium que exigen privacidad, personalización y experiencias únicas. Grupos pequeños, guía exclusivo y acceso a actividades que no están disponibles en el mercado masivo.",
    itinerary: [
      {
        day: 1,
        title: "Recibimiento VIP y ciudad privada",
        activities: [
          "Recibimiento en sala VIP del aeropuerto y transfer en vehículo premium",
          "Check-in prioritario en hotel 5★ El Poblado",
          "Tour privado ciudad: sin grupos, vehículo exclusivo, guía senior",
          "Acceso privado a la terraza panorámica del Edificio Coltejer",
          "Cena gourmet maridada en restaurante El Cielo (reserva incluida)",
        ],
      },
      {
        day: 2,
        title: "Parapente y experiencia aérea",
        activities: [
          "Desayuno en el hotel",
          "Traslado privado a la zona de vuelo (Las Palmas)",
          "Sesión de parapente biplaza con instructor certificado (30–40 min de vuelo)",
          "Almuerzo panorámico con vista a la ciudad (incluido)",
          "Tarde libre: spa en el hotel o shopping en El Tesoro",
          "Chiva Premium exclusiva: grupo privado, barra libre premium, música en vivo",
        ],
      },
      {
        day: 3,
        title: "Última mañana y partida",
        activities: [
          "Desayuno tardío en el hotel",
          "Experiencia de cocina colombiana: clase con chef local (opcional, incluida)",
          "Check-out tardío (hasta las 14:00)",
          "Transfer premium al aeropuerto",
        ],
      },
    ],
    included: [
      "2 noches en hotel 5★ El Poblado con desayunos",
      "Transfer en vehículo premium (SUV o minivan)",
      "Guía senior bilingüe en exclusiva",
      "Tour privado ciudad con acceso a puntos exclusivos",
      "Sesión de parapente biplaza certificado",
      "Almuerzo panorámico día 2",
      "Cena gourmet maridada El Cielo",
      "Chiva Premium privada con barra libre premium",
      "Clase de cocina colombiana con chef",
      "Seguro de asistencia en viaje premium",
    ],
    excluded: [
      "Tiquetes aéreos",
      "Consumos adicionales fuera de la barra libre",
      "Gastos personales y propinas",
    ],
    paxPricing: [
      { label: "2–3 pax", netRatePP: 890, commission: 25 },
      { label: "4–6 pax", netRatePP: 850, commission: 25 },
      { label: "7–8 pax", netRatePP: 810, commission: 25 },
      { label: "9+ pax", netRatePP: null, commission: null, note: "Consultar" },
    ],
    operatorBreakdown: [
      { name: "Aeroturex", experience: "Parapente biplaza con instructor certificado" },
      { name: "Metro Cultura", experience: "Tour privado ciudad y accesos exclusivos" },
      { name: "Chivas & Trolley Tours", experience: "Chiva Premium privada con barra libre" },
    ],
    cancelPolicy:
      "Cancelación gratuita hasta 14 días antes. Entre 14 y 7 días: 40% de penalidad. Menos de 7 días: sin reembolso. Para grupos de 6+, política especial aplica.",
  },
  {
    id: "pkg-6",
    slug: "nature-innovation",
    name: "Nature & Innovation",
    duration: "4D / 3N",
    durationDays: 4,
    category: "Aventura",
    destinations: ["Medellín", "Guatapé"],
    operatorCount: 4,
    experiences: ["Parques naturales Medellín", "Innovación urbana", "Kayak en Guatapé", "Rapel + tirolesa"],
    netRate: 560,
    commission: 20,
    minPax: 4,
    maxPax: 16,
    highlight: false,
    badge: null,
    description:
      "Para segmentos de aventura y ecoturismo. Cuatro días alternando la naturaleza verde de los parques de Medellín, la tecnología del Distrito de Innovación y la adrenalina de los deportes acuáticos y de altura en Guatapé.",
    itinerary: [
      {
        day: 1,
        title: "Verde urbano de Medellín",
        activities: [
          "Transfer aeropuerto y check-in",
          "Jardín Botánico de Medellín — visita guiada",
          "Parque Arví: senderismo y avistamiento de aves",
          "Cable Metrocable hasta el parque",
          "Almuerzo campestre en Parque Arví (incluido)",
        ],
      },
      {
        day: 2,
        title: "Innovación y adrenalina urbana",
        activities: [
          "Tour Distrito de Innovación — Ruta N",
          "Visita al Centro de Ciencia Parque Explora",
          "Tarde: escalada en roca en el complejo deportivo Los Bernal",
          "Noche libre en El Poblado",
        ],
      },
      {
        day: 3,
        title: "Kayak y aventura en Guatapé",
        activities: [
          "Salida hacia Guatapé (2h)",
          "Kayak en el embalse (2 horas con guía certificado)",
          "Almuerzo de trucha (incluido)",
          "Rapel en La Piedra del Peñol — cara norte (1 descenso incluido)",
          "Tirolesa panorámica sobre el embalse",
          "Regreso a Medellín",
        ],
      },
      {
        day: 4,
        title: "Morning run y cierre",
        activities: [
          "Salida en bicicleta por el Parque Lineal La Presidenta",
          "Brunch incluido en restaurante saludable",
          "Tiempo libre para compras",
          "Transfer al aeropuerto",
        ],
      },
    ],
    included: [
      "3 noches en hotel 3★ El Poblado",
      "Transporte privado en minivan",
      "Guía de aventura certificado",
      "Entrada Parque Arví y cable",
      "Almuerzo días 1 y 3",
      "Kayak 2h en Guatapé",
      "Rapel en La Piedra del Peñol",
      "Tirolesa panorámica embalse",
      "Brunch día 4",
      "Seguro de aventura y asistencia en viaje",
    ],
    excluded: [
      "Tiquetes aéreos",
      "Comidas no indicadas",
      "Bebidas adicionales",
      "Equipo fotográfico de aventura (disponible para alquiler)",
      "Propinas",
    ],
    paxPricing: [
      { label: "4–7 pax", netRatePP: 560, commission: 20 },
      { label: "8–11 pax", netRatePP: 530, commission: 22 },
      { label: "12–16 pax", netRatePP: 500, commission: 22 },
      { label: "17+ pax", netRatePP: null, commission: null, note: "Consultar" },
    ],
    operatorBreakdown: [
      { name: "Aeroturex", experience: "Kayak, rapel y tirolesa en Guatapé" },
      { name: "Turtle Bus", experience: "Transporte privado y logística" },
      { name: "Metro Cultura", experience: "Tour innovación y Parque Explora" },
      { name: "Guatapé Travel", experience: "Coordinación en Guatapé y el embalse" },
    ],
    cancelPolicy:
      "Cancelación gratuita hasta 7 días antes. Entre 7 y 3 días: 40% de penalidad. Menos de 72 horas: sin reembolso. Actividades de aventura sujetas a condiciones climáticas.",
  },
];
