import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { ToolIllustration, type ToolIllustrationVariant } from "@/components/ui/ToolIllustration";
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
  const src = config.image ?? "illustration:cordless-drill";
  const isIllustration = src.startsWith("illustration:");

  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden border-b border-border-subtle bg-brand-black sm:min-h-[560px]">
      <div className="absolute inset-0">
        {isIllustration ? (
          <ToolIllustration
            variant={src.replace("illustration:", "") as ToolIllustrationVariant}
            className="h-full w-full opacity-30 [&_rect]:hidden [&_g]:stroke-white"
          />
        ) : (
          <Image src={src} alt={config.heading} fill className="object-cover" sizes="100vw" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/40" />
      </div>

      <div className="relative flex flex-col items-center px-6 py-16 text-center text-white">
        <h1 className="max-w-xl text-4xl font-bold leading-tight sm:text-5xl">{config.heading}</h1>
        {config.subheading && <p className="mt-4 max-w-md text-base text-white/90">{config.subheading}</p>}
        {config.buttonText && config.buttonLink && (
          <ButtonLink href={config.buttonLink} size="lg" variant="secondary" className="mt-7 border-white">
            {config.buttonText}
          </ButtonLink>
        )}
        {config.countdownHours && (
          <div className="mt-8">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/70">Offer ends in</p>
            <Countdown hours={config.countdownHours} className="[&>span]:bg-white [&>span]:text-brand-black" />
          </div>
        )}
      </div>
    </section>
  );
}
