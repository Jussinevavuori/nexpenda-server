# Migration `20200821114814-setup`

This migration has been generated by Jussi at 8/21/2020, 2:48:14 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."transactions" (
"id" text   NOT NULL ,
"uid" text   NOT NULL ,
"integer_amount" integer   NOT NULL ,
"category" text   NOT NULL ,
"date" integer   NOT NULL ,
"comment" text   ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."users" (
"id" text   NOT NULL ,
"email" text   ,
"display_name" text   ,
"password" text   ,
"google_id" text   ,
"photo_url" text   ,
PRIMARY KEY ("id")
)

CREATE UNIQUE INDEX "users.email_unique" ON "public"."users"("email")

CREATE UNIQUE INDEX "users.google_id_unique" ON "public"."users"("google_id")

ALTER TABLE "public"."transactions" ADD FOREIGN KEY ("uid")REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200821114814-setup
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,32 @@
+generator client {
+  provider = "prisma-client-js"
+}
+
+datasource postgresql {
+  provider = "postgresql"
+  url = "***"
+}
+
+model Transaction {
+  id            String  @id @default(uuid())
+  uid           String
+  user          User    @relation(fields: [uid], references: [id])
+  integerAmount Int     @map("integer_amount")
+  category      String
+  date          Int
+  comment       String?
+
+  @@map(name: "transactions")
+}
+
+model User {
+  id           String        @id @default(uuid())
+  email        String?       @unique
+  displayName  String?       @map("display_name")
+  password     String?
+  googleId     String?       @unique @map("google_id")
+  photoUrl     String?       @map("photo_url")
+  transactions Transaction[]
+
+  @@map(name: "users")
+}
```

