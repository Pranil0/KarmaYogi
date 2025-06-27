const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createOffer } = require('../controllers/offerController');

router.post('/', auth, createOffer);

module.exports = router;
