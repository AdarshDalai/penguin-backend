/**
 * Centralized API Response Messages per Endpoint.
 */
const MESSAGES = {
  HEALTH: {
    SUCCESS: 'health check successful',
  },
  AUTH: {
    SIGNUP_SUCCESS: 'user created successfully',
    LOGIN_SUCCESS: 'login successful',
    OTP_SENT: 'OTP or magic link sent successfully',
    OTP_VERIFIED: 'OTP verified successfully',
    OAUTH_URL_GENERATED: 'OAuth authorization URL generated',
    LOGOUT_SUCCESS: 'logout successful',
    USER_FETCHED: 'user fetched successfully',
    USER_UPDATED: 'user updated successfully',
    PASSWORD_RESET_SENT: 'password reset email sent successfully',
    SESSION_REFRESHED: 'session refreshed successfully',
    REAUTHENTICATED: 'reauthentication initiated',
    MISSING_TOKEN: 'authorization header with bearer token is required for logout',
    INVALID_CREDENTIALS: 'invalid credentials',
    ADMIN_USER_LISTED: 'users listed successfully',
    ADMIN_USER_FETCHED: 'user fetched successfully',
    ADMIN_USER_CREATED: 'user created via admin successfully',
    ADMIN_USER_UPDATED: 'user updated via admin successfully',
    ADMIN_USER_DELETED: 'user deleted via admin successfully',
  },
  PROFILE: {
    CREATED: 'profile created successfully',
    FETCHED: 'profile fetched successfully',
    UPDATED: 'profile updated successfully',
    DELETED: 'profile deleted successfully',
    NOT_FOUND: 'profile not found',
    REQUIRED_ID: 'profile id is required',
    AUTH_USER_NOT_FOUND: 'user id does not exist in auth.users',
  },
};

module.exports = {
  MESSAGES,
};
