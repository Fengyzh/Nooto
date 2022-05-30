const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    Email: String,
    UID: String,
    Password:String,
    Nooto: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "note"

    }]
})

module.exports = mongoose.model('User', UserSchema)