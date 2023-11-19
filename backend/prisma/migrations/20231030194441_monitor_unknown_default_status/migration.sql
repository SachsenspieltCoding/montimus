-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Monitor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'http',
    "url" TEXT NOT NULL,
    "interval" INTEGER NOT NULL DEFAULT 60,
    "status" TEXT NOT NULL DEFAULT 'unknown',
    "lastCheck" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastPing" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Monitor" ("createdAt", "description", "id", "interval", "lastCheck", "lastPing", "name", "status", "type", "updatedAt", "url") SELECT "createdAt", "description", "id", "interval", "lastCheck", "lastPing", "name", "status", "type", "updatedAt", "url" FROM "Monitor";
DROP TABLE "Monitor";
ALTER TABLE "new_Monitor" RENAME TO "Monitor";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
