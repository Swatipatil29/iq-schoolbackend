const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const SubjectSchema = new Schema({
    subject: String,
    
}, { timestamps: true });


const Subject = model('Subject', SubjectSchema);

module.exports = Subject;
