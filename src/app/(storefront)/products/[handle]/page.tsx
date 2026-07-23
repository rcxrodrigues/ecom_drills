import { notFound } from "next/navigation";
import { getProductByHandle, getCrossSellProducts } from "@/lib/queries";
import { ProductGallery } from "@/components/storefront/ProductGallery";
import { ProductPurchasePanel } from "@/components/storefront/ProductPurchasePanel";
import { TrustBadges } from "@/components/storefront/TrustBadges";
import { ProductReviewBadgeRow } from "@/components/storefront/ProductReviewBadgeRow";
import { DeliveryEstimator } from "@/components/storefront/DeliveryEstimator";
import { CompleteYourKit } from "@/components/storefront/CompleteYourKit";
import { ReviewsSection } from "@/components/storefront/ReviewsSection";
import { Accordion } from "@/components/ui/Accordion";

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) notFound();

  const crossSell = await getCrossSellProducts(product.id);
  const mainImage = product.images[0]?.url ?? "illustration:cordless-drill";

  const specEntries = Object.entries(product.specs as Record<string, string>);
  const specsContent = (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
      {product.power && product.power !== "N/A" && (
        <div className="flex justify-between border-b border-border-subtle py-1.5 text-sm">
          <dt className="text-foreground">Power</dt>
          <dd className="font-medium text-foreground-strong">{product.power}</dd>
        </div>
      )}
      {product.torque && product.torque !== "N/A" && (
        <div className="flex justify-between border-b border-border-subtle py-1.5 text-sm">
          <dt className="text-foreground">Torque</dt>
          <dd className="font-medium text-foreground-strong">{product.torque}</dd>
        </div>
      )}
      {product.weight && (
        <div className="flex justify-between border-b border-border-subtle py-1.5 text-sm">
          <dt className="text-foreground">Weight</dt>
          <dd className="font-medium text-foreground-strong">{product.weight}</dd>
        </div>
      )}
      {specEntries.map(([key, value]) => (
        <div key={key} className="flex justify-between border-b border-border-subtle py-1.5 text-sm">
          <dt className="text-foreground">{key}</dt>
          <dd className="font-medium text-foreground-strong">{value}</dd>
        </div>
      ))}
    </dl>
  );

  return (
    <div className="page-container py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductGallery images={product.images.map((img) => ({ url: img.url, alt: img.alt }))} />

        <div className="flex flex-col gap-8">
          <ProductPurchasePanel
            productId={product.id}
            handle={product.handle}
            name={product.name}
            price={product.price}
            salePrice={product.salePrice}
            image={mainImage}
            variants={product.variants}
            avgRating={product.avgRating}
            ratingCount={product.ratingCount}
          />

          <ProductReviewBadgeRow rating={product.avgRating} count={product.ratingCount} />
          <DeliveryEstimator />
          <TrustBadges />

          <Accordion
            items={[
              { title: "Technical specifications", content: specsContent },
              {
                title: "What's included",
                content: <p className="text-sm text-foreground">{product.includedItems}</p>,
              },
              {
                title: "Description",
                content: <p className="text-sm text-foreground">{product.description}</p>,
              },
            ]}
          />
        </div>
      </div>

      <CompleteYourKit items={crossSell} />

      <ReviewsSection
        reviews={product.reviews}
        avgRating={product.avgRating}
        ratingCount={product.ratingCount}
        distribution={product.distribution}
      />
    </div>
  );
}
