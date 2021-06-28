import { PremiumPriceMapper } from "../../lib/dataMappers/PremiumPriceMapper";
import { DatabaseAccessFailure } from "../../lib/result/Failures";
import { PremiumPriceService } from "../../lib/stripe/PremiumPriceService";
import { stripeRouter } from "../../routers";

/**
 * Fetch all premium product prices
 */
stripeRouter.get("/premium_prices", async (req, res, next) => {
  try {
    const prices = await PremiumPriceService.getPremiumPrices();
    return res.json(PremiumPriceMapper.premiumPriceToResponse(prices));
  } catch (e) {
    return new DatabaseAccessFailure(e);
  }
});
