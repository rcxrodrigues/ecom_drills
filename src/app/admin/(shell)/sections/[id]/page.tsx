import { notFound } from "next/navigation";
import { getSectionById, getAllCollections } from "@/lib/queries";
import { SectionConfigForm } from "@/components/admin/SectionConfigForm";

export default async function EditSectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [section, collections] = await Promise.all([getSectionById(id), getAllCollections()]);
  if (!section) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-foreground-strong">Edit section</h1>
      <SectionConfigForm
        id={section.id}
        type={section.type}
        config={section.config as Record<string, unknown>}
        collections={collections.map((c) => ({ handle: c.handle, name: c.name }))}
      />
    </div>
  );
}
