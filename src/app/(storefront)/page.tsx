import { getSections } from "@/lib/queries";
import { SectionRenderer } from "@/components/storefront/SectionRenderer";

export default async function HomePage() {
  const sections = await getSections("home");
  return <SectionRenderer sections={sections} />;
}
