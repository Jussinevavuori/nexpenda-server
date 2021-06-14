# Migration `20210531152129-add_google_photo_url`

This migration has been generated by Jussi at 5/31/2021, 6:21:29 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "profiles" ADD COLUMN     "google_photo_url" TEXT
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20210507104725-add-configad--confi..20210531152129-add_google_photo_url
--- datamodel.dml
+++ datamodel.dml
@@ -3,9 +3,9 @@
 }
 datasource postgresql {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 model Transaction {
   id            String   @id @default(uuid())
@@ -46,13 +46,14 @@
   @@map(name: "users")
 }
 model Profile {
-  uid         String  @id
-  displayName String? @map("display_name")
-  photoUrl    String? @map("photo_url")
-  themeColor  String? @map("theme_color")
-  themeMode   String? @map("theme_mode")
+  uid            String  @id
+  displayName    String? @map("display_name")
+  photoUrl       String? @map("photo_url")
+  googlePhotoUrl String? @map("google_photo_url")
+  themeColor     String? @map("theme_color")
+  themeMode      String? @map("theme_mode")
   User User @relation(fields: [uid], references: [id])
   @@map(name: "profiles")
 }
```

