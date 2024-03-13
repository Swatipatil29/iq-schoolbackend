
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const attendenceSchema = new Schema({
    classId: {
        type: Schema.Types.ObjectId,
        ref: "Class"
    },

    sectionname:{
        type: String
    },
    
    teacherId: {
        type: Schema.Types.ObjectId,
        ref: "Teacher"
    },
    students: [{
        studentId: {
            type: Schema.Types.ObjectId,
            ref: 'Student'
        },
        status:{
            type : String,
            enum:["Present", "Absent"],
            default :"Present"
        }
    }],
    attendanceDate: Date
}, { timestamps: true })

const Attendence = model('Attendence', attendenceSchema);

module.exports = Attendence;