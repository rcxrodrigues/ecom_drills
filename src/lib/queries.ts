import "server-only";
import { prisma } from "./prisma";

function toNum(d: unknown): number {
  return d == null ? 0 : Number(d);
}

export async function getSections(page = "home") {
  const sections = await prisma.section.findMany({
    where: { page, enabled: true },
    orderBy: { position: "asc" },
  });
  return sections;
}

export async function getSectionsForAdmin(page = "home") {
  return prisma.section.findMany({ where: { page }, orderBy: { position: "asc" } });
}

export async function getSectionById(id: string) {
  return prisma.section.findUnique({ where: { id } });
}

export async function getHomepageCollections() {
  return prisma.collection.findMany({
    where: { showOnHomepage: true },
    orderBy: { position: "asc" },
  });
}

export async function getCollectionByHandle(handle: string) {
  return prisma.collection.findUnique({ where: { handle } });
}

export async function getAllCollections() {
  return prisma.collection.findMany({ orderBy: { position: "asc" } });
}

function isNewProduct(createdAt: Date, autoIncludeDays: number | null | undefined) {
  if (!autoIncludeDays) return false;
  const ageDays = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
  return ageDays <= autoIncludeDays;
}

export async function getProductCardsByCollection(handle: string) {
  const collection = await prisma.collection.findUnique({
    where: { handle },
    include: {
      products: {
        orderBy: { position: "asc" },
        include: {
          product: { include: { images: { orderBy: { position: "asc" }, take: 1 } } },
        },
      },
    },
  });
  if (!collection) return { collection: null, products: [] };

  const products = collection.products.map(({ product }) => ({
    id: product.id,
    handle: product.handle,
    name: product.name,
    price: toNum(product.price),
    salePrice: product.salePrice ? toNum(product.salePrice) : null,
    image: product.images[0]?.url ?? "illustration:cordless-drill",
    isNew: isNewProduct(product.createdAt, collection.autoIncludeDays),
    category: product.category,
  }));

  return { collection, products };
}

export type ProductFilters = {
  voltage?: string[];
  batteryType?: string[];
  brand?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: "price-asc" | "price-desc" | "newest" | "best-selling";
};

export async function getFilteredCollectionProducts(handle: string, filters: ProductFilters) {
  const collection = await prisma.collection.findUnique({
    where: { handle },
    include: {
      products: {
        include: {
          product: { include: { images: { orderBy: { position: "asc" }, take: 1 } } },
        },
      },
    },
  });
  if (!collection) return { collection: null, products: [], facets: { voltages: [], batteryTypes: [], brands: [] } };

  let items = collection.products.map(({ product }) => product);

  const voltages = Array.from(new Set(items.map((p) => p.voltage).filter(Boolean)));
  const batteryTypes = Array.from(new Set(items.map((p) => p.batteryType).filter(Boolean)));
  const brands = Array.from(new Set(items.map((p) => p.brand).filter(Boolean)));

  if (filters.voltage?.length) items = items.filter((p) => filters.voltage!.includes(p.voltage));
  if (filters.batteryType?.length) items = items.filter((p) => filters.batteryType!.includes(p.batteryType));
  if (filters.brand?.length) items = items.filter((p) => filters.brand!.includes(p.brand));
  if (typeof filters.minPrice === "number") items = items.filter((p) => toNum(p.salePrice ?? p.price) >= filters.minPrice!);
  if (typeof filters.maxPrice === "number") items = items.filter((p) => toNum(p.salePrice ?? p.price) <= filters.maxPrice!);

  switch (filters.sort) {
    case "price-asc":
      items = items.sort((a, b) => toNum(a.salePrice ?? a.price) - toNum(b.salePrice ?? b.price));
      break;
    case "price-desc":
      items = items.sort((a, b) => toNum(b.salePrice ?? b.price) - toNum(a.salePrice ?? a.price));
      break;
    case "newest":
      items = items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      break;
    default:
      break;
  }

  const products = items.map((product) => ({
    id: product.id,
    handle: product.handle,
    name: product.name,
    price: toNum(product.price),
    salePrice: product.salePrice ? toNum(product.salePrice) : null,
    image: product.images[0]?.url ?? "illustration:cordless-drill",
    isNew: isNewProduct(product.createdAt, collection.autoIncludeDays),
    category: product.category,
    voltage: product.voltage,
    batteryType: product.batteryType,
    brand: product.brand,
  }));

  return { collection, products, facets: { voltages, batteryTypes, brands } };
}

