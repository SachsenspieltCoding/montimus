-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserSessions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "jwt" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "expiresAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserSessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserSessions" ("createdAt", "id", "jwt", "name", "updatedAt", "userId") SELECT "createdAt", "id", "jwt", "name", "updatedAt", "userId" FROM "UserSessions";
DROP TABLE "UserSessions";
ALTER TABLE "new_UserSessions" RENAME TO "UserSessions";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
