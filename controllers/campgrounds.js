const Campground = require('../models/campground')

module.exports.index = async(req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campground/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {

    res.render('campground/new')
}

module.exports.creatCampground = async(req, res) => {
    const campgrounds = new Campground(req.body.campground)
    campgrounds.author = req.user.id
    await campgrounds.save()
    req.flash('success', 'successfully made a new Campground')

    res.redirect(`/campgrounds/${campgrounds.id}`)
}

module.exports.showPage = async(req, res) => {
    const campgrounds = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    if (!campgrounds) {
        req.flash('error', 'Cannot find that page')
        return res.redirect('/campgrounds')
    }

    res.render('campground/show', { campgrounds })
}

module.exports.renderEditPage = async(req, res, next) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id)

    if (!campgrounds) {
        req.flash('error', 'cant find that campground')
        return res.redirect('/campgrounds')
    }
    res.render('campground/edit', { campgrounds })
}

module.exports.editCampground = async(req, res, next) => {

    const { id } = req.params;
    const campgrounds = await Campground.findById(id)

    const camp = await Campground.findByIdAndUpdate(id, {...req.body })
    res.redirect(`/campgrounds/${campgrounds.id}`)
}

module.exports.deleteCampground = async(req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id)

    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}