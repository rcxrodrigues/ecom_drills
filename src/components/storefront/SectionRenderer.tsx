import { Hero, type HeroConfig } from "./sections/Hero";
import { CountdownBar, type CountdownBarConfig } from "./sections/CountdownBar";
import { CollectionCarousel, type CollectionCarouselConfig } from "./sections/CollectionCarousel";
import { Testimonials, type TestimonialsConfig } from "./sections/Testimonials";
import { FaqSection, type FaqConfig } from "./sections/FaqSection";
import { Newsletter, type NewsletterConfig } from "./sections/Newsletter";
import { ImageText, type ImageTextConfig } from "./sections/ImageText";

export type SectionData = {
  id: string;
  type: string;
  config: unknown;
};

export function SectionRenderer({ sections }: { sections: SectionData[] }) {
  return (
    <>
      {sections.map((section) => {
        switch (section.type) {
          case "HERO":
            return <Hero key={section.id} config={section.config as HeroConfig} />;
          case "COUNTDOWN_BAR":
            return <CountdownBar key={section.id} config={section.config as CountdownBarConfig} />;
          case "COLLECTION_CAROUSEL":
            return <CollectionCarousel key={section.id} config={section.config as CollectionCarouselConfig} />;
          case "TESTIMONIALS":
            return <Testimonials key={section.id} config={section.config as TestimonialsConfig} />;
          case "FAQ":
            return <FaqSection key={section.id} config={section.config as FaqConfig} />;
          case "NEWSLETTER":
            return <Newsletter key={section.id} config={section.config as NewsletterConfig} />;
          case "IMAGE_TEXT":
            return <ImageText key={section.id} config={section.config as ImageTextConfig} />;
          default:
            return null;
        }
      })}
    </>
  );
}
