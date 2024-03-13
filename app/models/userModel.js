const mongoose = require('mongoose')

const { Schema, model} = mongoose

const UserSchema = new Schema({
    email : String,
    password : String,
   profilepic:String,
    role : {
        type: String,
        enum : ["Principle", "Teacher", "Student"]
    }, 
    profilePic : String
}, {timeStamps:true})

const User = model("User", UserSchema)

module.exports = User

// profilepic:String,