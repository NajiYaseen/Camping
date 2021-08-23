const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
const multer = require('multer')

const { storage } = require('../cloudinary')
const upload = multer({ storage })
const Campground = require('../models/campground');


router.route('/')
    .get(catchAsync(campgrounds.index))


router.route('/new')
    .get(isLoggedIn, campgrounds.renderNewForm)
    .post(isLoggedIn, upload.array('image'), catchAsync(campgrounds.creatCampground))



router.route('/:id')
    .get(catchAsync(campgrounds.showPage))
    .put(isLoggedIn, isAuthor, upload.array('image'), catchAsync(campgrounds.editCampground))
    .delete(isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditPage))

module.exports = router