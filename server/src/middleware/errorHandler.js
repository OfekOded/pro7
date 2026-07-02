export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  
  if (status === 500) {
    console.error("💥 Server Error:", err);
  }

  res.status(status).json({
    message: err.message || "שגיאת שרת פנימית",
    details: err.details ?? null,
  });
}

export default errorHandler;