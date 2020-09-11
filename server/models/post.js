const {Schema, model, Types} = require('mongoose')

const postSchema = new Schema({
    author: {type: Types.ObjectId, ref: 'User'},
    text: {type: String, required: true, maxlength: 500},
    created: {type: Date, default: Date.now},
})

module.exports = model('Post', postSchema)