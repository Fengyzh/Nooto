const mongoose = require('mongoose')

const NoteSchema = mongoose.Schema({
    id: String,
    title: String,
    values: [{
        title: String,
        value: [{
            text: String,
            editable: Boolean,
        }],
    }]
})

module.exports = mongoose.model('note', NoteSchema)