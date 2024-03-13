const mongoose = require('mongoose')

const {Schema, model} = mongoose

const classSchema = new Schema({
    name : String,

    teacherId : [{
        type: Schema.Types.ObjectId,
        ref: "Teacher",
    }],

    students : [{
        type: Schema.Types.ObjectId,
        ref: "Student"
    }],

    subjects : [{
        type: Schema.Types.ObjectId,
        ref: "Subject"
    }] ,

     fee : Number,
     
})

const Class = model("Class", classSchema)

module.exports = Class