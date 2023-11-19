/*
  Warnings:

  - You are about to drop the column `lastCheck` on the `Monitor` table. All the data in the column will be lost.
  - You are about to drop the column `lastPing` on the `Monitor` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Monitor` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `MonitorHistory` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `MonitorHistory` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Monitor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'http',
    "url" TEXT NOT NULL,
    "interval" INTEGER NOT NULL DEFAULT 60,
    "parameters_json" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Monitor" ("createdAt", "description", "id", "interval", "name", "type", "updatedAt", "url") SELECT "createdAt", "description", "id", "interval", "name", "type", "updatedAt", "url" FROM "Monitor";
DROP TABLE "Monitor";
ALTER TABLE "new_Monitor" RENAME TO "Monitor";
CREATE INDEX "Monitor_id_type_idx" ON "Monitor"("id", "type");
CREATE TABLE "new_MonitorHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" INTEGER NOT NULL DEFAULT -1,
    "monitorId" INTEGER NOT NULL,
    "ping" INTEGER,
    "info_json" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MonitorHistory_monitorId_fkey" FOREIGN KEY ("monitorId") REFERENCES "Monitor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MonitorHistory" ("createdAt", "id", "monitorId", "status") SELECT "createdAt", "id", "monitorId", "status" FROM "MonitorHistory";
DROP TABLE "MonitorHistory";
ALTER TABLE "new_MonitorHistory" RENAME TO "MonitorHistory";
CREATE INDEX "MonitorHistory_id_monitorId_createdAt_idx" ON "MonitorHistory"("id", "monitorId", "createdAt");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
