import { getAllCollections } from "@/lib/queries";
import { CartProvider } from "@/lib/cart-context";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const collections = await getAllCollections();
  const navCollections = collections
    .filter((c) => c.handle !== "news")
    .map((c) => ({ handle: c.handle, name: c.name }));

  return (
    <CartProvider>
      <AnnouncementBar />
      <Header collections={navCollections} />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </CartProvider>
  );
}
