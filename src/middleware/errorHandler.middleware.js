function errorHandlerMiddleware(err, req, res, next) {
  console.error('[penguin] Internal Server Error:', err);
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'false',
    message: message,
    data: null,
  });
}

module.exports = errorHandlerMiddleware;
