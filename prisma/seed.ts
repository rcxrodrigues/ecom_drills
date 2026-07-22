import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

type SeedImage = { url: string; alt: string };
type SeedVariant = {
  title: string;
  voltage?: string;
  colour?: string;
  kit?: string;
  sku: string;
  priceDelta?: number;
  stock: number;
};
type SeedReview = {
  authorName: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  verifiedPurchase: boolean;
  featured?: boolean;
  daysAgo: number;
};

type SeedProduct = {
  handle: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  salePrice?: number;
  sku: string;
  stock: number;
  power: string;
  voltage: string;
  batteryType: string;
  torque: string;
  weight: string;
  includedItems: string;
  specs: Record<string, string>;
  createdDaysAgo: number;
  images: SeedImage[];
  variants: SeedVariant[];
  collections: string[];
  reviews: SeedReview[];
};

const products: SeedProduct[] = [
  {
    handle: "20v-cordless-impact-drill-pro",
    name: "20V Cordless Impact Drill Pro",
    description:
      "Our best-selling drill driver, built for tradespeople and serious DIYers alike. Brushless motor delivers up to 60Nm of torque with a 20-position clutch for precise control on every fixing.",
    brand: "Toolvo",
    category: "Impact Drills",
    price: 89.99,
    salePrice: 67.49,
    sku: "TLV-IDP-20V",
    stock: 42,
    power: "Brushless motor, 400W equivalent",
    voltage: "20V",
    batteryType: "Li-Ion",
    torque: "60Nm",
    weight: "1.4kg",
    includedItems: "Drill body, 2x batteries, rapid charger, carry case, double-ended bit",
    specs: {
      "No-load speed": "0–450 / 0–1,750 rpm",
      Chuck: "13mm keyless, single sleeve",
      "Clutch settings": "20 + drill",
      Warranty: "3 years",
    },
    createdDaysAgo: 220,
    images: [
      { url: "illustration:impact-driver", alt: "20V Cordless Impact Drill Pro, front angle" },
      { url: "illustration:impact-driver", alt: "20V Cordless Impact Drill Pro, side profile" },
      { url: "illustration:battery", alt: "Included 20V battery" },
      { url: "illustration:case", alt: "Carry case included" },
    ],
    variants: [
      { title: "Bare Tool", kit: "Bare Tool", sku: "TLV-IDP-20V-BARE", priceDelta: -25, stock: 10 },
      { title: "1 Battery Kit", kit: "1 Battery Kit", sku: "TLV-IDP-20V-1B", priceDelta: 0, stock: 18 },
      { title: "2 Battery Kit", kit: "2 Battery Kit", sku: "TLV-IDP-20V-2B", priceDelta: 20, stock: 14 },
    ],
    collections: ["best-sellers", "impact-drills"],
    reviews: [
      {
        authorName: "Callum M.",
        location: "Leeds",
        rating: 5,
        title: "Brilliant for the price",
        body: "Been using this on site for three months now, holds up to daily use and the battery lasts a full day.",
        verifiedPurchase: true,
        featured: true,
        daysAgo: 40,
      },
      {
        authorName: "Priya S.",
        location: "Manchester",
        rating: 5,
        title: "Great for home projects",
        body: "Put together a whole flat-pack wardrobe without the battery even getting close to flat.",
        verifiedPurchase: true,
        daysAgo: 25,
      },
      {
        authorName: "Dave H.",
        location: "Bristol",
        rating: 4,
        title: "Solid, but a bit heavy",
        body: "Great power and the clutch is accurate, only downside is it's a touch heavier than my old drill.",
        verifiedPurchase: true,
        daysAgo: 12,
      },
    ],
  },
  {
    handle: "18v-brushless-combi-hammer-drill",
    name: "18V Brushless Combi Hammer Drill",
    description:
      "A three-mode combi drill that switches between drilling, screwdriving and hammer action for masonry work. The brushless motor means less heat, less noise and a longer tool life.",
    brand: "Toolvo",
    category: "Hammer Drills",
    price: 109.99,
    salePrice: 82.49,
    sku: "TLV-HD-18V",
    stock: 30,
    power: "Brushless motor, 450W equivalent",
    voltage: "18V",
    batteryType: "Li-Ion",
    torque: "65Nm",
    weight: "1.6kg",
    includedItems: "Drill body, 2x batteries, charger, carry case",
    specs: {
      "No-load speed": "0–500 / 0–1,900 rpm",
      "Impact rate": "0–32,300 bpm",
      Chuck: "13mm metal keyless",
      Warranty: "3 years",
    },
    createdDaysAgo: 150,
    images: [
      { url: "illustration:hammer-drill", alt: "18V Brushless Combi Hammer Drill, front angle" },
      { url: "illustration:hammer-drill", alt: "18V Brushless Combi Hammer Drill, in use" },
      { url: "illustration:battery", alt: "Included 18V battery" },
    ],
    variants: [
      { title: "1 Battery Kit", kit: "1 Battery Kit", sku: "TLV-HD-18V-1B", priceDelta: 0, stock: 16 },
      { title: "2 Battery Kit", kit: "2 Battery Kit", sku: "TLV-HD-18V-2B", priceDelta: 18, stock: 14 },
    ],
    collections: ["best-sellers", "hammer-drills"],
    reviews: [
      {
        authorName: "Ian T.",
        location: "Glasgow",
        rating: 5,
        title: "Powers through brick",
        body: "Drilled into an old Victorian wall with no bother at all on hammer setting.",
        verifiedPurchase: true,
        featured: true,
        daysAgo: 33,
      },
      {
        authorName: "Grace O.",
        location: "Cardiff",
        rating: 4,
        title: "Very good value",
        body: "Does everything I need for home renovation jobs, would recommend to anyone starting out.",
        verifiedPurchase: true,
        daysAgo: 19,
      },
    ],
  },
  {
    handle: "compact-screwdriver-x200",
    name: "Compact Screwdriver X200",
    description:
      "A lightweight, pocket-sized screwdriver for quick fixing jobs around the house. Small enough for one-handed use, powerful enough for flat-pack furniture and shelving.",
    brand: "Toolvo",
    category: "Cordless Screwdrivers",
    price: 34.99,
    salePrice: 27.99,
    sku: "TLV-SD-X200",
    stock: 60,
    power: "Compact motor, 90W equivalent",
    voltage: "4V",
    batteryType: "Li-Ion (built-in)",
    torque: "5Nm",
    weight: "0.35kg",
    includedItems: "Screwdriver body, USB charging cable, 6x bits",
    specs: {
      "No-load speed": "0–200 rpm",
      "Bit holder": "1/4in hex, quick-release",
      Charging: "USB-C, full charge in 90 minutes",
      Warranty: "2 years",
    },
    createdDaysAgo: 90,
    images: [
      { url: "illustration:screwdriver", alt: "Compact Screwdriver X200, front angle" },
      { url: "illustration:screwdriver", alt: "Compact Screwdriver X200, in hand" },
    ],
    variants: [
      { title: "Black", colour: "Black", sku: "TLV-SD-X200-BLK", priceDelta: 0, stock: 34 },
      { title: "Grey", colour: "Grey", sku: "TLV-SD-X200-GRY", priceDelta: 0, stock: 26 },
    ],
    collections: ["best-sellers", "cordless-screwdrivers"],
    reviews: [
      {
        authorName: "Fiona R.",
        location: "Edinburgh",
        rating: 5,
        title: "Perfect for flat-pack",
        body: "Light enough that my wrist doesn't ache halfway through building a cabinet.",
        verifiedPurchase: true,
        featured: true,
        daysAgo: 15,
      },
      {
        authorName: "Michael B.",
        location: "Norwich",
        rating: 5,
        title: "Handy little tool",
        body: "Charges quickly and the bit set covers everything I need for home fixes.",
        verifiedPurchase: true,
        daysAgo: 8,
      },
    ],
  },
  {
    handle: "20v-cordless-drill-driver-twin-pack",
    name: "20V Cordless Drill Driver Twin Pack",
    description:
      "Two of our most popular drill drivers in one box, ideal for households that need a spare or for sharing between family members on weekend projects.",
    brand: "Toolvo",
    category: "Impact Drills",
    price: 149.99,
    salePrice: 119.99,
    sku: "TLV-DDT-20V",
    stock: 20,
    power: "Brushless motor, 400W equivalent",
    voltage: "20V",
    batteryType: "Li-Ion",
    torque: "55Nm",
    weight: "1.3kg (each)",
    includedItems: "2x drill bodies, 2x batteries, 1x charger, carry case",
    specs: {
      "No-load speed": "0–450 / 0–1,750 rpm",
      Chuck: "13mm keyless",
      "Clutch settings": "18 + drill",
      Warranty: "3 years",
    },
    createdDaysAgo: 300,
    images: [
      { url: "illustration:cordless-drill", alt: "20V Cordless Drill Driver Twin Pack" },
      { url: "illustration:case", alt: "Twin pack carry case" },
    ],
    variants: [
      { title: "Standard Kit", kit: "Twin Pack", sku: "TLV-DDT-20V-STD", priceDelta: 0, stock: 20 },
    ],
    collections: ["best-sellers", "impact-drills"],
    reviews: [
      {
        authorName: "Sam K.",
        location: "Sheffield",
        rating: 5,
        title: "Great for two of us",
        body: "My partner and I both do DIY at weekends, having two drills saves so much back and forth.",
        verifiedPurchase: true,
        daysAgo: 50,
      },
    ],
  },
  {
    handle: "heavy-duty-bench-pillar-drill-16-speed",
    name: "Heavy-Duty Bench Pillar Drill 16-Speed",
    description:
      "A 16-speed bench pillar drill for the workshop, giving precise, repeatable holes in wood, metal and plastic. Cast-iron base keeps everything steady under load.",
    brand: "Toolvo",
    category: "Bench Drills",
    price: 189.99,
    sku: "TLV-BD-16S",
    stock: 12,
    power: "550W motor",
    voltage: "Mains (230V)",
    batteryType: "N/A",
    torque: "N/A",
    weight: "22kg",
    includedItems: "Bench drill, chuck key, worklight",
    specs: {
      "Speed settings": "16, from 210 to 2,530 rpm",
      "Chuck capacity": "1.5–16mm",
      "Max drilling depth": "60mm",
      Warranty: "2 years",
    },
    createdDaysAgo: 10,
    images: [
      { url: "illustration:bench-drill", alt: "Heavy-Duty Bench Pillar Drill 16-Speed" },
      { url: "illustration:bench-drill", alt: "Bench pillar drill, workshop setting" },
    ],
    variants: [{ title: "Standard", sku: "TLV-BD-16S-STD", priceDelta: 0, stock: 12 }],
    collections: ["news", "bench-drills"],
    reviews: [
      {
        authorName: "Robert P.",
        location: "Birmingham",
        rating: 5,
        title: "Excellent workshop addition",
        body: "Very sturdy, the speed range covers everything from steel to hardwood.",
        verifiedPurchase: true,
        featured: true,
        daysAgo: 4,
      },
    ],
  },
  {
    handle: "18v-impact-driver-body-only",
    name: "18V Impact Driver Body Only",
    description:
      "Compact and lightweight, this body-only impact driver is ideal for tradespeople already invested in our 18V battery platform.",
    brand: "Toolvo",
    category: "Impact Drills",
    price: 64.99,
    sku: "TLV-IMD-18V-BO",
    stock: 25,
    power: "Brushless motor, 380W equivalent",
    voltage: "18V",
    batteryType: "Li-Ion",
    torque: "180Nm",
    weight: "1.1kg",
    includedItems: "Driver body only (battery and charger sold separately)",
    specs: {
      "No-load speed": "0–2,900 rpm",
      "Impact rate": "0–3,500 ipm",
      "Bit holder": "1/4in hex",
      Warranty: "3 years",
    },
    createdDaysAgo: 6,
    images: [
      { url: "illustration:impact-driver", alt: "18V Impact Driver Body Only" },
    ],
    variants: [{ title: "Body Only", kit: "Bare Tool", sku: "TLV-IMD-18V-BO-1", priceDelta: 0, stock: 25 }],
    collections: ["news", "impact-drills"],
    reviews: [
      {
        authorName: "Owen L.",
        location: "Newcastle",
        rating: 4,
        title: "Good if you already have batteries",
        body: "Great value buying body only since I already had batteries from another Toolvo tool.",
        verifiedPurchase: true,
        daysAgo: 2,
      },
    ],
  },
  {
    handle: "precision-screwdriver-set-x50",
    name: "Precision Screwdriver Set X50",
    description:
      "An upgraded version of our popular screwdriver, with a slimmer grip and 50 precision bits for electronics, furniture and general repairs.",
    brand: "Toolvo",
    category: "Cordless Screwdrivers",
    price: 44.99,
    sku: "TLV-SD-X50",
    stock: 38,
    power: "Compact motor, 90W equivalent",
    voltage: "4V",
    batteryType: "Li-Ion (built-in)",
    torque: "5Nm",
    weight: "0.32kg",
    includedItems: "Screwdriver body, USB charging cable, 50x precision bits, storage tray",
    specs: {
      "No-load speed": "0–220 rpm",
      "Bit holder": "1/4in hex, quick-release",
      Charging: "USB-C, full charge in 75 minutes",
      Warranty: "2 years",
    },
    createdDaysAgo: 3,
    images: [{ url: "illustration:screwdriver", alt: "Precision Screwdriver Set X50" }],
    variants: [{ title: "Standard", sku: "TLV-SD-X50-STD", priceDelta: 0, stock: 38 }],
    collections: ["news", "cordless-screwdrivers"],
    reviews: [],
  },
  {
    handle: "20v-4ah-li-ion-battery",
    name: "20V 4.0Ah Li-Ion Battery",
    description: "A high-capacity replacement or spare battery, compatible with the full 20V Toolvo range.",
    brand: "Toolvo",
    category: "Batteries & Chargers",
    price: 39.99,
    sku: "TLV-BAT-20V-4A",
    stock: 80,
    power: "N/A",
    voltage: "20V",
    batteryType: "Li-Ion, 4.0Ah",
    torque: "N/A",
    weight: "0.65kg",
    includedItems: "1x battery",
    specs: { Capacity: "4.0Ah", "Charge cycles": "1,000+", Compatibility: "All Toolvo 20V tools" },
    createdDaysAgo: 200,
    images: [{ url: "illustration:battery", alt: "20V 4.0Ah Li-Ion Battery" }],
    variants: [{ title: "Single", sku: "TLV-BAT-20V-4A-1", priceDelta: 0, stock: 80 }],
    collections: ["accessories", "batteries-chargers"],
    reviews: [
      {
        authorName: "Nadia F.",
        location: "Liverpool",
        rating: 5,
        title: "Great spare to have",
        body: "Handy having a second battery on charge while I use the other one.",
        verifiedPurchase: true,
        daysAgo: 60,
      },
    ],
  },
  {
    handle: "20v-2ah-li-ion-battery-twin-pack",
    name: "20V 2.0Ah Li-Ion Battery Twin Pack",
    description: "Two standard-capacity batteries, sold together at a lower price than buying individually.",
    brand: "Toolvo",
    category: "Batteries & Chargers",
    price: 54.99,
    salePrice: 44.99,
    sku: "TLV-BAT-20V-2A-TWIN",
    stock: 45,
    power: "N/A",
    voltage: "20V",
    batteryType: "Li-Ion, 2.0Ah",
    torque: "N/A",
    weight: "0.45kg (each)",
    includedItems: "2x batteries",
    specs: { Capacity: "2.0Ah (each)", "Charge cycles": "1,000+", Compatibility: "All Toolvo 20V tools" },
    createdDaysAgo: 180,
    images: [{ url: "illustration:battery", alt: "20V 2.0Ah Li-Ion Battery Twin Pack" }],
    variants: [{ title: "Twin Pack", sku: "TLV-BAT-20V-2A-TWIN-1", priceDelta: 0, stock: 45 }],
    collections: ["accessories", "batteries-chargers"],
    reviews: [],
  },
  {
    handle: "rapid-smart-charger",
    name: "Rapid Smart Charger",
    description: "Fast-charges any Toolvo 18V or 20V battery in under 45 minutes, with built-in temperature protection.",
    brand: "Toolvo",
    category: "Batteries & Chargers",
    price: 29.99,
    sku: "TLV-CHG-RAPID",
    stock: 55,
    power: "N/A",
    voltage: "18V / 20V",
    batteryType: "N/A",
    torque: "N/A",
    weight: "0.4kg",
    includedItems: "1x charger",
    specs: { "Charge time": "Under 45 minutes", Compatibility: "All Toolvo 18V/20V batteries", Protection: "Overheat and overcharge protection" },
    createdDaysAgo: 160,
    images: [{ url: "illustration:charger", alt: "Rapid Smart Charger" }],
    variants: [{ title: "Standard", sku: "TLV-CHG-RAPID-1", priceDelta: 0, stock: 55 }],
    collections: ["accessories", "batteries-chargers"],
    reviews: [],
  },
  {
    handle: "100-piece-drill-and-screwdriver-bit-set",
    name: "100-Piece Drill & Screwdriver Bit Set",
    description: "A comprehensive bit set covering drilling, driving and countersinking, stored in a compact case that fits in any toolbox.",
    brand: "Toolvo",
    category: "Accessories",
    price: 19.99,
    sku: "TLV-BITS-100",
    stock: 120,
    power: "N/A",
    voltage: "N/A",
    batteryType: "N/A",
    torque: "N/A",
    weight: "0.5kg",
    includedItems: "100x bits, storage case",
    specs: { Material: "Chrome vanadium steel", "Bit types": "Drill, screwdriver, countersink", Case: "Impact-resistant" },
    createdDaysAgo: 240,
    images: [{ url: "illustration:drill-bits", alt: "100-Piece Drill & Screwdriver Bit Set" }],
    variants: [{ title: "Standard", sku: "TLV-BITS-100-1", priceDelta: 0, stock: 120 }],
    collections: ["accessories"],
    reviews: [
      {
        authorName: "Tom W.",
        location: "Reading",
        rating: 5,
        title: "Covers everything",
        body: "Great range of bits, good quality steel that hasn't worn down yet.",
        verifiedPurchase: true,
        daysAgo: 70,
      },
    ],
  },
  {
    handle: "heavy-duty-carry-case",
    name: "Heavy-Duty Carry Case",
    description: "A tough, foam-lined carry case sized to fit any Toolvo drill, spare batteries and a set of bits.",
    brand: "Toolvo",
    category: "Accessories",
    price: 24.99,
    sku: "TLV-CASE-HD",
    stock: 70,
    power: "N/A",
    voltage: "N/A",
    batteryType: "N/A",
    torque: "N/A",
    weight: "1.2kg",
    includedItems: "1x case with customisable foam inlay",
    specs: { Material: "Impact-resistant polypropylene", Foam: "Customisable pick-and-pluck", Latches: "Metal, lockable" },
    createdDaysAgo: 260,
    images: [{ url: "illustration:case", alt: "Heavy-Duty Carry Case" }],
    variants: [{ title: "Standard", sku: "TLV-CASE-HD-1", priceDelta: 0, stock: 70 }],
    collections: ["accessories", "cases-storage"],
    reviews: [],
  },
];

