import { StripeInvoiceEventHandler } from "./StripeInvoiceEventHandler";

export function isStripeEventType(type: any): type is StripeEventType {
  return (
    isStripePriceEventType(type) ||
    isStripeProductEventType(type) ||
    isStripeSubscriptionScheduleEventType(type) ||
    isStripeCustomerEventType(type) ||
    StripeInvoiceEventHandler.isEventType(type) ||
    isStripeCheckoutEventType(type)
  );
}

export function isStripePriceEventType(
  type: any
): type is StripePriceEventType {
  return (
    type === "price.created" ||
    type === "price.deleted" ||
    type === "price.updated"
  );
}

export function isStripeProductEventType(
  type: any
): type is StripeProductEventType {
  return (
    type === "product.created" ||
    type === "product.deleted" ||
    type === "product.updated"
  );
}

export function isStripeSubscriptionScheduleEventType(
  type: any
): type is StripeSubscriptionScheduleEventType {
  return (
    type === "subscription_schedule.aborted" ||
    type === "subscription_schedule.canceled" ||
    type === "subscription_schedule.completed" ||
    type === "subscription_schedule.created" ||
    type === "subscription_schedule.expiring" ||
    type === "subscription_schedule.released" ||
    type === "subscription_schedule.updated"
  );
}

export function isStripeCustomerEventType(
  type: any
): type is StripeCustomerEventType {
  return (
    type === "customer.created" ||
    type === "customer.deleted" ||
    type === "customer.updated" ||
    type === "customer.discount.created" ||
    type === "customer.discount.deleted" ||
    type === "customer.discount.updated" ||
    type === "customer.source.created" ||
    type === "customer.card.created" ||
    type === "customer.bank_account.created" ||
    type === "customer.source.deleted" ||
    type === "customer.card.deleted" ||
    type === "customer.bank_account.deleted" ||
    type === "customer.source.expiring" ||
    type === "customer.source.updated" ||
    type === "customer.card.updated" ||
    type === "customer.bank_account.updated" ||
    type === "customer.subscription.created" ||
    type === "customer.subscription.deleted" ||
    type === "customer.subscription.pending_update_applied" ||
    type === "customer.subscription.pending_update_expired" ||
    type === "customer.subscription.trial_will_end" ||
    type === "customer.subscription.updated" ||
    type === "customer.tax_id.created" ||
    type === "customer.tax_id.deleted" ||
    type === "customer.tax_id.updated"
  );
}

export function isStripeCheckoutEventType(
  type: any
): type is StripeCheckoutEventType {
  return (
    type === "checkout.session.async_payment_failed" ||
    type === "checkout.session.async_payment_succeeded" ||
    type === "checkout.session.completed"
  );
}
