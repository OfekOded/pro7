import { ApiError } from "../utils/ApiError.js";

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "נדרשת התחברות"));
    }
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "אין לך הרשאה לבצע פעולה זו"));
    }
    next();
  };
};

export default requireRole;