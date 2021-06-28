import { PremiumPrice } from ".prisma/client";

export type PremiumPriceResponseMappable = PremiumPrice;

export type PremiumPriceResponse = {
  id: string;
  productId: string;
  active: boolean;
  currency: string;
  nickname?: string;
  type: string;
  recurringInterval?: string;
  recurringIntervalCount?: number;
  unitAmount?: number;
  createdAt: number;
  updatedAt: number;
};

/**
 * The premium price mapper is used to map single or multiple PremiumPrices into
 * a PremiumPrice response that can be sent to the caller in the response.
 */
export class PremiumPriceMapper {
  static premiumPriceToResponse(
    price: PremiumPriceResponseMappable
  ): PremiumPriceResponse;
  static premiumPriceToResponse(
    price: PremiumPriceResponseMappable[]
  ): PremiumPriceResponse[];

  /**
   * Maps a single or multiple PremiumPrices to a format which is then sent to
   * the user.
   *
   * @param PremiumPrice Single PremiumPrice or an array of PremiumPrices.
   */
  static premiumPriceToResponse(
    price: PremiumPriceResponseMappable | PremiumPriceResponseMappable[]
  ): PremiumPriceResponse | PremiumPriceResponse[] {
    if (Array.isArray(price)) {
      return price.map((t) => PremiumPriceMapper.premiumPriceToResponse(t));
    } else {
      return {
        id: price.id,
        productId: price.productId,
        active: price.active,
        currency: price.currency,
        nickname: price.nickname ?? undefined,
        type: price.type,
        recurringInterval: price.recurringInterval ?? undefined,
        recurringIntervalCount: price.recurringIntervalCount ?? undefined,
        unitAmount: price.unitAmount ?? undefined,
        createdAt: price.createdAt.getTime(),
        updatedAt: price.updatedAt.getTime(),
      };
    }
  }
}
