const _ = require("lodash")
const Student = require("../models/studentModel")
const User = require("../models/userModel")
const Class = require("../models/ClassModel")
const { validationResult, body } = require("express-validator")
const Attendance = require("../models/attendenceModel")
 const studentCtrl = {}
 

studentCtrl.addStudent = async (req, res) => {
  const errors  = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
  } 
  // console.log(req.file,"profilepic")
  try{
  const body = _.pick(req.body,[
    "firstname", 
    "lastname", 
    "gender",
    "rollnumber",
    "parentsname", 
    "parentnumber",
     "userId",
     "email",
     "classId",
     "profilePic",
  ])

    const student = new Student(body)
    
    student.save()
    await Class.findOneAndUpdate(
      { _id: req.body.classId }, 
      { $push: { students: student._id } },
      { new: true }
    );
  }catch(e){
    console.log(e)
       res.status(500).json(e)
  }
}


// studentCtrl.delete = async (req, res) => {
//     try {
//         const result = await Student.findByIdAndDelete(req.params.id)
//         await User.findOneAndDelete({ _id: result.userId });
//         await Class.findOneAndUpdate(
//           { _id: req.body.classId }, 
//           { $pull: { students: result._id } },
//         );
//         res.status(201).json(result)
//     } catch(e) {
//         res.status(500).json(e);
//     }
// }

studentCtrl.delete = async (req, res) => {
  try {
    // Find and delete the student
    const result = await Student.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Remove the student from the class
    const classId = result.classId; // Assuming the classId is stored in the student document
    await Class.findOneAndUpdate(
      { _id: classId }, 
      { $pull: { students: result._id } }
    );

    // Delete associated user
    await User.findOneAndDelete({ _id: result.userId });

    res.status(201).json(result);
  } catch(e) {
    res.status(500).json(e);
  }
}

studentCtrl.updateProfile = async (req, res) => {
  const studentId =  req.user.student
  // console.log(req.file.filename,"studentId")
  try{
    const updateStudentProfile = await Student.findByIdAndUpdate(
      studentId, 
      { profilePic: req.file.filename }, 
      { new: true }
  )
    res.status(200).json(updateStudentProfile)

  } catch(e) {
    res.status(500).json(e)
  }
}


studentCtrl.listall = async(req, res) => {
  try{
    const students = await Student.find().populate("classId")
    if(!students){
      return res.status(200).json("no student found")
    }
     return res.json(students)
  } catch(e) {
    console.log(e)
    res.status(500).json(e)
  }
}

studentCtrl.updateStudent= async(req,res)=>{
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()})
  }
  const id = req.params.id
  const body = _.pick(req.body,[
    "firstname", 
    "lastname", 
    "gender",
    "rollnumber",
    "parentsname", 
    "parentnumber",
  ])
  try{
      const student = await Student.findByIdAndUpdate({_id:id,userId:req.user.id},body,{new:true})
      if(!student){
          return res.status(400).json({errors:'student not found'})
      }
      res.json(student)
  }
  catch(e){
      res.status(500).json(e)
  }
}

studentCtrl.listone = async (req, res) => {
  try{
    console.log(req.params.id, "listone")
  const student = await Student.findOne({userId : req.params.id}).populate("classId")
  if(!student){
    return res.status(401).json("student not found")
  }
  return res.json(student)
} catch(e) {
  res.json(e)
  console.log(e)
}
}

studentCtrl.listoneStudent = async (req, res) => {
  try{
    console.log(req.params.id, "listone")
  const student = await Student.findOne({_id : req.params.id})
  if(!student){
    return res.status(401).json("student not found")
  }
  return res.json(student)
} catch(e) {
  res.json(e)
  console.log(e)
}
}


module.exports = studentCtrl