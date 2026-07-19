const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    id: { typre: String, required: true },
    username: { typre: String, required: true },
    password: { type: String, required: true, minLength: 10 },

})

userSchema.pre('save', async (next) => {

    if (this.isNew || this.isModified("password")) {
        const saltRounds = 12;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports(User)