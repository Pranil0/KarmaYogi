const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createOffer,
  
  getOffersForTask,
  getMyOffers,
  acceptOffer,
  getOfferById,

} = require('../controllers/OfferController');

// ✅ Create an offer
router.post('/', auth, createOffer);




router.get('/my-offers', auth, getMyOffers); 

// ✅ Get offers for a specific task
router.get('/task/:taskId', auth, getOffersForTask);

router.get('/:offerId', auth, getOfferById); 

// ✅ Accept an offer — THIS LINE WAS MISSING
router.put('/:offerId/accept', auth, acceptOffer);



module.exports = router;
