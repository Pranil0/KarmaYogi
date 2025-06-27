const Offer = require('../models/OfferModel');

exports.createOffer = async (req, res) => {
  try {
    const offer = new Offer({ ...req.body, taskerId: req.user.id });
    await offer.save();
    res.status(201).json(offer);
  } catch (err) {
    res.status(500).json({ message: 'Error creating offer' });
  }
};