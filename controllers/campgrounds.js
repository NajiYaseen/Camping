const Campground = require('../models/campground')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary')


module.exports.index = async(req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campground/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {

    res.render('campground/new')
}


module.exports.creatCampground = async(req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campgrounds = new Campground(req.body.campground)
    campgrounds.geometry = geoData.body.features[0].geometry;
    campgrounds.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
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
    const campgrounds = await Campground.findByIdAndUpdate(id, {...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campgrounds.images.push(...imgs);
    await campgrounds.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campgrounds.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campgrounds.id}`)
}




module.exports.deleteCampground = async(req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id)

    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}