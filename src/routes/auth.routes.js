const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// System
router.get('/health', authController.health);

// Standard Supabase Auth Endpoints
router.post('/auth/signup', authController.signUp);
router.post('/auth/signin', authController.signInWithPassword);
router.post('/auth/signin-otp', authController.signInWithOtp);
router.post('/auth/verify-otp', authController.verifyOtp);
router.post('/auth/signin-oauth', authController.signInWithOAuth);
router.post('/auth/logout', authController.signOut);
router.get('/auth/user', authController.getUser);
router.put('/auth/user', authController.updateUser);
router.patch('/auth/user', authController.updateUser);
router.post('/auth/reset-password', authController.resetPasswordForEmail);
router.post('/auth/refresh', authController.refreshSession);
router.post('/auth/reauthenticate', authController.reauthenticate);

// Admin Supabase Auth Endpoints
router.get('/auth/admin/users', authController.adminListUsers);
router.get('/auth/admin/users/:id', authController.adminGetUser);
router.post('/auth/admin/users', authController.adminCreateUser);
router.put('/auth/admin/users/:id', authController.adminUpdateUser);
router.delete('/auth/admin/users/:id', authController.adminDeleteUser);

module.exports = router;
