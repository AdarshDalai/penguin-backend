const authService = require('../services/auth.service');
const {
  validateSignUpRequest,
  validateSignInRequest,
  validateOtpRequest,
  validateVerifyOtpRequest,
  validateOAuthRequest,
  validateResetPasswordRequest,
  validateRefreshSessionRequest,
} = require('../schemas/request/auth.request.schema');
const { successResponse, errorResponse } = require('../schemas/response/auth.response.schema');
const { HTTP_STATUS } = require('../core/constants/http.constants');
const { MESSAGES } = require('../core/constants/messages.constants');

function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return null;
}

// 1. Health
async function health(req, res) {
  return res
    .status(HTTP_STATUS.OK)
    .json(successResponse(MESSAGES.HEALTH.SUCCESS, { status: 'ok' }));
}

// 2. Sign Up
async function signUp(req, res, next) {
  try {
    const validation = validateSignUpRequest(req.body);
    if (!validation.valid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(validation.message));
    }

    const { email, password, phone, options } = req.body;
    const payload = { password };
    if (email) payload.email = email.trim().toLowerCase();
    if (phone) payload.phone = phone.trim();
    if (options) payload.options = options;

    const { data, error } = await authService.signUpUser(payload);
    if (error) {
      return res.status(error.status || HTTP_STATUS.BAD_REQUEST).json(errorResponse(error.message));
    }

    return res.status(HTTP_STATUS.CREATED).json(successResponse(MESSAGES.AUTH.SIGNUP_SUCCESS, data));
  } catch (err) {
    next(err);
  }
}

// 3. Sign In with Password
async function signInWithPassword(req, res, next) {
  try {
    const validation = validateSignInRequest(req.body);
    if (!validation.valid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(validation.message));
    }

    const { email, phone, password } = req.body;
    const payload = { password };
    if (email) payload.email = email.trim().toLowerCase();
    if (phone) payload.phone = phone.trim();

    const { data, error } = await authService.signInUserWithPassword(payload);
    if (error) {
      return res
        .status(error.status || HTTP_STATUS.UNAUTHORIZED)
        .json(errorResponse(error.message || MESSAGES.AUTH.INVALID_CREDENTIALS));
    }

    return res.status(HTTP_STATUS.OK).json(successResponse(MESSAGES.AUTH.LOGIN_SUCCESS, data));
  } catch (err) {
    next(err);
  }
}

// 4. Sign In with OTP
async function signInWithOtp(req, res, next) {
  try {
    const validation = validateOtpRequest(req.body);
    if (!validation.valid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(validation.message));
    }

    const { email, phone, options } = req.body;
    const payload = {};
    if (email) payload.email = email.trim().toLowerCase();
    if (phone) payload.phone = phone.trim();
    if (options) payload.options = options;

    const { data, error } = await authService.signInUserWithOtp(payload);
    if (error) {
      return res.status(error.status || HTTP_STATUS.BAD_REQUEST).json(errorResponse(error.message));
    }

    return res.status(HTTP_STATUS.OK).json(successResponse(MESSAGES.AUTH.OTP_SENT, data));
  } catch (err) {
    next(err);
  }
}

// 5. Verify OTP
async function verifyOtp(req, res, next) {
  try {
    const validation = validateVerifyOtpRequest(req.body);
    if (!validation.valid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(validation.message));
    }

    const { email, phone, token, type, options } = req.body;
    const payload = { token, type };
    if (email) payload.email = email.trim().toLowerCase();
    if (phone) payload.phone = phone.trim();
    if (options) payload.options = options;

    const { data, error } = await authService.verifyUserOtp(payload);
    if (error) {
      return res.status(error.status || HTTP_STATUS.BAD_REQUEST).json(errorResponse(error.message));
    }

    return res.status(HTTP_STATUS.OK).json(successResponse(MESSAGES.AUTH.OTP_VERIFIED, data));
  } catch (err) {
    next(err);
  }
}

// 6. Sign In with OAuth
async function signInWithOAuth(req, res, next) {
  try {
    const validation = validateOAuthRequest(req.body);
    if (!validation.valid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(validation.message));
    }

    const { provider, options } = req.body;
    const payload = { provider };
    if (options) payload.options = options;

    const { data, error } = await authService.signInUserWithOAuth(payload);
    if (error) {
      return res.status(error.status || HTTP_STATUS.BAD_REQUEST).json(errorResponse(error.message));
    }

    return res
      .status(HTTP_STATUS.OK)
      .json(successResponse(MESSAGES.AUTH.OAUTH_URL_GENERATED, data));
  } catch (err) {
    next(err);
  }
}

// 7. Sign Out / Logout
async function signOut(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse(MESSAGES.AUTH.MISSING_TOKEN));
    }

    const validation = validateLogoutRequest(req.body);
    if (!validation.valid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(validation.message));
    }

    const scope = req.body?.scope || 'global';
    const { error } = await authService.signOutUser(token, scope);
    if (error) {
      return res.status(error.status || HTTP_STATUS.BAD_REQUEST).json(errorResponse(error.message));
    }

    return res
      .status(HTTP_STATUS.OK)
      .json(successResponse(MESSAGES.AUTH.LOGOUT_SUCCESS, { message: 'logged out', scope }));
  } catch (err) {
    next(err);
  }
}

