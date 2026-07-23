import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const REVIEWS_PER_PRODUCT = 320;
const FIVE_STAR_SHARE = 0.68;

const FIRST_NAMES = [
  "James", "Oliver", "George", "Harry", "Jack", "Charlie", "Thomas", "Jacob", "Alfie", "Freddie",
  "Amelia", "Olivia", "Isla", "Ava", "Emily", "Sophia", "Grace", "Lily", "Poppy", "Chloe",
  "Daniel", "Michael", "Ryan", "Liam", "Callum", "Owen", "Ethan", "Adam", "Sam", "Ben",
  "Sarah", "Laura", "Hannah", "Rebecca", "Jessica", "Emma", "Charlotte", "Rachel", "Katie", "Zoe",
  "David", "Paul", "Mark", "Andrew", "Stephen", "Peter", "Simon", "Ian", "Robert", "Neil",
  "Karen", "Julie", "Sandra", "Angela", "Diane", "Susan", "Tracy", "Jennifer", "Nicola", "Michelle",
  "Matthew", "Joshua", "Connor", "Aaron", "Lewis", "Josh", "Kieran", "Craig", "Gareth", "Dean",
  "Megan", "Ellie", "Georgia", "Abbie", "Leah", "Holly", "Amy", "Beth", "Kelly", "Vicky",
];
const LAST_INITIALS = [
  "A.", "B.", "C.", "D.", "E.", "F.", "G.", "H.", "J.", "K.",
  "L.", "M.", "N.", "P.", "R.", "S.", "T.", "W.", "Y.", "Mc.",
];
const LOCATIONS = [
  "London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Liverpool", "Bristol", "Sheffield",
  "Edinburgh", "Cardiff", "Newcastle", "Belfast", "Nottingham", "Southampton", "Leicester",
  "Coventry", "Bradford", "Reading", "Norwich", "Plymouth", "Aberdeen", "Derby", "Swansea",
  "Oxford", "Cambridge", "York", "Bath", "Exeter", "Preston", "Sunderland", "Hull", "Portsmouth",
  "Stoke-on-Trent", "Wolverhampton", "Milton Keynes", "Luton", "Middlesbrough", "Blackpool",
];

const TITLES_5 = [
  "Excellent quality", "Highly recommend", "Perfect for the job", "Great addition to the toolbox",
  "Very happy with this", "Exceeded expectations", "Reliable and powerful", "Would buy again",
  "Brilliant tool", "Does exactly what it says", "Really pleased", "Worth every penny",
  "Fantastic purchase", "Better than expected", "No complaints at all", "Superb build quality",
  "Just what I needed", "Impressed with the power", "Great for everyday use", "Solid and dependable",
  "Couldn't be happier", "Top marks", "Really good kit", "Ideal for the workshop",
  "Sturdy and well made", "Spot on", "Excellent value", "A great buy", "Does the job perfectly",
  "Very satisfied customer",
];
const TITLES_4 = [
  "Good value", "Very good, small niggle", "Happy with the purchase", "Solid performer",
  "Good for the price", "Does the job well", "Pretty good overall", "Decent tool",
  "Mostly very good", "Nearly perfect", "Good but room for improvement", "Does what it should",
  "Reliable enough", "Fair value for money", "Works well for most jobs", "Good quality overall",
  "Handy tool to have", "Would recommend with caveats",
];

const OPENERS_5 = [
  "Really impressed with the build quality.",
  "This has quickly become my go-to tool.",
  "Been using it for a few weeks now and it hasn't missed a beat.",
  "Arrived well packaged and set up in minutes.",
  "Exactly what I was looking for.",
  "Solid performance right out of the box.",
  "Great value for the price point.",
  "Used it on a full weekend project and it held up brilliantly.",
  "Second one I've bought after the first worked out so well.",
  "Comfortable to hold even after a long session.",
  "Feels a lot more premium than the price suggests.",
  "My old tool broke and this replaced it perfectly.",
  "Bought this for a family member and they love it.",
  "Does everything it needs to without any fuss.",
  "Been recommending this to anyone who asks.",
  "Very well balanced and easy to control.",
  "Runs quieter than I expected too.",
  "The battery has lasted much longer than I thought it would.",
  "Sturdy, well finished, and easy to use straight away.",
  "Genuinely happy I chose this one over the cheaper alternatives.",
  "A proper step up from what I had before.",
  "Delivered on time and works exactly as advertised.",
  "Handles daily use without any issues so far.",
  "One of the better purchases I've made this year.",
  "Really good grip and it never feels like it'll slip.",
];
const DETAILS_5 = [
  "Power is more than enough for anything around the house.",
  "The clutch settings make it easy to avoid overtightening.",
  "Battery life easily covers a full day of light use.",
  "Feels well balanced, doesn't tire out my wrist.",
  "Charging is quick, so there's barely any downtime.",
  "Comes with everything you need to get started straight away.",
  "The case makes it easy to keep everything together.",
  "Noticeably lighter than similar tools I've used before.",
  "Handles tougher jobs without struggling at all.",
  "Grip is comfortable even during longer sessions.",
  "Build quality feels a cut above the price bracket.",
  "Great for both quick fixes and bigger projects.",
  "Everything about it feels well thought through.",
  "Consistent power the whole way through the battery.",
  "Easy to switch between settings without fumbling around.",
  "Compact enough to fit in tight spaces but still powerful.",
  "Held up well even with fairly heavy use.",
  "Would happily recommend this to anyone starting out.",
  "No issues at all after regular use over several weeks.",
  "Instructions were clear and it was ready to use in no time.",
  "Feels durable enough to last for years.",
  "Great for both professional and DIY jobs.",
  "Definitely worth the extra bit over the basic models.",
  "Simple to use even if you're not particularly experienced.",
];

