const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, validateCampground, isAuthor, validateReview } = require('../middleware')
const reviewController = require('../controllers/review')

router.post('/', isLoggedIn, validateReview, catchAsync(reviewController.postReview))

router.delete('/:reviewId', catchAsync(reviewController.deleteReview))

module.exports = router