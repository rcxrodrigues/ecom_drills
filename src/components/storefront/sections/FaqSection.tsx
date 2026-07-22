import { Accordion } from "@/components/ui/Accordion";

export type FaqConfig = {
  heading?: string;
  items: { question: string; answer: string }[];
};

export function FaqSection({ config }: { config: FaqConfig }) {
  if (!config.items?.length) return null;
  return (
    <section className="py-10 lg:py-14">
      <div className="page-container max-w-3xl">
        <h2 className="mb-6 text-xl font-semibold text-foreground-strong sm:text-2xl">
          {config.heading ?? "Frequently asked questions"}
        </h2>
        <Accordion items={config.items.map((i) => ({ title: i.question, content: i.answer }))} />
      </div>
    </section>
  );
}
