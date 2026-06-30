/**
 * ApiError — שגיאת אפליקציה עם קוד סטטוס HTTP.
 * זורקים אותה משכבת ה-services/controllers; errorHandler מתרגם ל-JSON.
 *
 * דוגמה:  throw new ApiError(409, "החלון כבר תפוס");
 */
export class ApiError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export default ApiError;
