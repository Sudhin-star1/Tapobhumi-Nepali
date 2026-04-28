export function errorHandler(err, req, res, next) {
  const status = typeof err?.statusCode === "number" ? err.statusCode : 500;
  const message = err?.message || "Server error";

  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error("[api] error", err);
  }

  res.status(status).json({
    message,
    ...(req.app.get("env") === "development" ? { stack: err?.stack } : {}),
  });
}

