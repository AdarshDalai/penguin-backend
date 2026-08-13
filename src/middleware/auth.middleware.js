const { getUserByToken } = require('../services/auth.service');
const { HTTP_STATUS } = require('../core/constants/http.constants');
const { errorResponse } = require('../schemas/response/auth.response.schema');

/**
 * Authentication middleware that verifies Bearer token via Supabase Auth.
 * Attaches decoded `user` and `token` to `req.user` and `req.token`.
 */
async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        errorResponse('Authorization header with Bearer token is required')
      );
    }

    const token = authHeader.substring(7).trim();
    if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        errorResponse('Authorization Bearer token cannot be empty')
      );
    }

    const { data: { user }, error } = await getUserByToken(token);

    if (error || !user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        errorResponse(error?.message || 'Invalid or expired authentication token')
      );
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Authorization middleware ensuring the authenticated user possesses admin privileges.
 */
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(
      errorResponse('Authentication required')
    );
  }

  const isSuperAdmin = req.user.is_super_admin === true;
  const appMetaData = req.user.app_metadata || {};
  const roles = appMetaData.roles || [];
  const isAdminRole = roles.includes('admin') || appMetaData.is_admin === true;

  if (!isSuperAdmin && !isAdminRole) {
    return res.status(HTTP_STATUS.FORBIDDEN).json(
      errorResponse('Access denied: Admin privileges required')
    );
  }

  next();
}

module.exports = {
  authenticateToken,
  requireAdmin,
};
