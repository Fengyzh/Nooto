const mongoose = require('mongoose')

const NoteSchema = mongoose.Schema({
    values: [{
        title: String,
        value: String,
        edit: Boolean
    }]
})

module.exports = mongoose.model('notes', NoteSchema)