"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Label, Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { saveSectionConfig } from "@/app/actions/admin-sections";

const ILLUSTRATION_OPTIONS = [
  "illustration:cordless-drill",
  "illustration:impact-driver",
  "illustration:hammer-drill",
  "illustration:bench-drill",
  "illustration:screwdriver",
  "illustration:battery",
  "illustration:drill-bits",
  "illustration:case",
  "illustration:charger",
];

type FaqItem = { question: string; answer: string };

export function SectionConfigForm({
  id,
  type,
  config,
  collections,
}: {
  id: string;
  type: string;
  config: Record<string, unknown>;
  collections: { handle: string; name: string }[];
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, unknown>>(config);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function set(key: string, value: unknown) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await saveSectionConfig(id, values);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    });
  }

  const str = (key: string) => (typeof values[key] === "string" ? (values[key] as string) : "");
  const num = (key: string) => (typeof values[key] === "number" ? (values[key] as number) : 0);
  const items = (Array.isArray(values.items) ? (values.items as FaqItem[]) : []) as FaqItem[];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-button border border-border-subtle bg-white p-5">
      {(type === "HERO" || type === "IMAGE_TEXT") && (
        <>
          <div>
            <Label htmlFor="heading">Heading</Label>
            <Input id="heading" value={str("heading")} onChange={(e) => set("heading", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="subheading">{type === "HERO" ? "Subheading" : "Body text"}</Label>
            <Textarea
              id="subheading"
              value={type === "HERO" ? str("subheading") : str("body")}
              onChange={(e) => set(type === "HERO" ? "subheading" : "body", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="image">Image</Label>
            <Select id="image" value={str("image")} onChange={(e) => set("image", e.target.value)}>
              {ILLUSTRATION_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o.replace("illustration:", "")}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="buttonText">Button text</Label>
              <Input id="buttonText" value={str("buttonText")} onChange={(e) => set("buttonText", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="buttonLink">Button link</Label>
              <Input id="buttonLink" value={str("buttonLink")} onChange={(e) => set("buttonLink", e.target.value)} />
            </div>
          </div>
          {type === "HERO" && (
            <div>
              <Label htmlFor="countdownHours">Countdown length in hours (optional)</Label>
              <Input
                id="countdownHours"
                type="number"
                min={0}
                value={num("countdownHours") || ""}
                onChange={(e) => set("countdownHours", e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          )}
          {type === "IMAGE_TEXT" && (
            <div>
              <Label htmlFor="imagePosition">Image position</Label>
              <Select id="imagePosition" value={str("imagePosition") || "left"} onChange={(e) => set("imagePosition", e.target.value)}>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </Select>
            </div>
          )}
        </>
      )}

      {type === "COUNTDOWN_BAR" && (
        <>
          <div>
            <Label htmlFor="text">Bar text</Label>
            <Input id="text" value={str("text")} onChange={(e) => set("text", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="endsInHours">Countdown length in hours</Label>
            <Input
              id="endsInHours"
              type="number"
              min={1}
              value={num("endsInHours")}
              onChange={(e) => set("endsInHours", Number(e.target.value))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="buttonText">Button text</Label>
              <Input id="buttonText" value={str("buttonText")} onChange={(e) => set("buttonText", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="buttonLink">Button link</Label>
              <Input id="buttonLink" value={str("buttonLink")} onChange={(e) => set("buttonLink", e.target.value)} />
            </div>
          </div>
        </>
      )}

      {type === "COLLECTION_CAROUSEL" && (
        <>
          <div>
            <Label htmlFor="collectionHandle">Collection</Label>
            <Select id="collectionHandle" value={str("collectionHandle")} onChange={(e) => set("collectionHandle", e.target.value)}>
              {collections.map((c) => (
                <option key={c.handle} value={c.handle}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="heading">Heading override (optional)</Label>
            <Input id="heading" value={str("heading")} onChange={(e) => set("heading", e.target.value)} />
          </div>
        </>
      )}

      {(type === "TESTIMONIALS" || type === "NEWSLETTER") && (
        <>
          <div>
            <Label htmlFor="heading">Heading</Label>
            <Input id="heading" value={str("heading")} onChange={(e) => set("heading", e.target.value)} />
          </div>
          {type === "NEWSLETTER" && (
            <div>
              <Label htmlFor="subheading">Subheading</Label>
              <Input id="subheading" value={str("subheading")} onChange={(e) => set("subheading", e.target.value)} />
            </div>
          )}
        </>
      )}

      {type === "FAQ" && (
        <>
          <div>
            <Label htmlFor="heading">Heading</Label>
            <Input id="heading" value={str("heading")} onChange={(e) => set("heading", e.target.value)} />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground-strong">Questions</p>
            {items.map((item, i) => (
              <div key={i} className="mb-3 rounded-input border border-border-subtle p-3">
                <Input
                  className="mb-2"
                  placeholder="Question"
                  value={item.question}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...next[i], question: e.target.value };
                    set("items", next);
                  }}
                />
                <Textarea
                  placeholder="Answer"
                  value={item.answer}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...next[i], answer: e.target.value };
                    set("items", next);
                  }}
                />
                <button
                  type="button"
                  onClick={() => set("items", items.filter((_, ii) => ii !== i))}
                  className="mt-2 text-xs text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => set("items", [...items, { question: "", answer: "" }])}
              className="text-xs font-medium text-foreground-strong underline"
            >
              + Add question
            </button>
          </div>
        </>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save section"}
        </Button>
        {saved && <span className="text-xs text-foreground/60">Saved</span>}
      </div>
    </form>
  );
}