// 8. Get User
async function getUser(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse(MESSAGES.AUTH.MISSING_TOKEN));
    }

    const { data, error } = await authService.getUserByToken(token);
    if (error) {
      return res.status(error.status || HTTP_STATUS.UNAUTHORIZED).json(errorResponse(error.message));
    }

    return res.status(HTTP_STATUS.OK).json(successResponse(MESSAGES.AUTH.USER_FETCHED, data));
  } catch (err) {
    next(err);
  }
}

// 9. Update User
async function updateUser(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse(MESSAGES.AUTH.MISSING_TOKEN));
    }

    const attributes = req.body || {};
    const { data, error } = await authService.updateUserByToken(token, attributes);
    if (error) {
      return res.status(error.status || HTTP_STATUS.BAD_REQUEST).json(errorResponse(error.message));
    }

    return res.status(HTTP_STATUS.OK).json(successResponse(MESSAGES.AUTH.USER_UPDATED, data));
  } catch (err) {
    next(err);
  }
}

// 10. Reset Password for Email
async function resetPasswordForEmail(req, res, next) {
  try {
    const validation = validateResetPasswordRequest(req.body);
    if (!validation.valid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(validation.message));
    }

    const { email, options } = req.body;
    const { data, error } = await authService.resetUserPassword(email.trim().toLowerCase(), options);
    if (error) {
      return res.status(error.status || HTTP_STATUS.BAD_REQUEST).json(errorResponse(error.message));
    }

    return res
      .status(HTTP_STATUS.OK)
      .json(successResponse(MESSAGES.AUTH.PASSWORD_RESET_SENT, data));
  } catch (err) {
    next(err);
  }
}

// 11. Refresh Session
async function refreshSession(req, res, next) {
  try {
    const validation = validateRefreshSessionRequest(req.body);
    if (!validation.valid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(validation.message));
    }

    const { refresh_token } = req.body;
    const { data, error } = await authService.refreshUserSession(refresh_token);
    if (error) {
      return res.status(error.status || HTTP_STATUS.UNAUTHORIZED).json(errorResponse(error.message));
    }

    return res
      .status(HTTP_STATUS.OK)
      .json(successResponse(MESSAGES.AUTH.SESSION_REFRESHED, data));
  } catch (err) {
    next(err);
  }
}

// 12. Reauthenticate
async function reauthenticate(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(errorResponse(MESSAGES.AUTH.MISSING_TOKEN));
    }

    const { data, error } = await authService.reauthenticateUser(token);
    if (error) {
      return res.status(error.status || HTTP_STATUS.BAD_REQUEST).json(errorResponse(error.message));
    }

    return res
      .status(HTTP_STATUS.OK)
      .json(successResponse(MESSAGES.AUTH.REAUTHENTICATED, data));
  } catch (err) {
    next(err);
  }
}

// Admin Controller Functions
async function adminListUsers(req, res, next) {
  try {
    const { page, perPage } = req.query;
    const options = {};
    if (page) options.page = parseInt(page, 10);
    if (perPage) options.perPage = parseInt(perPage, 10);

    const { data, error } = await authService.adminListUsers(options);
    if (error) {
      return res.status(error.status || HTTP_STATUS.BAD_REQUEST).json(errorResponse(error.message));
    }

    return res
      .status(HTTP_STATUS.OK)
      .json(successResponse(MESSAGES.AUTH.ADMIN_USER_LISTED, data));
  } catch (err) {
    next(err);
  }
}

async function adminGetUser(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse('user id is required'));
    }

    const { data, error } = await authService.adminGetUserById(id);
    if (error) {
      return res.status(error.status || HTTP_STATUS.NOT_FOUND).json(errorResponse(error.message));
    }

    return res
      .status(HTTP_STATUS.OK)
      .json(successResponse(MESSAGES.AUTH.ADMIN_USER_FETCHED, data));
  } catch (err) {
    next(err);
  }
}

async function adminCreateUser(req, res, next) {
  try {
    const attributes = req.body || {};
    const { data, error } = await authService.adminCreateUser(attributes);
    if (error) {
      return res.status(error.status || HTTP_STATUS.BAD_REQUEST).json(errorResponse(error.message));
    }

    return res
      .status(HTTP_STATUS.CREATED)
      .json(successResponse(MESSAGES.AUTH.ADMIN_USER_CREATED, data));
  } catch (err) {
    next(err);
  }
}

async function adminUpdateUser(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse('user id is required'));
    }

    const attributes = req.body || {};
    const { data, error } = await authService.adminUpdateUserById(id, attributes);
    if (error) {
      return res.status(error.status || HTTP_STATUS.BAD_REQUEST).json(errorResponse(error.message));
    }

    return res
      .status(HTTP_STATUS.OK)
      .json(successResponse(MESSAGES.AUTH.ADMIN_USER_UPDATED, data));
  } catch (err) {
    next(err);
  }
}

async function adminDeleteUser(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse('user id is required'));
    }

    const { data, error } = await authService.adminDeleteUserById(id);
    if (error) {
      return res.status(error.status || HTTP_STATUS.BAD_REQUEST).json(errorResponse(error.message));
    }

    return res
      .status(HTTP_STATUS.OK)
      .json(successResponse(MESSAGES.AUTH.ADMIN_USER_DELETED, data));
  } catch (err) {
    next(err);
  }
}

module.exports = {
  health,
  signUp,
  signInWithPassword,
  signInWithOtp,
  verifyOtp,
  signInWithOAuth,
  signOut,
  getUser,
  updateUser,
  resetPasswordForEmail,
  refreshSession,
  reauthenticate,
  adminListUsers,
  adminGetUser,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
};
