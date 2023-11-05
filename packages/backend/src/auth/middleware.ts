import { NextFunction, Request, Response } from "express";
import { prisma } from "../backend";
import { PermissionLevel } from "../helpers/permissions";
import { sendResponse } from "../helpers/response";
import { getRoute } from "../routeIndex";
import { verifyUserToken } from "./jwt";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const route = getRoute(req.path, req.method);

  if (!route) return sendResponse(res, 404, "Not Found");

  if (
    route.permissionLevel !== undefined &&
    route.permissionLevel === PermissionLevel.NONE
  ) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    sendResponse(res, 401, "Unauthorized");
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    sendResponse(res, 401, "Unauthorized");
    return;
  }

  verifyUserToken(token, async (err, decoded) => {
    if (err) {
      sendResponse(res, 401, "Unauthorized");
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id, sessions: { some: { jwt: token } } },
    });

    if (!user) {
      sendResponse(res, 401, "Unauthorized");
      return;
    }

    if (
      route.permissionLevel !== undefined &&
      route.permissionLevel > user.permission
    ) {
      sendResponse(res, 403, "Forbidden");
      return;
    }

    res.locals.user = user;
    next();
  });
}
