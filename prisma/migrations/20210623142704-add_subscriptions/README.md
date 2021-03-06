# Migration `20210623142704-add_subscriptions`

This migration has been generated by Jussi at 6/23/2021, 5:27:04 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "public"."SubscribableProduct" AS ENUM ('PREMIUM')

CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "product" "SubscribableProduct" NOT NULL,
    "current_period_end" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
)

CREATE UNIQUE INDEX "subscriptions_uid_unique" ON "subscriptions"("uid")

ALTER TABLE "subscriptions" ADD FOREIGN KEY("uid")REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20210622115908-add_latest_created_occurrence..20210623142704-add_subscriptions
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
@@ -31,8 +31,9 @@
   Feedback            Feedback[]
   Profile             Profile?
   Log                 Log[]
   TransactionSchedule TransactionSchedule[]
+  Subscription        Subscription?
   @@map(name: "users")
 }
@@ -191,4 +192,23 @@
 model Config {
   key   String @id
   value String
 }
+
+// Subscriptions
+model Subscription {
+  id               String              @id
+  uid              String
+  product          SubscribableProduct
+  currentPeriodEnd DateTime            @map("current_period_end")
+  createdAt        DateTime            @default(now()) @map("created_at")
+  updatedAt        DateTime            @default(now()) @updatedAt @map("updated_at")
+
+  User User @relation(fields: [uid], references: [id])
+
+  @@map(name: "subscriptions")
+}
+
+// Possible subscription items
+enum SubscribableProduct {
+  PREMIUM
+}
```