export async function getProductByHandle(handle: string) {
  const product = await prisma.product.findUnique({
    where: { handle },
    include: {
      images: { orderBy: { position: "asc" } },
      variants: { orderBy: { position: "asc" } },
      reviews: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        take: 24,
      },
    },
  });
  if (!product) return null;

  prisma.product.update({ where: { id: product.id }, data: { views: { increment: 1 } } }).catch(() => {});

  const [ratingCount, ratingAgg, distributionRaw] = await Promise.all([
    prisma.review.count({ where: { productId: product.id, status: "APPROVED" } }),
    prisma.review.aggregate({ where: { productId: product.id, status: "APPROVED" }, _avg: { rating: true } }),
    prisma.review.groupBy({
      by: ["rating"],
      where: { productId: product.id, status: "APPROVED" },
      _count: { rating: true },
    }),
  ]);
  const avgRating = ratingAgg._avg.rating ?? 0;
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: distributionRaw.find((d) => d.rating === star)?._count.rating ?? 0,
  }));

  return {
    ...product,
    price: toNum(product.price),
    salePrice: product.salePrice ? toNum(product.salePrice) : null,
    variants: product.variants.map((v) => ({ ...v, priceDelta: toNum(v.priceDelta) })),
    reviews: product.reviews.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
    avgRating,
    ratingCount,
    distribution,
  };
}

export async function getCrossSellProducts(excludeProductId: string, limit = 4) {
  const accessories = await prisma.collection.findUnique({
    where: { handle: "accessories" },
    include: {
      products: {
        where: { productId: { not: excludeProductId } },
        take: limit,
        orderBy: { position: "asc" },
        include: {
          product: {
            include: {
              images: { take: 1, orderBy: { position: "asc" } },
              variants: { take: 1, orderBy: { position: "asc" } },
            },
          },
        },
      },
    },
  });
  if (!accessories) return [];
  return accessories.products
    .filter(({ product }) => product.variants[0])
    .map(({ product }) => ({
      id: product.id,
      handle: product.handle,
      name: product.name,
      price: toNum(product.price),
      salePrice: product.salePrice ? toNum(product.salePrice) : null,
      image: product.images[0]?.url ?? "illustration:drill-bits",
      variantId: product.variants[0]!.id,
    }));
}

export async function getSiteReviewSummary() {
  const reviews = await prisma.review.findMany({ where: { status: "APPROVED" }, select: { rating: true } });
  const count = reviews.length;
  const avgRating = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;
  return { avgRating, count };
}

export async function getFeaturedReviews(limit = 8) {
  const reviews = await prisma.review.findMany({
    where: { status: "APPROVED", featured: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { product: { select: { name: true, handle: true } } },
  });
  return reviews.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));
}

export async function getOrderByNumber(orderNumber: string) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
  if (!order) return null;
  return {
    ...order,
    subtotal: toNum(order.subtotal),
    discountAmount: toNum(order.discountAmount),
    shippingCost: toNum(order.shippingCost),
    total: toNum(order.total),
    items: order.items.map((i) => ({ ...i, price: toNum(i.price) })),
  };
}

export async function getAllCollectionsForAdmin() {
  const collections = await prisma.collection.findMany({
    orderBy: { position: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return collections.map((c) => ({
    id: c.id,
    handle: c.handle,
    name: c.name,
    showOnHomepage: c.showOnHomepage,
    productCount: c._count.products,
  }));
}

export async function getCollectionForAdmin(id: string) {
  const collection = await prisma.collection.findUnique({
    where: { id },
    include: {
      products: {
        orderBy: { position: "asc" },
        include: { product: { include: { images: { take: 1, orderBy: { position: "asc" } } } } },
      },
    },
  });
  if (!collection) return null;
  return {
    ...collection,
    products: collection.products.map(({ product }) => ({
      id: product.id,
      name: product.name,
      image: product.images[0]?.url ?? "illustration:cordless-drill",
    })),
  };
}

export async function getAllProductsForAdmin() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { images: { take: 1, orderBy: { position: "asc" } } },
  });
  return products.map((p) => ({
    id: p.id,
    handle: p.handle,
    name: p.name,
    category: p.category,
    price: toNum(p.price),
    salePrice: p.salePrice ? toNum(p.salePrice) : null,
    stock: p.stock,
    published: p.published,
    image: p.images[0]?.url ?? "illustration:cordless-drill",
  }));
}

