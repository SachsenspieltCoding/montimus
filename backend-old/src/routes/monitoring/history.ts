import { prisma } from "../../backend";
import { PermissionLevel } from "../../helpers/permissions";
import { sendResponse } from "../../helpers/response";
import { Route } from "../../route";

export default [
  {
    method: "GET",
    path: "/monitoring/history",
    permissionLevel: PermissionLevel.NONE,
    async handler(req, res) {
      const { id, limit, offset, reverse, onlyPing } = req.query;

      if (!id) {
        return sendResponse(res, 400, "Missing id");
      }

      const monitorHistory = await prisma.monitorHistory.findMany({
        where: {
          monitorId: Number(id),
        },
        orderBy: {
          id: reverse === "true" ? "desc" : "asc",
        },
        take: Number(limit) || undefined,
        skip: Number(offset) || 0,
        select: onlyPing === "true" ? { id: true, ping: true } : undefined,
      });

      if (!monitorHistory || monitorHistory.length === 0) {
        return sendResponse(res, 404, "Monitor not found");
      }

      return sendResponse(res, 200, undefined, monitorHistory);
    },
  },
  {
    method: "GET",
    path: "/monitoring/events",
    permissionLevel: PermissionLevel.NONE,
    async handler(req, res) {
      const { id, limit, offset, reverse } = req.query;

      if (!id) {
        return sendResponse(res, 400, "Missing id");
      }

      const monitorEvents = await prisma.monitorEvents.findMany({
        where: {
          monitorId: Number(id),
        },
        orderBy: {
          id: reverse === "true" ? "desc" : "asc",
        },
        take: Number(limit) || undefined,
        skip: Number(offset) || 0,
      });

      if (!monitorEvents || monitorEvents.length === 0) {
        return sendResponse(res, 404, "Monitor not found");
      }

      return sendResponse(res, 200, undefined, monitorEvents);
    },
  },
] as Route[];
