-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PageSection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "titleZh" TEXT,
    "titleEn" TEXT,
    "subtitleZh" TEXT,
    "subtitleEn" TEXT,
    "contentZh" TEXT,
    "contentEn" TEXT,
    "imageUrl" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_PageSection" ("contentEn", "contentZh", "id", "imageUrl", "isVisible", "key", "subtitleEn", "subtitleZh", "titleEn", "titleZh", "updatedAt") SELECT "contentEn", "contentZh", "id", "imageUrl", "isVisible", "key", "subtitleEn", "subtitleZh", "titleEn", "titleZh", "updatedAt" FROM "PageSection";
DROP TABLE "PageSection";
ALTER TABLE "new_PageSection" RENAME TO "PageSection";
CREATE UNIQUE INDEX "PageSection_key_key" ON "PageSection"("key");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
