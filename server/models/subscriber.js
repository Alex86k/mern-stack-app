const {Schema, model, Types} = require('mongoose')

const subscriberSchema = new Schema({
    userFrom: {type: Schema.Types.ObjectId, ref: 'User'},
    userTo: {type: Schema.Types.ObjectId, ref: 'User'},
    created: {type: Date, default: Date.now},
})

module.exports = model('Subscriber', subscriberSchema)