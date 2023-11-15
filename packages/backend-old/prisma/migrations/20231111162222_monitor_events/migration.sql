-- CreateTable
CREATE TABLE "MonitorEvents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "monitorId" INTEGER NOT NULL,
    "oldStatus" INTEGER NOT NULL,
    "newStatus" INTEGER NOT NULL,
    "message" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MonitorEvents_monitorId_fkey" FOREIGN KEY ("monitorId") REFERENCES "Monitor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "MonitorEvents_id_monitorId_createdAt_idx" ON "MonitorEvents"("id", "monitorId", "createdAt");
