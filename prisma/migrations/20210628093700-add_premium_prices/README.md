# Migration `20210628093700-add_premium_prices`

This migration has been generated by Jussi at 6/28/2021, 12:37:00 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "premium_prices" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "currency" TEXT NOT NULL,
    "nickname" TEXT,
    "type" TEXT NOT NULL,
    "recurring_interval" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
)
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20210624122137-update_subscription_model_name..20210628093700-add_premium_prices
--- datamodel.dml
+++ datamodel.dml
@@ -3,9 +3,9 @@
 }
 datasource postgresql {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 // Each user is connected to a user account, which contains their ID, login
 // details and other authentication details. The user account may also specify
@@ -242,4 +242,19 @@
   Product StripeProduct @relation(fields: [productId], references: [id])
   @@map(name: "stripe_prices")
 }
+
+// Copies of stripe prices
+model PremiumPrice {
+  id                String   @id
+  productId         String   @map("product_id")
+  active            Boolean
+  currency          String
+  nickname          String?
+  type              String
+  recurringInterval String?  @map("recurring_interval")
+  createdAt         DateTime @default(now()) @map("created_at")
+  updatedAt         DateTime @default(now()) @updatedAt @map("updated_at")
+
+  @@map(name: "premium_prices")
+}
```

