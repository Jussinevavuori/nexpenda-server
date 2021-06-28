import { PremiumPrice } from "@prisma/client";
import { Stripe } from "stripe";
import { ENV } from "../../env";
import { prisma, stripe } from "../../server";
import { SimpleCache } from "../utils/SimpleCache";

export class PremiumPriceService {
  /**
   * Five minute cache for storing fetched premium prices.
   */
  static Cache = new SimpleCache<PremiumPrice[]>(300_000);

  /**
   * Fetch premium prices. Uses a five minute cache.
   */
  static async getPremiumPrices() {
    /**
     * Attempt to respond from cache if a fresh value exists.
     */
    const freshData = PremiumPriceService.Cache.getFresh();
    if (freshData) {
      return freshData;
    }

    /**
     * Premium prices
     */
    const premiumPrices = await prisma.premiumPrice.findMany({});
    PremiumPriceService.Cache.update(premiumPrices);
    return premiumPrices;
  }

  /**
   * Gets all prices for a product by its ID
   */
  static async getPricesForProductID(id: string) {
    const prices = await stripe.prices.list({ product: id });
    return prices.data;
  }

  /**
   * Deletes a single price in the database
   */
  static async deletePrice(price: string | Stripe.Price) {
    const id = typeof price === "string" ? price : price.id;
    return prisma.premiumPrice.delete({ where: { id } });
  }

  /**
   * Deletes all existing premium prices in the database
   */
  static async deleteAllPrices() {
    return prisma.premiumPrice.deleteMany({});
  }

  /**
   * Upserts many prices to the database and returns an array of upsert results
   */
  static async upsertManyPrices(prices: Stripe.Price[]) {
    const upsert = PremiumPriceService.upsertPrice;
    return Promise.all(prices.map((price) => upsert(price)));
  }

  /**
   * Upserts a single price to the database. Attempts updating when ID provided,
   * else creates new record.
   */
  static async upsertPrice(price: Stripe.Price) {
    const prod = price.product;
    const productId = typeof prod === "string" ? prod : prod.id;
    return prisma.premiumPrice.upsert({
      where: {
        id: price.id,
      },
      create: {
        id: price.id,
        active: price.active,
        currency: price.currency,
        productId: productId,
        type: price.type,
        nickname: price.nickname,
        recurringInterval: price.recurring?.interval,
        recurringIntervalCount: price.recurring?.interval_count,
        unitAmount: price.unit_amount,
      },
      update: {
        active: price.active,
        currency: price.currency,
        productId: productId,
        type: price.type,
        nickname: price.nickname,
        recurringInterval: price.recurring?.interval,
        recurringIntervalCount: price.recurring?.interval_count,
        unitAmount: price.unit_amount,
      },
    });
  }

  /**
   * Initialize all prices on server start up according to premium product ID
   * specified in .env
   */
  static async initialize() {
    const id = ENV.stripe.premiumProductId;
    const prices = await PremiumPriceService.getPricesForProductID(id);
    PremiumPriceService.deleteAllPrices();
    PremiumPriceService.upsertManyPrices(prices);
  }
}
