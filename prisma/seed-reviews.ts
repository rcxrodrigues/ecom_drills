import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const REVIEWS_PER_PRODUCT = 320;

const FIRST_NAMES = [
  "James", "Oliver", "George", "Harry", "Jack", "Charlie", "Thomas", "Jacob", "Alfie", "Freddie",
  "Amelia", "Olivia", "Isla", "Ava", "Emily", "Sophia", "Grace", "Lily", "Poppy", "Chloe",
  "Daniel", "Michael", "Ryan", "Liam", "Callum", "Owen", "Ethan", "Adam", "Sam", "Ben",
  "Sarah", "Laura", "Hannah", "Rebecca", "Jessica", "Emma", "Charlotte", "Rachel", "Katie", "Zoe",
  "David", "Paul", "Mark", "Andrew", "Stephen", "Peter", "Simon", "Ian", "Robert", "Neil",
  "Karen", "Julie", "Sandra", "Angela", "Diane", "Susan", "Tracy", "Jennifer", "Nicola", "Michelle",
];
const LAST_INITIALS = ["A.", "B.", "C.", "D.", "E.", "F.", "G.", "H.", "J.", "K.", "L.", "M.", "N.", "P.", "R.", "S.", "T.", "W."];
const LOCATIONS = [
  "London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Liverpool", "Bristol", "Sheffield",
  "Edinburgh", "Cardiff", "Newcastle", "Belfast", "Nottingham", "Southampton", "Leicester",
  "Coventry", "Bradford", "Reading", "Norwich", "Plymouth", "Aberdeen", "Derby", "Swansea",
  "Oxford", "Cambridge", "York", "Bath", "Exeter", "Preston", "Sunderland",
];

const FIVE_STAR = [
  { title: "Excellent quality", body: "Really impressed with the build quality, works exactly as described and feels solid in the hand." },
  { title: "Highly recommend", body: "Does everything I need and more. Great value for money, would buy again without hesitation." },
  { title: "Perfect for the job", body: "Used it for a full weekend of work and it never let me down. Powerful and comfortable to hold." },
  { title: "Great addition to the toolbox", body: "Well made, arrived quickly and works brilliantly. Exactly what I was after." },
  { title: "Very happy with this", body: "Solid performance, good battery life and well balanced. Can't fault it." },
  { title: "Exceeded expectations", body: "Wasn't sure what to expect at this price but it's genuinely excellent. Very pleased." },
  { title: "Reliable and powerful", body: "Been using it regularly for a few weeks now and it's holding up brilliantly." },
  { title: "Would buy again", body: "Second one I've bought for a family member after how well the first one worked out." },
  { title: "Brilliant tool", body: "Comfortable grip, plenty of power, and the battery lasts a full day of use." },
  { title: "Does exactly what it says", body: "No surprises, just a well made tool that gets the job done properly." },
];

const FOUR_STAR = [
  { title: "Good value", body: "Solid tool for the price, does the job well. Only minor gripe is it's a touch heavier than expected." },
  { title: "Very good, small niggle", body: "Works well overall, just wish the charger was a bit faster. Still recommend it." },
  { title: "Happy with the purchase", body: "Does what it's meant to, good power for everyday jobs around the house." },
  { title: "Solid performer", body: "No real complaints, does the job reliably. Would have liked a spare bit included though." },
  { title: "Good for the price", body: "Not the most powerful tool I've owned but for occasional DIY use it's more than adequate." },
  { title: "Does the job well", body: "Reliable and comfortable to use, just took a star off as delivery took a bit longer than expected." },
  { title: "Pretty good overall", body: "Works as expected, feels well built. Battery could last a little longer but otherwise great." },
];

const rand = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]!;

function randomDateWithinLastYears(years: number) {
  const now = Date.now();
  const past = now - years * 365 * 24 * 60 * 60 * 1000;
  return new Date(past + Math.random() * (now - past));
}

async function main() {
  const products = await prisma.product.findMany({ select: { id: true, name: true } });
  console.log(`Seeding ${REVIEWS_PER_PRODUCT} reviews for ${products.length} products...`);

  for (const product of products) {
    const existing = await prisma.review.count({ where: { productId: product.id } });
    const toCreate = REVIEWS_PER_PRODUCT - existing;
    if (toCreate <= 0) {
      console.log(`- ${product.name}: already has ${existing}, skipping`);
      continue;
    }

    const rows = Array.from({ length: toCreate }).map(() => {
      const isFiveStar = Math.random() < 0.68;
      const pool = isFiveStar ? FIVE_STAR : FOUR_STAR;
      const template = rand(pool);
      return {
        productId: product.id,
        authorName: `${rand(FIRST_NAMES)} ${rand(LAST_INITIALS)}`,
        location: rand(LOCATIONS),
        rating: isFiveStar ? 5 : 4,
        title: template.title,
        body: template.body,
        verifiedPurchase: Math.random() < 0.9,
        status: "APPROVED" as const,
        featured: false,
        createdAt: randomDateWithinLastYears(1.5),
      };
    });

    // Insert in chunks to stay well under any single-statement parameter limits.
    const chunkSize = 200;
    for (let i = 0; i < rows.length; i += chunkSize) {
      await prisma.review.createMany({ data: rows.slice(i, i + chunkSize) });
    }
    console.log(`- ${product.name}: added ${toCreate} reviews (total ${existing + toCreate})`);
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
