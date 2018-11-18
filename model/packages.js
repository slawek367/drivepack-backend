const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

var PackagesSchema = new mongoose.Schema({
    user_sender_id: {
        type: String,
        required: true
    },
    receiver_phone: {
        type: Number,
        required: true
    },
    from_x_pos: {
        type: Number,
        required: true
    },
    from_y_pos: {
        type: Number,
        required: true
    },
    to_x_pos: {
        type: Number,
        required: true
    },
    to_y_pos: {
        type: Number,
        required: true
    },
    date_from: {
        type: Date,
        default: Date.now,
        required: true
    },
    date_to: {
        type: Date,
        required: true
    },
    max_deliver_time_minutes: {
        type: Number,
        required: true
    },
    proposed_price: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    width: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        default: "WAITING",
        required: true
    },
    deliver_by_user_id: {
        type: String
    }
})

module.exports = mongoose.model('packages', PackagesSchema)
