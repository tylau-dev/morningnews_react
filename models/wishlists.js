const mongoose = require('mongoose')

const wishlistsSchema = mongoose.Schema({
    title: String, description: String, content: String, image: String, language: String
})

const wishlistsModel = mongoose.model('wishlists', wishlistsSchema)

module.exports = wishlistsModel