# Migration `20210624120513-stripe_products_and_prices`

This migration has been generated by Jussi at 6/24/2021, 3:05:13 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "subscriptions" ALTER COLUMN "current_period_end" DROP NOT NULL

CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "description" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
)

CREATE TABLE "product_prices" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "currency" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "recurring_interval" "IntervalType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
)

ALTER TABLE "product_prices" ADD FOREIGN KEY("product_id")REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20210623143037-default_subscription_id..20210624120513-stripe_products_and_prices
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
@@ -99,16 +99,8 @@
   @@map(name: "transaction_schedules")
 }
-// Possible interval types for transaction schedules
-enum IntervalType {
-  DAY
-  WEEK
-  MONTH
-  YEAR
-}
-
 // All budgets are used to analyze transactions and measure if their sum
 // exceed the set limit in integerAmount. A budget only measures transactions
 // that belong to categories specified by the budget category inclusiosn field.
 model Budget {
@@ -198,9 +190,9 @@
 model Subscription {
   id               String              @id @default(uuid())
   uid              String              @unique
   product          SubscribableProduct
-  currentPeriodEnd DateTime            @map("current_period_end")
+  currentPeriodEnd DateTime?           @map("current_period_end")
   createdAt        DateTime            @default(now()) @map("created_at")
   updatedAt        DateTime            @default(now()) @updatedAt @map("updated_at")
   User User @relation(fields: [uid], references: [id])
@@ -211,4 +203,43 @@
 // Possible subscription items
 enum SubscribableProduct {
   PREMIUM
 }
+
+// Copies of stripe products
+model Product {
+  id          String   @id
+  active      Boolean
+  description String
+  name        String
+  createdAt   DateTime @default(now()) @map("created_at")
+  updatedAt   DateTime @default(now()) @updatedAt @map("updated_at")
+
+  ProductPrice ProductPrice[]
+
+  @@map(name: "products")
+}
+
+// Copies of stripe prices
+model ProductPrice {
+  id                String       @id
+  productId         String       @map("product_id")
+  active            Boolean
+  currency          String
+  nickname          String
+  type              String
+  recurringInterval IntervalType @map("recurring_interval")
+  createdAt         DateTime     @default(now()) @map("created_at")
+  updatedAt         DateTime     @default(now()) @updatedAt @map("updated_at")
+
+  Product Product @relation(fields: [productId], references: [id])
+
+  @@map(name: "product_prices")
+}
+
+// Possible interval types for transaction schedules
+enum IntervalType {
+  DAY
+  WEEK
+  MONTH
+  YEAR
+}
```