const OPENERS_4 = [
  "Solid tool for the price, does the job well.",
  "Works well overall, just a couple of small niggles.",
  "Does what it's meant to, good power for everyday jobs.",
  "No real complaints, does the job reliably.",
  "Not the most powerful tool I've owned but still adequate.",
  "Reliable and comfortable to use most of the time.",
  "Works as expected, feels well built.",
  "Good for occasional use around the house.",
  "Decent performance, though it took a little getting used to.",
  "Does the job, though I expected slightly more for the price.",
  "Handles most jobs fine, just not the heaviest ones.",
  "A good all-rounder, if not quite class-leading.",
  "Pretty happy overall, a few small things could be better.",
  "Good tool, delivery took a little longer than expected.",
  "Works well, though the instructions could be clearer.",
];
const DETAILS_4 = [
  "Only gripe is it's a touch heavier than expected.",
  "Wish the charger was a bit faster, otherwise great.",
  "Would have liked a spare battery included.",
  "Battery could last a little longer but otherwise good.",
  "A bit noisier than I expected, but not a dealbreaker.",
  "Case is a little flimsy but the tool itself is solid.",
  "Took a star off for the packaging, tool itself is fine.",
  "Grip could be a touch more comfortable for longer jobs.",
  "Not the lightest option out there, but does the job.",
  "Would have liked a couple more bits included in the box.",
  "A little pricier than similar options but the quality shows.",
  "Runs a bit warm on longer jobs, otherwise no issues.",
  "Delivery was slower than expected but the product is good.",
  "Would benefit from a slightly longer warranty.",
  "Does everything I need, just not the most exciting design.",
];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

function buildCombos(openers: string[], details: string[]) {
  const pairs: [number, number][] = [];
  for (let i = 0; i < openers.length; i++) {
    for (let j = 0; j < details.length; j++) pairs.push([i, j]);
  }
  return shuffle(pairs);
}

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
    const fiveCount = Math.round(REVIEWS_PER_PRODUCT * FIVE_STAR_SHARE);
    const fourCount = REVIEWS_PER_PRODUCT - fiveCount;

    const fiveCombos = buildCombos(OPENERS_5, DETAILS_5).slice(0, fiveCount);
    const fourCombos = buildCombos(OPENERS_4, DETAILS_4).slice(0, fourCount);

    const rows = [
      ...fiveCombos.map(([oi, di]) => ({
        rating: 5 as const,
        title: rand(TITLES_5),
        body: `${OPENERS_5[oi]} ${DETAILS_5[di]}`,
      })),
      ...fourCombos.map(([oi, di]) => ({
        rating: 4 as const,
        title: rand(TITLES_4),
        body: `${OPENERS_4[oi]} ${DETAILS_4[di]}`,
      })),
    ].map((r) => ({
      productId: product.id,
      authorName: `${rand(FIRST_NAMES)} ${rand(LAST_INITIALS)}`,
      location: rand(LOCATIONS),
      rating: r.rating,
      title: r.title,
      body: r.body,
      verifiedPurchase: Math.random() < 0.9,
      status: "APPROVED" as const,
      featured: false,
      createdAt: randomDateWithinLastYears(1.5),
    }));

    const chunkSize = 200;
    for (let i = 0; i < rows.length; i += chunkSize) {
      await prisma.review.createMany({ data: rows.slice(i, i + chunkSize) });
    }
    console.log(`- ${product.name}: added ${rows.length} reviews`);
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