export async function getProductForAdmin(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { position: "asc" } },
      variants: { orderBy: { position: "asc" } },
      collections: { select: { collectionId: true } },
    },
  });
  if (!product) return null;
  return {
    ...product,
    price: toNum(product.price),
    salePrice: product.salePrice ? toNum(product.salePrice) : null,
    variants: product.variants.map((v) => ({ ...v, priceDelta: toNum(v.priceDelta) })),
    collectionIds: product.collections.map((c) => c.collectionId),
  };
}

export async function getAllReviewsForAdmin() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: { select: { name: true, handle: true } } },
  });
  return reviews.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));
}

export async function getAllOrdersForAdmin() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
  return orders.map((o) => ({
    ...o,
    subtotal: toNum(o.subtotal),
    discountAmount: toNum(o.discountAmount),
    shippingCost: toNum(o.shippingCost),
    total: toNum(o.total),
    items: o.items.map((i) => ({ ...i, price: toNum(i.price) })),
  }));
}

export async function getAllDiscountsForAdmin() {
  const discounts = await prisma.discountCode.findMany({ orderBy: { createdAt: "desc" } });
  return discounts.map((d) => ({ ...d, value: toNum(d.value) }));
}

export async function getDashboardStats() {
  const [orders, reviews, mostViewed, productCount, pendingReviews] = await Promise.all([
    prisma.order.findMany({ where: { status: { not: "CANCELLED" } }, select: { total: true, createdAt: true } }),
    prisma.review.findMany({ where: { status: "APPROVED" }, select: { rating: true } }),
    prisma.product.findMany({ orderBy: { views: "desc" }, take: 5, select: { id: true, name: true, handle: true, views: true } }),
    prisma.product.count(),
    prisma.review.count({ where: { status: "PENDING" } }),
  ]);

  const totalSales = orders.reduce((sum, o) => sum + toNum(o.total), 0);
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const now = Date.now();
  const last30 = orders.filter((o) => now - o.createdAt.getTime() < 30 * 24 * 60 * 60 * 1000);
  const salesLast30Days = last30.reduce((sum, o) => sum + toNum(o.total), 0);

  return {
    totalSales,
    orderCount: orders.length,
    salesLast30Days,
    ordersLast30Days: last30.length,
    avgRating,
    reviewCount: reviews.length,
    pendingReviews,
    productCount,
    mostViewed,
  };
}

export async function searchProducts(q: string) {
  if (!q.trim()) return [];
  const results = await prisma.product.findMany({
    where: {
      published: true,
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { category: { contains: q, mode: "insensitive" } },
        { brand: { contains: q, mode: "insensitive" } },
      ],
    },
    include: { images: { take: 1, orderBy: { position: "asc" } } },
    take: 24,
  });
  return results.map((product) => ({
    id: product.id,
    handle: product.handle,
    name: product.name,
    price: toNum(product.price),
    salePrice: product.salePrice ? toNum(product.salePrice) : null,
    image: product.images[0]?.url ?? "illustration:cordless-drill",
  }));
}

export async function getCustomerById(customerId: string) {
  return prisma.customer.findUnique({ where: { id: customerId } });
}

export async function getCustomerOrders(customerId: string) {
  const orders = await prisma.order.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
  return orders.map((o) => ({
    ...o,
    subtotal: toNum(o.subtotal),
    discountAmount: toNum(o.discountAmount),
    shippingCost: toNum(o.shippingCost),
    total: toNum(o.total),
    items: o.items.map((i) => ({ ...i, price: toNum(i.price) })),
  }));
}

export async function getCustomerReviews(customerId: string) {
  const reviews = await prisma.review.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
    include: { product: { select: { name: true, handle: true } } },
  });
  return reviews.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));
}

export async function validateDiscountCode(code: string) {
  const discount = await prisma.discountCode.findUnique({ where: { code: code.trim().toUpperCase() } });
  if (!discount || !discount.active) return null;
  if (discount.expiresAt && discount.expiresAt < new Date()) return null;
  if (discount.usageLimit != null && discount.usedCount >= discount.usageLimit) return null;
  return { id: discount.id, code: discount.code, type: discount.type, value: toNum(discount.value) };
}
