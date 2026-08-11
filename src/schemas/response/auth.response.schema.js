/**
 * Standardized API Response Envelopes.
 */

function successResponse(message, data = null) {
  return {
    status: 'true',
    message: message,
    data: data,
  };
}

function errorResponse(message, data = null) {
  return {
    status: 'false',
    message: message,
    data: data,
  };
}

module.exports = {
  successResponse,
  errorResponse,
};
