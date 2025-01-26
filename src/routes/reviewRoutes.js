const express = require('express');
const {
  getAllReviews,
  addReview,
  getReviewDetails,
} = require('../controllers/reviewController');
const router = express.Router();

router.get('/allReview', getAllReviews);
router.get('/detailsReview/:id', getReviewDetails);
router.post('/:id', addReview);

module.exports = router;
