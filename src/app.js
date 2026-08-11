const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const loggerMiddleware = require('./middleware/logger.middleware');
const errorHandlerMiddleware = require('./middleware/errorHandler.middleware');

const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const openapiSpec = require('./docs/swagger');

const app = express();

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// OpenApi spec JSON route
app.get('/openapi.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(openapiSpec);
});

// Swagger UI route
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

// Register router buckets
app.use('/', authRoutes);
app.use('/', profileRoutes);

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'false',
    message: 'route not found',
    data: null,
  });
});

// Central error handler
app.use(errorHandlerMiddleware);

module.exports = app;
