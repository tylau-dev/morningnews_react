const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    wishlist: [{type:mongoose.Schema.Types.ObjectId, ref:'wishlists'}],
    username: String,
    email: String,
    password: String,
    token: String,
    language: String,
})

const userModel = mongoose.model('users', userSchema)

module.exports = userModel