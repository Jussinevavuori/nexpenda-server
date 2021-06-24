import { Stripe } from "stripe";
import { stripe } from "../../server";

export class StripeInvoiceEventHandler {
  /**
   * Ensure event type
   */
  static isEventType(type: any): type is StripeInvoiceEventType {
    return (
      type === "invoice.created" ||
      type === "invoice.deleted" ||
      type === "invoice.finalization_failed" ||
      type === "invoice.finalized" ||
      type === "invoice.marked_uncollectible" ||
      type === "invoice.paid" ||
      type === "invoice.payment_action_required" ||
      type === "invoice.payment_failed" ||
      type === "invoice.payment_succeeded" ||
      type === "invoice.sent" ||
      type === "invoice.upcoming" ||
      type === "invoice.updated" ||
      type === "invoice.voided"
    );
  }

  /**
   * Handle any event
   */
  static async handle(type: StripeInvoiceEventType, event: Stripe.Event) {
    const invoice = event.data.object as Stripe.Invoice;
  }
}
