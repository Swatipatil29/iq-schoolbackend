const mongoose=require('mongoose')

const {Schema,model}=mongoose

const teacherSchema= new Schema({
    title : String,
     firstName: String,
     lastName: String,
     gender  : {
        type: String,
        enum : ["Male","Female",]
    },
    email: String,

    classId : [{
       type: Schema.Types.ObjectId,
       ref : "Class"
   }],

   subjects : [{
      type : Schema.Types.ObjectId,
      ref : "Subject"
   }],

     mobile : Number,
     
     userId : {
        type: Schema.Types.ObjectId,
        ref: "User"
    } ,
    profilePic : String,
    
},{timestamps:true})

const Teacher = model('Teacher',teacherSchema)

module.exports = Teacher