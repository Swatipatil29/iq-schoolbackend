const { validationResult } = require('express-validator')
const _ = require("lodash")
const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
const bcryptjs = require("bcryptjs")
const Teacher = require('../models/teacherModel')
const Student = require("../models/studentModel")
const nodemailer = require('nodemailer')
const Class = require('../models/ClassModel')



const userCtrl = {}

userCtrl.register = async (req, res) => {
 const errors = validationResult(req)
 if(!errors.isEmpty()){
   return res.status(400).json({errors: errors.array()})
 }
  const body = _.pick(req.body,["email", "password", "role"])
 // console.log(body)
  try{
      
        const user =  new User(body)
        const salt = await bcryptjs.genSalt()
        const encryptedPassword =  await bcryptjs.hash(user.password, salt)
        user.password = encryptedPassword 

       const userCount = await User.countDocuments()
      //  console.log(userCount)
       if(userCount === 0 ){
         user.role = "Principle"
       } else
        if(userCount > 0 && user.role === "Principle"){
        user.role === "Student"
       }
       await user.save()
     return res.json(user)
  }
  catch(e) {
    console.log(e)
    res.status(500).json(e)
  }
}

userCtrl.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const body = _.pick(req.body, ["email", "password"]);
  try {
    const user = await User.findOne({ email: body.email });
    if (!user) {
      return res.status(404).json({ errors: 'Invalid email or password' });
    }

    const result = await bcryptjs.compare(body.password, user.password);
    if (!result) {
      return res.status(404).json({ errors: 'Invalid email or password' });
    }

    const teacher = await Teacher.findOne({ userId: user._id });
       await Class.findOne({})
    const student = await Student.findOne({ userId: user._id });

    if (teacher) {
      const tokenData = {
        id: user._id,
        role: user.role,
        teacher: teacher._id,
      };

      // console.log(tokenData);
      const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '14d' });
      res.json({ token: token });
    } else if(student){
      const tokenData = {
        id: user._id,
        role: user.role,
        student: student._id,
      };
      // console.log(tokenData);
      const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '14d' });
      res.json({ token: token });
    } else {
      const tokenData = {
        id: user._id,
        role: user.role,
      };

      // console.log(tokenData);
      const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '14d' });
      res.json({ token: token });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};


userCtrl.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ errors: errors.array() });
  }
  const userId = req.params.userId;
  try {
    const body = _.pick(req.body, ["email", "oldpassword", "newpassword",'profilepic']);
    
    const newUser = await User.findByIdAndUpdate(userId);

    if (!newUser) {
      return res.status(401).json({ errors: 'User not found' });
    }

    const isCorrectPassword = await bcryptjs.compare(body.oldpassword, newUser.password);

    if (!isCorrectPassword) {
      return res.status(401).json({ errors: 'Incorrect password' });
    }

    newUser.email = body.email;

    if (body.newpassword) {
      const salt = await bcryptjs.genSalt();
      const encryptedPassword = await bcryptjs.hash(body.newpassword, salt);
      newUser.password = encryptedPassword;
    }

    await newUser.save();

    res.json(newUser);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};


userCtrl.deleteUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ errors: "User not found" });
    }

    if (user.role !== "Principle") {
      const deletedTeacher = await Teacher.findOneAndDelete({ userId: userId });
       const deletedStudent = await Student.findOneAndDelete({ userId: userId });


      const deletedUser = await User.findByIdAndDelete(userId);

      return res.status(201).json({ deletedUser, deletedTeacher, deletedStudent });
    } else {
      return res.status(403).json("You cannot delete a Principle");
    }
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
}

userCtrl.getUser = async(req, res) => {
  try{
  const user = await User.find()
  if(!user) {
    return res.status(400).json("user not found")
  } 
      // console.log(user)
      res.status(201).json(user)
} catch(e) {
   console.log(e)
}
}


userCtrl.forgotPassword = async (req,res) =>{
  const {email} = req.query 
  // console.log(email)

  try{
  const user = await User.findOne({email : email})
  // console.log(user)
  if(user){
      let mailTransporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: 'gangadhar7683@gmail.com',
              pass: 'dnhw zbeo iwmc tjdh'
          }
      });

      const number = Math.floor(Math.random() * 90000) + 10000
      const tokendata = {number : number , email : email}
      const token = jwt.sign(tokendata,process.env.JWT_SECRET,{expiresIn : "10min"})
      res.status(200).json({token : token})
      // console.log(tokendata)
      
      let mailDetails = {
          from: 'gangadhar7683@gmail.com',
          to: `${user.email}`,
          subject: 'iq-skool(reset - password-link)',
          html : `<a href=http://localhost:3000/forgot-password?token=${token}>Click here to reset your password</a>
          <p>OTP for changing password - <b>${number}</b></p>
          <p>This link will be valid for only 10 minutes</p>`,
      };
      
      mailTransporter.sendMail(mailDetails, function(err, data) {
          if(err) {
              console.log('Error Occurs');
          } else {
              console.log('Email sent successfully');
          }
      })
  }else{
      res.status(404).json("email not found")
  }
}catch(e){
  res.status(500).json(e)
  console.log(e)
}
}


userCtrl.resetPassword = async (req,res) =>{
  const {password ,email,token,otp} = req.body
  try{
      const tokendata = await jwt.verify(token,process.env.JWT_SECRET)
  
      if(tokendata.number !== Number(otp)){
          return res.status(400).json("invalid otp")
      }
      const salt = await bcryptjs.genSalt()
      const newPassword = await bcryptjs.hash(password,salt)
      await User.findOneAndUpdate({email : email},{password : newPassword})
      res.status(200).json("password reset successfull")

  }catch(e){
      res.status(500).json(e)
  }
}

userCtrl.updateProfile = async (req, res) => {
  const id =  req.user.id
  // console.log(req.file.filename,"studentId")
  try{
    const updateStudentProfile = await User.findByIdAndUpdate(
      id, 
      { profilePic: req.file.filename }, 
      { new: true }
  )
    res.status(200).json(updateStudentProfile)

  } catch(e) {
    res.status(500).json(e)
  }
}
module.exports = userCtrl