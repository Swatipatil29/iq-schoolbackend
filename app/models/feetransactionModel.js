const mongoose = require('mongoose')

const {Schema,model}= mongoose

const feetransactionSchema= new Schema({

    amount:Number,
    status : {
        type : "String",
        default : "pending",
        enum : ["pending","success"]
    },

    modeOfPayment :{
     type: String,
    enum: ['online', 'offline'],
    },

    studentId :{
        type: Schema.Types.ObjectId,
         ref:"Student"
    },

    classId:{
      type: Schema.Types.ObjectId,
       ref:"Class"
   },
   paymentDate:Date,
   transactionId : String
//    feeReminderDateId :{
//      type: Schema.Types.ObjectId,
//        ref:"Class"
//    },
},{timestamps:true})

const Feetransaction = model('Feetransaction',feetransactionSchema)

module.exports = Feetransaction