const Teacher = require("../models/teacherModel")
const { validationResult } = require('express-validator');
const _=require('lodash');
const User = require("../models/userModel");
const Class = require("../models/ClassModel")


const teacherCtrl={}

// teacherCtrl.createTeacher=async(req,res)=>{
//     const errors=validationResult(req)
//     if(!errors.isEmpty()){
//       return res.status(400).json({errors:errors.array()})
//     }
//     const body = _.pick(req.body,['firstName','lastName','profilePic','gender','title','mobile', "classId", "subjects", "userId", "email"])
//     const teacher = new Teacher(body)
//    // console.log(req.body)
//     try{
//         // teacher.userId=req.user.userId
//         await teacher.save()
//           const teacherId = teacher.teacherId
//         await Class.findByIdAndUpdate( 
//             { _id: teacherId }, 
//             { $push: { students: result._id } })
//         res.status(201).json(teacher)
//     }
//     catch(e){
//         console.log(e)
//         res.status(404).json(e)
        
//     }
// }/

teacherCtrl.createTeacher = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const body = _.pick(req.body, ['firstName', 'lastName', 'profilePic', 'gender', 'title', 'mobile', "classId", "subjects", "userId", "email"]);
    const teacher = new Teacher(body);
    try {
        await teacher.save();
        const teacherId = teacher._id;
        await Class.findByIdAndUpdate(
            body.classId,
            { $push: { teacherId: teacherId } }
        );
        res.status(201).json(teacher);
    } catch (e) {
        console.log(e);
        res.status(404).json(e);
    }
};

teacherCtrl.updateProfile = async(req, res) => {
    const teacherId =  req.user.teacher
  console.log(req.file.filename,"teacherId")
  try{
    const updateTeacherProfile = await Teacher.findByIdAndUpdate(
      teacherId, 
      { profilePic: req.file.filename }, 
      { new: true }
  )
    res.status(200).json(updateTeacherProfile)

  } catch(e) {
    res.status(500).json(e)
  }
}


teacherCtrl.updateTeacher= async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const id = req.params.id
    const body = _.pick(req.body,['firstName','lastName','profilePic','gender','title','mobile'])
    try{
        const teacher = await Teacher.findByIdAndUpdate({_id:id,userId:req.user.id},body,{new:true})
        if(!teacher){
            return res.status(404).json({errors:'teacher not found'})

        }
        res.json(teacher)
    }
    catch(e){
        res.status(500).json(e)
    }
}


// teacherCtrl.listallTeachers = async(req, res) => {
//     try{
//         const search = req.query.search  || ''
//         const sortBy = req.query.sortBy  || "firstName"
//         const order =  req.query.order  || 1
//         let page   = req.query.page  || 1
//         let limit = req.query.limit  || 3
//         const searchQuery ={firstName:{$regex :search , $options : 'i' }}
//         const sortQuery ={}
//         sortQuery[sortBy]=order === 'asc' ?1 :-1
//          page = parseInt(page)
//         limit = parseInt(limit)
//       const teacher = await Teacher.find(searchQuery)
//                                     .sort(sortQuery)
//                                     .skip((page-1)*limit)
//                                     .limit(limit)
//         const total = await Teacher.countDocuments(searchQuery)

//       if(!teacher){
//         return res.status(200).json("no teacher found")
//       }
//       // return res.json(teacher)
//       res.json({
//         teacher,
//         total,
//         page,
//         totalpages:Math.ceil(total/limit)
//       })
//     } catch(e) {
//       console.log(e)
//       res.status(500).json(e)
//   }
//   }

teacherCtrl.listallTeachers = async(req, res) => {
    try{
        
      const teacher = await Teacher.find().populate({
        path: 'classId',
        select: 'name'
    })
                                   

      if(!teacher){
        return res.status(200).json("no teacher found")
      }
       return res.json(teacher)
     
    } catch(e) {
      console.log(e)
      res.status(500).json(e)
  }
  }


  teacherCtrl.deleteTeacher = async (req, res) => {
    const id = req.params.id;

    try {
        
        const teacher = await Teacher.findByIdAndDelete(id);
     
      await Class.updateMany({ teacherId: teacher.id }, { $unset: { teacherId: 1 } });
        res.status(201).json( teacher);
   
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

teacherCtrl.oneTeacher = async (req, res) => {
    try{
        const teacher = await Teacher.findById(req.params.id).populate('subjects') // Populate the 'subjects' field
        .populate('classId'); 
        if(!teacher){
           return res.status(400).json("teacher not found")
        }
        res.status(201).json(teacher)
    } catch(e) {
        res.status(500).json(e)
    }
}


module.exports=teacherCtrl