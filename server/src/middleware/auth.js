import { verify } from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";

export function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return next(new ApiError(401, "נדרשת התחברות למערכת"));
  }

  try {
    const payload = verify(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (error) {
    next(new ApiError(401, "טוקן פג תוקף או לא תקין"));
  }
}

export default auth;