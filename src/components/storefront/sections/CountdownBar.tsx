import Link from "next/link";
import { Countdown } from "@/components/storefront/Countdown";

export type CountdownBarConfig = {
  text: string;
  endsInHours: number;
  buttonText?: string;
  buttonLink?: string;
};

export function CountdownBar({ config }: { config: CountdownBarConfig }) {
  return (
    <section className="bg-neutral-100">
      <div className="page-container flex flex-col items-center justify-center gap-3 py-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-sm font-semibold text-foreground-strong">{config.text}</p>
        <div className="flex items-center gap-4">
          <Countdown hours={config.endsInHours} />
          {config.buttonText && config.buttonLink && (
            <Link href={config.buttonLink} className="text-sm font-semibold text-foreground-strong underline underline-offset-4">
              {config.buttonText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
