const mongoose = require('mongoose')
const Schema = mongoose.Schema

const menuSchema = new Schema({
    name: { type: String, required: true},
    image: {
        type: String,
        required: true,
        trim: true,
        data: Buffer,
        contentType: String
    },
    price: { type: Number, required: true},
    isVeg: { type: String, required: true}
})

module.exports = mongoose.model('Menu', menuSchema)
