import { ButtonLink } from "@/components/ui/Button";
import { ProductPicture } from "@/components/ui/ProductPicture";
import { Countdown } from "@/components/storefront/Countdown";

export type HeroConfig = {
  heading: string;
  subheading?: string;
  buttonText?: string;
  buttonLink?: string;
  image?: string;
  countdownHours?: number;
};

export function Hero({ config }: { config: HeroConfig }) {
  return (
    <section className="border-b border-border-subtle bg-white">
      <div className="page-container grid grid-cols-1 items-center gap-8 py-10 lg:grid-cols-2 lg:py-16">
        <div className="order-2 lg:order-1">
          <h1 className="text-3xl font-bold leading-tight text-foreground-strong sm:text-4xl lg:text-5xl">
            {config.heading}
          </h1>
          {config.subheading && (
            <p className="mt-4 max-w-md text-base text-foreground">{config.subheading}</p>
          )}
          {config.countdownHours && (
            <div className="mt-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-foreground/60">Offer ends in</p>
              <Countdown hours={config.countdownHours} />
            </div>
          )}
          {config.buttonText && config.buttonLink && (
            <ButtonLink href={config.buttonLink} size="lg" className="mt-7">
              {config.buttonText}
            </ButtonLink>
          )}
        </div>
        <div className="relative order-1 aspect-4/3 w-full overflow-hidden rounded-button border border-border-subtle lg:order-2">
          <ProductPicture src={config.image ?? "illustration:cordless-drill"} alt={config.heading} className="h-full w-full" />
        </div>
      </div>
    </section>
  );
}
