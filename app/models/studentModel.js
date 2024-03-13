const mongoose  = require("mongoose");

const { Schema, model} = mongoose

const StudentSchema = new Schema({
    userId : {
        type: Schema.Types.ObjectId,
        ref : "User"
    },

    firstname : String,

    lastname : String,

     gender  : {
        type: String,
        enum : ["Male", "Female"]
    },
 
     rollnumber: Number,

     parentsname : String,

     parentnumber : Number,

    classId  : {
         type: Schema.Types.ObjectId,
        ref: "Class"
    },
    email:String,

    //profilePic: String
    profilePic : String
}, {timeStamps:true})

const Student = model('Student', StudentSchema)

module.exports = Student