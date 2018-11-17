const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// SCHEMAS
var UserSchema = new mongoose.Schema({
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
    },
    passwordConf: {
      type: String,
      required: true,
    },
    name: {
        type: String,
        required: true,
    },
    surrname: {
        type: String,
        required: true,
    }
});
UserSchema.plugin(uniqueValidator)

module.exports = mongoose.model('users', UserSchema)
