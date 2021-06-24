type StripePriceEventType = "price.created" | "price.deleted" | "price.updated";

type StripeProductEventType =
  | "product.created"
  | "product.deleted"
  | "product.updated";

type StripeSubscriptionScheduleEventType =
  | "subscription_schedule.aborted"
  | "subscription_schedule.canceled"
  | "subscription_schedule.completed"
  | "subscription_schedule.created"
  | "subscription_schedule.expiring"
  | "subscription_schedule.released"
  | "subscription_schedule.updated";

type StripeCustomerEventType =
  | "customer.created"
  | "customer.deleted"
  | "customer.updated"
  | "customer.discount.created"
  | "customer.discount.deleted"
  | "customer.discount.updated"
  | "customer.source.created"
  | "customer.card.created"
  | "customer.bank_account.created"
  | "customer.source.deleted"
  | "customer.card.deleted"
  | "customer.bank_account.deleted"
  | "customer.source.expiring"
  | "customer.source.updated"
  | "customer.card.updated"
  | "customer.bank_account.updated"
  | "customer.subscription.created"
  | "customer.subscription.deleted"
  | "customer.subscription.pending_update_applied"
  | "customer.subscription.pending_update_expired"
  | "customer.subscription.trial_will_end"
  | "customer.subscription.updated"
  | "customer.tax_id.created"
  | "customer.tax_id.deleted"
  | "customer.tax_id.updated";

type StripeInvoiceEventType =
  | "invoice.created"
  | "invoice.deleted"
  | "invoice.finalization_failed"
  | "invoice.finalized"
  | "invoice.marked_uncollectible"
  | "invoice.paid"
  | "invoice.payment_action_required"
  | "invoice.payment_failed"
  | "invoice.payment_succeeded"
  | "invoice.sent"
  | "invoice.upcoming"
  | "invoice.updated"
  | "invoice.voided";

type StripeCheckoutEventType =
  | "checkout.session.async_payment_failed"
  | "checkout.session.async_payment_succeeded"
  | "checkout.session.completed";

type StripeEventType =
  | StripePriceEventType
  | StripeSubscriptionScheduleEventType
  | StripeCustomerEventType
  | StripeProductEventType
  | StripeInvoiceEventType
  | StripeCheckoutEventType;
