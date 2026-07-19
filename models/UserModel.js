const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    id: { typre: String, required: true },
    username: { typre: String, required: true },
    password: { type: String, required: true, minLength: 10 }
})

const User = mongoose.model('User', userSchema)

module.exports(User)