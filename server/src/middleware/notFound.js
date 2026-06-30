import { ApiError } from "../utils/ApiError.js";

/**
 * middleware/notFound.js — נתיב לא קיים → 404 (מועבר ל-errorHandler).
 * ממוקם אחרי כל הראוטים ולפני errorHandler.
 */
export function notFound(req, _res, next) {
  next(new ApiError(404, `הנתיב לא נמצא: ${req.method} ${req.originalUrl}`));
}

export default notFound;
