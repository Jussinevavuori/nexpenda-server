import { Stripe } from "stripe";
import { prisma } from "../../server";

async function upsertProduct(product: Stripe.Product) {
  return prisma.stripeProduct.upsert({
    where: { id: product.id },
    create: {
      id: product.id,
      active: product.active,
      description: product.description ?? "",
      name: product.name,
    },
    update: {
      active: product.active,
      description: product.description ?? "",
      name: product.name,
    },
  });
}

export async function handleStripeProductCreatedEvent(event: Stripe.Event) {
  if (event.type !== "product.created") return;
  const product = event.data.object as Stripe.Product;
  upsertProduct(product);
}

export async function handleStripeProductUpdatedEvent(event: Stripe.Event) {
  if (event.type !== "product.updated") return;
  const product = event.data.object as Stripe.Product;
  upsertProduct(product);
}

export async function handleStripeProductDeletedEvent(event: Stripe.Event) {
  if (event.type !== "product.deleted") return;
  const product = event.data.object as Stripe.Product;

  // Delete prices associated with product
  await prisma.stripePrice.deleteMany({
    where: { productId: product.id },
  });

  // Delete product
  await prisma.stripeProduct.delete({
    where: { id: product.id },
  });
}
