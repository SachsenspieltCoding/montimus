import { Request, Response } from "express";

export interface Route {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  permissionLevel?: number;
  handler: (req: Request, res: Response) => void;
}
