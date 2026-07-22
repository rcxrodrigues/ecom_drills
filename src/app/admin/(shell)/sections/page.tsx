import { getSectionsForAdmin } from "@/lib/queries";
import { SectionListClient } from "@/components/admin/SectionListClient";

export default async function AdminSectionsPage() {
  const sections = await getSectionsForAdmin("home");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground-strong">Homepage Sections</h1>
        <p className="mt-1 text-sm text-foreground">
          Add, remove, reorder and configure the content blocks shown on your homepage.
        </p>
      </div>
      <SectionListClient
        sections={sections.map((s) => ({ id: s.id, type: s.type, enabled: s.enabled, position: s.position }))}
      />
    </div>
  );
}
