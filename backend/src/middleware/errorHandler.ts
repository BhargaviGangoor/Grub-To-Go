import { Request, Response, NextFunction } from "express";

/**
 * errorHandler.ts
 *
 * Global Express error handler middleware.
 *
 * ─── WHAT THIS IS ────────────────────────────────────────────────────────────
 * Express has a special middleware signature with 4 parameters:
 *   (err, req, res, next) => void
 * When any route calls `next(error)`, Express skips all regular middleware
 * and routes this error directly to the first 4-parameter middleware it finds.
 *
 * ─── WHY CENTRALIZE ERROR HANDLING ──────────────────────────────────────────
 * Without this, every controller would need its own try/catch + error format.
 * With this: controllers just call `next(error)` and this takes over.
 * Benefits:
 *   1. Consistent error shape across ALL endpoints
 *   2. No stack traces leaking to clients in production
 *   3. Central place to add logging, alerting, Sentry etc.
 *   4. Controllers stay clean — they only handle the happy path
 *
 * ─── MUST BE MOUNTED LAST ────────────────────────────────────────────────────
 * Express middleware runs in order of registration.
 * Error handlers must be mounted AFTER all routes.
 * See index.ts: app.use(routes); app.use(errorHandler);
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction  // _ prefix: TypeScript convention for "required but unused"
): void {
  // Log server-side (never expose stack traces to clients in production)
  console.error(`[Error] ${req.method} ${req.path}:`, err.message);

  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  // Determine HTTP status
  const status = (err as any).status || (err as any).statusCode || 500;

  // Determine error message
  // In production: generic message for 500s (never leak internal details)
  // In development: show actual error for debugging
  const message =
    status === 500 && process.env.NODE_ENV === "production"
      ? "An unexpected error occurred. Please try again."
      : err.message || "Internal Server Error";

  res.status(status).json({
    error: message,
    status,
    // Only include request path in development for easier debugging
    ...(process.env.NODE_ENV === "development" && { path: req.path }),
  });
}
