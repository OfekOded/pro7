/**
 * asyncHandler — עוטף בקר אסינכרוני ומעביר שגיאות ל-next() (→ errorHandler).
 * חוסך try/catch בכל בקר.
 *
 * שימוש:  router.post("/", asyncHandler(controller.create));
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
