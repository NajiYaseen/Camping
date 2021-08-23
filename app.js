if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
console.log(process.env.secret)

const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate')
const session = require('express-session');
const flash = require('connect-flash')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
    // const bsCustomFileInput = require('bs-custom-file-input')

// const bodyParser = require('body-parser');
const userRoutes = require('./routes/users')
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews')
const dbUrl = 'mongodb://localhost:27017/yelp-Camp'
const MongoDBStore = require("connect-mongo")(session);



mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => {
        console.log('Mongo open connection')
    })
    .catch((err) => {
        console.log('oh no Mongo connection error!')
        console.log(err)
    });


const app = express()


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const store = new MongoDBStore({
    url: dbUrl,
    secret: 'this should be a better secret!!',
    touchAfter: 24 * 60 * 60
})

store.on('error', function(e) {
    console.log('session store error', e)
})

const sessionConfig = {
    store,
    secret: 'this should be a better secret!!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expire: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next()
})
app.use('/', userRoutes)
app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id/reviews', reviewsRoutes)


app.get('/', (req, res) => {
    res.render('Home')
})


app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))

})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'somthing went wrong' } = err;
    if (!err.message) err.message = 'something went wrong !!'
    res.status(statusCode).render('error', { err })
})


app.listen(3000, () => {
    console.log('Serving On Port 3000')
})