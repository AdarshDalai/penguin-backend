function loggerMiddleware(req, res, next) {
  const startTime = process.hrtime();
  const timestamp = new Date().toISOString();
  console.log(`[penguin:REQ] ${timestamp} ${req.method} ${req.originalUrl || req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) sanitizedBody.password = '***REDACTED***';
    console.log(`[penguin:BODY] ${JSON.stringify(sanitizedBody)}`);
  }

  res.on('finish', () => {
    const elapsed = process.hrtime(startTime);
    const ms = (elapsed[0] * 1000 + elapsed[1] / 1e6).toFixed(3);
    console.log(`[penguin:RES] ${req.method} ${req.originalUrl || req.url} | STATUS ${res.statusCode} | ${ms}ms`);
  });
  next();
}

module.exports = loggerMiddleware;
