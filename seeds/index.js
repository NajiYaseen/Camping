const mongoose = require('mongoose');

const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-Camp', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log('Mongo open connection')
    })
    .catch((err) => {
        console.log('oh no Mongo connection error!')
        console.log(err)
    })

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async() => {
    await Campground.deleteMany({});
    for (i = 0; i < 50; i++) {
        const rand = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: '60df335cab2c673640556dcd',
            location: `${cities[rand].city},${cities[rand].state}`,
            title: `${sample(descriptors)},${sample(places)}`,
            image: 'https://media.cntraveler.com/photos/607313c3d1058698d13c31b5/16:9/w_2560%2Cc_limit/FamilyCamping-2021-GettyImages-948512452-2.jpg',
            discription: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rem libero nostrum vel impedit asperiores. Possimus tenetur tempore consequatur nulla voluptas, ad illo quam aut recusandae placeat nemo accusamus consequuntur id.',
            price
        })

        camp.save()
    }
}
seedDb()