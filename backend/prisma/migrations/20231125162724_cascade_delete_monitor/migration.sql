-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MonitorHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" INTEGER NOT NULL DEFAULT -1,
    "monitorId" INTEGER NOT NULL,
    "ping" INTEGER,
    "info_json" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MonitorHistory_monitorId_fkey" FOREIGN KEY ("monitorId") REFERENCES "Monitor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MonitorHistory" ("createdAt", "id", "info_json", "monitorId", "ping", "status") SELECT "createdAt", "id", "info_json", "monitorId", "ping", "status" FROM "MonitorHistory";
DROP TABLE "MonitorHistory";
ALTER TABLE "new_MonitorHistory" RENAME TO "MonitorHistory";
CREATE INDEX "MonitorHistory_id_monitorId_createdAt_idx" ON "MonitorHistory"("id", "monitorId", "createdAt");
CREATE TABLE "new_MonitorEvents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "monitorId" INTEGER NOT NULL,
    "oldStatus" INTEGER NOT NULL,
    "newStatus" INTEGER NOT NULL,
    "message" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MonitorEvents_monitorId_fkey" FOREIGN KEY ("monitorId") REFERENCES "Monitor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MonitorEvents" ("createdAt", "id", "message", "monitorId", "newStatus", "oldStatus") SELECT "createdAt", "id", "message", "monitorId", "newStatus", "oldStatus" FROM "MonitorEvents";
DROP TABLE "MonitorEvents";
ALTER TABLE "new_MonitorEvents" RENAME TO "MonitorEvents";
CREATE INDEX "MonitorEvents_id_monitorId_createdAt_idx" ON "MonitorEvents"("id", "monitorId", "createdAt");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
