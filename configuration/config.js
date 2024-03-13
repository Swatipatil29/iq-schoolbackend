const mongoose = require('mongoose')

const configureDb = async () =>  {
 const db = await mongoose.connect(process.env.MONGOOSE)

 try{
    console.log('Connected to db')
 }
 catch(e) {
    console.log("error while connecting to db")
 }
}

module.exports = configureDb