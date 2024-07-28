const mongoose = require('mongoose');

//  schema  - field
const TeacherSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },

    email: {
        type: String,
        require: true
    },

})
const TeacherModel = mongoose.model('teacher', TeacherSchema)
module.exports = TeacherModel