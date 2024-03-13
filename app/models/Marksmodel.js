const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const marksSchema = new Schema({
    title: String,
    sectionname: String,
    class: {
        type: Schema.Types.ObjectId,
        ref: 'Class',
    },
    results: [{
        studentId: {
            type: Schema.Types.ObjectId,
            ref: 'Student',
        },
        subjects: [{
            subjectId: {
                type: Schema.Types.ObjectId,
                ref: 'Subject'
            },
             marks: Number 
           // marks: String 
        }]
    }],
});

const Mark = model('Mark', marksSchema);

module.exports = Mark;


