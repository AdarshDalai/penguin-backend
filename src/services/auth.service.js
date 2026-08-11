const { supabase, createScopedClient } = require('../core/config/supabase');

/**
 * Auth Service - ONLY contains raw Supabase database/API calls.
 * No decision logic or calling other services.
 */

async function signUpUser(payload) {
  return await supabase.auth.signUp(payload);
}

async function signInUserWithPassword(payload) {
  return await supabase.auth.signInWithPassword(payload);
}

async function signInUserWithOtp(payload) {
  return await supabase.auth.signInWithOtp(payload);
}

async function verifyUserOtp(payload) {
  return await supabase.auth.verifyOtp(payload);
}

async function signInUserWithOAuth(payload) {
  return await supabase.auth.signInWithOAuth(payload);
}

async function signOutUser(token, scope) {
  const userClient = createScopedClient(token);
  return await userClient.auth.signOut(scope ? { scope } : undefined);
}

async function getUserByToken(token) {
  return await supabase.auth.getUser(token);
}

async function updateUserByToken(token, attributes) {
  const userClient = createScopedClient(token);
  return await userClient.auth.updateUser(attributes);
}

async function resetUserPassword(email, options) {
  return await supabase.auth.resetPasswordForEmail(
    email,
    options ? { redirectTo: options.redirectTo } : undefined
  );
}

async function refreshUserSession(refreshToken) {
  return await supabase.auth.refreshSession({ refresh_token: refreshToken });
}

async function reauthenticateUser(token) {
  const userClient = createScopedClient(token);
  return await userClient.auth.reauthenticate();
}

async function adminListUsers(options) {
  return await supabase.auth.admin.listUsers(options);
}

async function adminGetUserById(id) {
  return await supabase.auth.admin.getUserById(id);
}

async function adminCreateUser(attributes) {
  return await supabase.auth.admin.createUser(attributes);
}

async function adminUpdateUserById(id, attributes) {
  return await supabase.auth.admin.updateUserById(id, attributes);
}

async function adminDeleteUserById(id) {
  return await supabase.auth.admin.deleteUser(id);
}

module.exports = {
  signUpUser,
  signInUserWithPassword,
  signInUserWithOtp,
  verifyUserOtp,
  signInUserWithOAuth,
  signOutUser,
  getUserByToken,
  updateUserByToken,
  resetUserPassword,
  refreshUserSession,
  reauthenticateUser,
  adminListUsers,
  adminGetUserById,
  adminCreateUser,
  adminUpdateUserById,
  adminDeleteUserById,
};
