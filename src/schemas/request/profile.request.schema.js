/**
 * Request validation schemas for Profile endpoints.
 */

function validateCreateProfileRequest(body) {
  const { id, handle } = body || {};
  if (!id) {
    return { valid: false, message: 'profile id (user id) is required' };
  }
  if (!handle || handle.trim() === '') {
    return { valid: false, message: 'profile handle is required' };
  }
  return { valid: true };
}

function validateProfileIdParam(params) {
  const { id } = params || {};
  if (!id) {
    return { valid: false, message: 'profile id is required' };
  }
  return { valid: true };
}

module.exports = {
  validateCreateProfileRequest,
  validateProfileIdParam,
};
