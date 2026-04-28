import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) {
    return next(new HttpError(401, "Unauthorized"));
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    if (!payload || payload.role !== "admin") {
      return next(new HttpError(403, "Forbidden"));
    }
    req.user = payload;
    return next();
  } catch {
    return next(new HttpError(401, "Unauthorized"));
  }
}

