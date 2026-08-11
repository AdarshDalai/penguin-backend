/**
 * Request validation schemas for Auth endpoints.
 */

const LOGOUT_SCOPE_ENUM = ['global', 'local', 'others'];

function validateSignUpRequest(body) {
  const { email, phone, password } = body || {};
  if (!email && !phone) {
    return { valid: false, message: 'email or phone is required' };
  }
  if (!password) {
    return { valid: false, message: 'password is required' };
  }
  return { valid: true };
}

function validateSignInRequest(body) {
  const { email, phone, password } = body || {};
  if (!email && !phone) {
    return { valid: false, message: 'email or phone is required' };
  }
  if (!password) {
    return { valid: false, message: 'password is required' };
  }
  return { valid: true };
}

function validateOtpRequest(body) {
  const { email, phone } = body || {};
  if (!email && !phone) {
    return { valid: false, message: 'email or phone is required' };
  }
  return { valid: true };
}

function validateVerifyOtpRequest(body) {
  const { email, phone, token, type } = body || {};
  if (!token || !type) {
    return { valid: false, message: 'token and type are required' };
  }
  if (!email && !phone) {
    return { valid: false, message: 'email or phone is required' };
  }
  return { valid: true };
}

function validateOAuthRequest(body) {
  const { provider } = body || {};
  if (!provider) {
    return { valid: false, message: 'provider is required (e.g. google, github, apple)' };
  }
  return { valid: true };
}

function validateLogoutRequest(body) {
  if (body && body.scope) {
    if (!LOGOUT_SCOPE_ENUM.includes(body.scope)) {
      return {
        valid: false,
        message: `invalid scope '${body.scope}'. Allowed values: ${LOGOUT_SCOPE_ENUM.map((s) => `'${s}'`).join(', ')}`,
      };
    }
  }
  return { valid: true };
}

function validateResetPasswordRequest(body) {
  const { email } = body || {};
  if (!email) {
    return { valid: false, message: 'email is required' };
  }
  return { valid: true };
}

function validateRefreshSessionRequest(body) {
  const { refresh_token } = body || {};
  if (!refresh_token) {
    return { valid: false, message: 'refresh_token is required' };
  }
  return { valid: true };
}

module.exports = {
  LOGOUT_SCOPE_ENUM,
  validateSignUpRequest,
  validateSignInRequest,
  validateOtpRequest,
  validateVerifyOtpRequest,
  validateOAuthRequest,
  validateLogoutRequest,
  validateResetPasswordRequest,
  validateRefreshSessionRequest,
};
