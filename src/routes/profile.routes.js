const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Public endpoint for regex search on profile handle
router.get('/profiles/search/handle', profileController.searchHandleRegex);

// Protected routes below
router.use(authenticateToken);

router.post('/profiles', profileController.createProfile);
router.get('/profiles', profileController.listProfiles);
router.get('/profiles/:id', profileController.getProfile);
router.put('/profiles/:id', profileController.upsertProfile);
router.patch('/profiles/:id', profileController.upsertProfile);
router.delete('/profiles/:id', profileController.deleteProfile);

module.exports = router;
