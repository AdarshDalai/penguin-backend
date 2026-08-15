const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware');

// System
router.get('/health', authController.health);

// Standard Supabase Auth Endpoints
router.post('/auth/signup', authController.signUp);
router.post('/auth/signin', authController.signInWithPassword);
router.post('/auth/signin-otp', authController.signInWithOtp);
router.post('/auth/verify-otp', authController.verifyOtp);
router.post('/auth/signin-oauth', authController.signInWithOAuth);
router.post('/auth/reset-password', authController.resetPasswordForEmail);
router.post('/auth/refresh', authController.refreshSession);

// Protected User Auth Endpoints (Requires valid Bearer token)
router.post('/auth/logout', authenticateToken, authController.signOut);
router.get('/auth/user', authenticateToken, authController.getUser);
router.put('/auth/user', authenticateToken, authController.updateUser);
router.patch('/auth/user', authenticateToken, authController.updateUser);
router.post('/auth/reauthenticate', authenticateToken, authController.reauthenticate);

// Protected Admin Supabase Auth Endpoints (Requires valid Bearer token + Admin privileges)
router.get('/auth/admin/users', authenticateToken, requireAdmin, authController.adminListUsers);
router.get('/auth/admin/users/:id', authenticateToken, requireAdmin, authController.adminGetUser);
router.post('/auth/admin/users', authenticateToken, requireAdmin, authController.adminCreateUser);
router.put('/auth/admin/users/:id', authenticateToken, requireAdmin, authController.adminUpdateUser);
router.delete('/auth/admin/users/:id', authenticateToken, requireAdmin, authController.adminDeleteUser);

module.exports = router;
