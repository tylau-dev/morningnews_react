const mongoose = require('mongoose')

const wishlistsSchema = mongoose.Schema({
    articles : [ { title: String, description: String, content: String, image: String}]
})

const wishlistsModel = mongoose.model('wishlists', wishlistsSchema)

module.exports = wishlistsModel