const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 10 },
})

userSchema.pre('save', async function (next) {

    if (this.isNew || this.isModified("password")) {
        const saltRounds = 12;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }

    next()
})

userSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema)

module.exports = User