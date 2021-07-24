const mongoose = require('mongoose')

const Schema = mongoose.Schema

const rivewSchema = new Schema({
    body: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    rating: Number
})

module.exports = mongoose.model('Review', rivewSchema)