async function main() {
  console.log("Seeding database...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.collectionProduct.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.discountCode.deleteMany();
  await prisma.section.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.customer.deleteMany();

  const admin = await prisma.adminUser.create({
    data: {
      email: "admin@toolvodrills.co.uk",
      passwordHash: await bcrypt.hash("ToolvoAdmin123!", 10),
      name: "Store Admin",
    },
  });
  console.log(`Created admin user: ${admin.email} (password: ToolvoAdmin123!)`);

  const customer = await prisma.customer.create({
    data: {
      email: "customer@example.co.uk",
      passwordHash: await bcrypt.hash("Customer123!", 10),
      firstName: "Jamie",
      lastName: "Wright",
    },
  });

  const collectionDefs = [
    {
      handle: "best-sellers",
      name: "Best Sellers",
      description: "Our top-performing drills and kits, curated by the team.",
      coverImage: "illustration:cordless-drill",
      showOnHomepage: true,
      position: 0,
      autoIncludeDays: null as number | null,
    },
    {
      handle: "news",
      name: "News",
      description: "Newly launched and recently added products.",
      coverImage: "illustration:hammer-drill",
      showOnHomepage: true,
      position: 1,
      autoIncludeDays: 30,
    },
    {
      handle: "accessories",
      name: "Accessories",
      description: "Bits, batteries, chargers, cases and spare parts to complete your kit.",
      coverImage: "illustration:drill-bits",
      showOnHomepage: true,
      position: 2,
      autoIncludeDays: null,
    },
    {
      handle: "impact-drills",
      name: "Impact Drills",
      description: "Cordless impact drills for everyday drilling and driving.",
      coverImage: "illustration:impact-driver",
      showOnHomepage: false,
      position: 3,
      autoIncludeDays: null,
    },
    {
      handle: "hammer-drills",
      name: "Hammer Drills",
      description: "Combi and hammer drills for masonry and heavy-duty work.",
      coverImage: "illustration:hammer-drill",
      showOnHomepage: false,
      position: 4,
      autoIncludeDays: null,
    },
    {
      handle: "cordless-screwdrivers",
      name: "Cordless Screwdrivers",
      description: "Compact screwdrivers for quick, everyday fixing jobs.",
      coverImage: "illustration:screwdriver",
      showOnHomepage: false,
      position: 5,
      autoIncludeDays: null,
    },
    {
      handle: "bench-drills",
      name: "Bench Drills",
      description: "Pillar and bench drills for the workshop.",
      coverImage: "illustration:bench-drill",
      showOnHomepage: false,
      position: 6,
      autoIncludeDays: null,
    },
    {
      handle: "batteries-chargers",
      name: "Batteries & Chargers",
      description: "Spare batteries and fast chargers for the full Toolvo range.",
      coverImage: "illustration:battery",
      showOnHomepage: false,
      position: 7,
      autoIncludeDays: null,
    },
    {
      handle: "cases-storage",
      name: "Cases & Storage",
      description: "Carry cases and storage to keep your tools organised.",
      coverImage: "illustration:case",
      showOnHomepage: false,
      position: 8,
      autoIncludeDays: null,
    },
  ];

  const collectionsByHandle = new Map<string, string>();
  for (const c of collectionDefs) {
    const created = await prisma.collection.create({ data: c });
    collectionsByHandle.set(c.handle, created.id);
  }
  console.log(`Created ${collectionDefs.length} collections`);

  const now = Date.now();
  let productCount = 0;
  let reviewCount = 0;

  for (const p of products) {
    const createdAt = new Date(now - p.createdDaysAgo * 24 * 60 * 60 * 1000);
    const product = await prisma.product.create({
      data: {
        handle: p.handle,
        name: p.name,
        description: p.description,
        brand: p.brand,
        category: p.category,
        price: p.price,
        salePrice: p.salePrice ?? null,
        sku: p.sku,
        stock: p.stock,
        power: p.power,
        voltage: p.voltage,
        batteryType: p.batteryType,
        torque: p.torque,
        weight: p.weight,
        includedItems: p.includedItems,
        specs: p.specs,
        createdAt,
        images: {
          create: p.images.map((img, i) => ({ url: img.url, alt: img.alt, position: i })),
        },
        variants: {
          create: p.variants.map((v, i) => ({
            title: v.title,
            voltage: v.voltage ?? "",
            colour: v.colour ?? "",
            kit: v.kit ?? "",
            sku: v.sku,
            priceDelta: v.priceDelta ?? 0,
            stock: v.stock,
            position: i,
          })),
        },
      },
    });
    productCount += 1;

    for (const [i, handle] of p.collections.entries()) {
      const collectionId = collectionsByHandle.get(handle);
      if (!collectionId) continue;
      await prisma.collectionProduct.create({
        data: { collectionId, productId: product.id, position: i },
      });
    }

    for (const r of p.reviews) {
      await prisma.review.create({
        data: {
          productId: product.id,
          customerId: r.verifiedPurchase ? customer.id : null,
          authorName: r.authorName,
          location: r.location,
          rating: r.rating,
          title: r.title,
          body: r.body,
          verifiedPurchase: r.verifiedPurchase,
          featured: r.featured ?? false,
          status: "APPROVED",
          createdAt: new Date(now - r.daysAgo * 24 * 60 * 60 * 1000),
        },
      });
      reviewCount += 1;
    }
  }
  console.log(`Created ${productCount} products and ${reviewCount} reviews`);

  await prisma.discountCode.createMany({
    data: [
      {
        code: "WELCOME10",
        type: "PERCENTAGE",
        value: 10,
        active: true,
        usageLimit: null,
      },
      {
        code: "SUMMER20",
        type: "FIXED",
        value: 20,
        active: true,
        expiresAt: new Date(now + 60 * 24 * 60 * 60 * 1000),
        usageLimit: 500,
      },
    ],
  });
  console.log("Created discount codes: WELCOME10, SUMMER20");

  await prisma.section.createMany({
    data: [
      {
        page: "home",
        type: "HERO",
        position: 0,
        enabled: true,
        config: {
          heading: "Power that keeps up with you",
          subheading: "Cordless drills, screwdrivers and hammer drills built for tradespeople and confident DIYers.",
          buttonText: "Shop Best Sellers",
          buttonLink: "/collections/best-sellers",
          image: "illustration:cordless-drill",
        },
      },
      {
        page: "home",
        type: "COUNTDOWN_BAR",
        position: 1,
        enabled: true,
        config: {
          text: "Summer Sale — up to 25% off selected drills",
          endsInHours: 72,
          buttonText: "Shop the Sale",
          buttonLink: "/collections/best-sellers",
        },
      },
      {
        page: "home",
        type: "COLLECTION_CAROUSEL",
        position: 2,
        enabled: true,
        config: { collectionHandle: "best-sellers", heading: "Best Sellers" },
      },
      {
        page: "home",
        type: "COLLECTION_CAROUSEL",
        position: 3,
        enabled: true,
        config: { collectionHandle: "news", heading: "New In" },
      },
      {
        page: "home",
        type: "COLLECTION_CAROUSEL",
        position: 4,
        enabled: true,
        config: { collectionHandle: "accessories", heading: "Accessories" },
      },
      {
        page: "home",
        type: "TESTIMONIALS",
        position: 5,
        enabled: true,
        config: { heading: "What our customers say" },
      },
      {
        page: "home",
        type: "FAQ",
        position: 6,
        enabled: true,
        config: {
          heading: "Frequently asked questions",
          items: [
            {
              question: "How long does delivery take?",
              answer: "Standard delivery takes 2–4 working days across the UK. Express and next-day options are available at checkout.",
            },
            {
              question: "What is your returns policy?",
              answer: "We offer a 30-day money-back guarantee on all tools, provided they're returned in their original packaging.",
            },
            {
              question: "Are your tools covered by a warranty?",
              answer: "Yes, every Toolvo tool comes with a manufacturer's warranty of at least 2 years — see each product page for details.",
            },
            {
              question: "Do batteries work across the range?",
              answer: "Batteries are compatible across all tools of the same voltage platform (18V or 20V).",
            },
          ],
        },
      },
      {
        page: "home",
        type: "NEWSLETTER",
        position: 7,
        enabled: true,
        config: {
          heading: "Get 10% off your first order",
          subheading: "Sign up for restock alerts, new arrivals and exclusive offers.",
        },
      },
    ],
  });
  console.log("Created homepage sections");

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
