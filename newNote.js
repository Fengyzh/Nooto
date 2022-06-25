const mongoose = require('mongoose')

const NoteSchema = mongoose.Schema({
    id: String,
    title: String,
    lastModified: String,
    createdDate: String,
    values: [{
        title: String,
        value: [{
            text: String,
        }],
    }]
})

module.exports = mongoose.model('note', NoteSchema)