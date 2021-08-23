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
    for (let i = 0; i < 300; i++) {
        const rand = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: '60df335cab2c673640556dcd',
            location: `${cities[rand].city},${cities[rand].state}`,
            title: `${sample(descriptors)},${sample(places)}`,
            discription: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rem libero nostrum vel impedit asperiores. Possimus tenetur tempore consequatur nulla voluptas, ad illo quam aut recusandae placeat nemo accusamus consequuntur id.',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[rand].longitude,
                    cities[rand].latitude,
                ]
            },
            images: [{

                    url: 'https://res.cloudinary.com/dqotvy4dt/image/upload/v1627752179/YelpCamp/jj6fipi3cj7kicdlf575.jpg',
                    filename: 'YelpCamp/jj6fipi3cj7kicdlf575'
                },
                {
                    url: 'https://res.cloudinary.com/dqotvy4dt/image/upload/v1627752179/YelpCamp/in3rohsz3ma7ydge1f7d.jpg',
                    filename: 'YelpCamp/in3rohsz3ma7ydge1f7d'
                }

            ]
        })

        camp.save()
    }
}
seedDb()