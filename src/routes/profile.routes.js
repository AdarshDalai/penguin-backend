const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');

router.post('/profiles', profileController.createProfile);
router.get('/profiles/:id', profileController.getProfile);
router.put('/profiles/:id', profileController.upsertProfile);
router.patch('/profiles/:id', profileController.upsertProfile);
router.delete('/profiles/:id', profileController.deleteProfile);

module.exports = router;
