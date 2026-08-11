function loggerMiddleware(req, res, next) {
  const startTime = process.hrtime();
  res.on('finish', () => {
    const elapsed = process.hrtime(startTime);
    const ms = (elapsed[0] * 1000 + elapsed[1] / 1e6).toFixed(3);
    const timestamp = new Date().toISOString();
    console.log(`[penguin] ${timestamp} ${req.method} ${req.originalUrl || req.url} | ${res.statusCode} | ${ms}ms`);
  });
  next();
}

module.exports = loggerMiddleware;
