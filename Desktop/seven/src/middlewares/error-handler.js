// src/middlewares/error-handler.js

export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  console.error(
    `[ERROR] Status: ${statusCode}, Path: ${req.path}, Message: ${message}`
  );
  if (statusCode === 500) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    status: "error",
    message: message,
  });
};
