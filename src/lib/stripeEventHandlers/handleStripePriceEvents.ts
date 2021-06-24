import { Stripe } from "stripe";
import { prisma, stripe } from "../../server";

async function getOrCreateProduct(priceProduct: Stripe.Price["product"]) {
  const id = typeof priceProduct === "string" ? priceProduct : priceProduct.id;

  // Attempt finding existing and returning it
  const existing = await prisma.stripeProduct.findUnique({ where: { id } });
  if (existing) return existing;

  // Else attempt finding one from stripe and creating it
  const stripeProduct = await stripe.products.retrieve(id);
  if (!stripeProduct) return undefined;
  return prisma.stripeProduct.upsert({
    where: { id: stripeProduct.id },
    create: {
      id: stripeProduct.id,
      active: stripeProduct.active,
      description: stripeProduct.description ?? "",
      name: stripeProduct.name,
    },
    update: {
      active: stripeProduct.active,
      description: stripeProduct.description ?? "",
      name: stripeProduct.name,
    },
  });
}

async function upsertPrice(price: Stripe.Price) {
  const product = await getOrCreateProduct(price.product);
  if (!product) {
    console.error("Could not find or create product");
    return;
  }

  // Upsert Stripe price
  return prisma.stripePrice.upsert({
    where: { id: price.id },
    create: {
      id: price.id,
      active: price.active,
      currency: price.currency,
      nickname: price.nickname,
      recurringInterval: price.recurring?.interval,
      type: price.type,
      Product: { connect: { id: product.id } },
    },
    update: {
      active: price.active,
      currency: price.currency,
      nickname: price.nickname,
      recurringInterval: price.recurring?.interval,
      type: price.type,
      Product: { connect: { id: product.id } },
    },
  });
}

export async function handleStripePriceCreatedEvent(event: Stripe.Event) {
  if (event.type !== "price.created") return;
  const price = event.data.object as Stripe.Price;
  upsertPrice(price);
}

export async function handleStripePriceUpdatedEvent(event: Stripe.Event) {
  if (event.type !== "price.updated") return;
  const price = event.data.object as Stripe.Price;
  upsertPrice(price);
}

export async function handleStripePriceDeletedEvent(event: Stripe.Event) {
  if (event.type !== "price.deleted") return;
  const price = event.data.object as Stripe.Price;

  // Delete price
  await prisma.stripePrice.delete({
    where: { id: price.id },
  });
}
