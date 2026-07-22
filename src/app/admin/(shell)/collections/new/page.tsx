import { CollectionForm } from "@/components/admin/CollectionForm";

export default function NewCollectionPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-foreground-strong">Add collection</h1>
      <CollectionForm />
    </div>
  );
}
