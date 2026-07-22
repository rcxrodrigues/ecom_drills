import { ButtonLink } from "@/components/ui/Button";
import { ProductPicture } from "@/components/ui/ProductPicture";

export type ImageTextConfig = {
  heading: string;
  body?: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
  imagePosition?: "left" | "right";
};

export function ImageText({ config }: { config: ImageTextConfig }) {
  const reversed = config.imagePosition === "right";
  return (
    <section className="py-10 lg:py-14">
      <div className="page-container grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
        <div className={`relative aspect-4/3 w-full overflow-hidden rounded-button border border-border-subtle ${reversed ? "lg:order-2" : ""}`}>
          <ProductPicture src={config.image ?? "illustration:hammer-drill"} alt={config.heading} className="h-full w-full" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-foreground-strong">{config.heading}</h2>
          {config.body && <p className="mt-3 text-sm text-foreground">{config.body}</p>}
          {config.buttonText && config.buttonLink && (
            <ButtonLink href={config.buttonLink} className="mt-6">
              {config.buttonText}
            </ButtonLink>
          )}
        </div>
      </div>
    </section>
  );
}
