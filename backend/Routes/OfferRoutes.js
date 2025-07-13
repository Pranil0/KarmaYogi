const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createOffer,
  getOffersForTask,
  acceptOffer // ✅ Import the controller
} = require('../controllers/OfferController');

// ✅ Create an offer
router.post('/', auth, createOffer);

// ✅ Get offers for a specific task
router.get('/task/:taskId', auth, getOffersForTask);

// ✅ Accept an offer — THIS LINE WAS MISSING
router.put('/:offerId/accept', auth, acceptOffer);

module.exports = router;
