const {Schema, model, Types} = require('mongoose')

const userSchema = new Schema({
    name: {
        firstName: {type: String, required: true, minlength: 2, maxlength: 50},
        lastName: {type: String, required: true, minlength: 2, maxlength: 50},
    },
    login: {type: String, required: true},
    image: {type: String, required: true, default: 'https://res.cloudinary.com/dieq4abgy/image/upload/v1599405411/noimage_profile-cd1b8f2a6c7cfae1a2a917c90504b69797553efdce7dc55479fc7d00dd95f269_wd3zcm.jpg' },
    email: {type: String, required: true, unique: true},
    password: {type: String, minlength: 6, required: true},
    created: {type: Date, default: Date.now}
})

module.exports = model('User', userSchema)