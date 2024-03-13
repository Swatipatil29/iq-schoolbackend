const Subject=require('../models/subjectModel')
const Teacher = require('../models/teacherModel')
const {validationResult} = require('express-validator')
const Class = require("../models/ClassModel")
const _=require('lodash')

const subjectCtrl={}

subjectCtrl.addSubject=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const body = _.pick(req.body,['subject'])
    const subject = new Subject(body)
    try{
        subject.userId = req.user.id 
       await subject.save()
        res.json(subject)
    }catch(e){
        console.log(e)
        res.status(500).json(e)
    }

}

// subjectCtrl.updateSubject= async(req,res)=>{
//     const errors = validationResult(req)
//     if(!errors.isEmpty()){
//         return res.status(400).json({errors:errors.array()})
//     }
//     const id = req.params.id
//     const body = _.pick(req.body,['subject'])
//     try{
//         const subject = await Subject.findByIdAndUpdate({_id:id,userId:req.user.id},body,{new:true})
//         if(!subject){
//             return res.status(400).json({errors:'subject not found'})
//         }

//         await Class.updateMany(
//             { subjects: id },
//             { $pull: id }
//         );

//         await Class.updateMany(
//             { subjects: id },
//             { $push: id }
//         );
//         res.json(subject)
//     }
//     catch(e){
//         console.log(e)
//         res.status(500).json(e)
//     }
// }

subjectCtrl.updateSubject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const id = req.params.id;
    const body = _.pick(req.body, ['subject']);
    try {
        const subject = await Subject.findByIdAndUpdate({ _id: id, userId: req.user.id }, body, { new: true })
        if (!subject) {
            return res.status(400).json({ errors: 'subject not found' });
        }

      
        await Class.updateMany(
            { subjects: subject._id },
            { $pull: { subject: subject._id } }
        );

        await Class.updateMany(
            { subjects: subject._id },
            { $push: { subject:subject._id } }
        );

        res.json(subject);
    }
    catch (e) {
        console.log(e);
        res.status(500).json(e);
    }
};


subjectCtrl.listallSubjects=async(req,res)=>{
    try{
        const subject = await Subject.find()
        if(!subject){
            return res.status(400).json({errors:'subject not found'})
        }
    
            return res.status(201).json(subject)
    }catch(e){
        res.status(500).json(e)
        console.log(e)
    }
}

subjectCtrl.deleteSubject=async(req,res)=>{
    try{
        const result = await Subject.findByIdAndDelete(req.params.id)

        await Class.updateMany(
            { subjects: result._id },
            { $pull: { subjects: result._id } }
        );

        await Teacher.updateMany(
            {subjects : result._id},
            {$pull : {subjects : result._id}}
        )
        return res.status(201).json(result)
    }catch(e){
        console.log(e)
        res.status(500).json(e)
    }
}

subjectCtrl.oneSubject = async(req,res) => {
    try{
        const subject = await Subject.findById(req.params.id)
        if(!subject){
          return  res.status(401).json("Subject not found")
        }
        res.json(subject)
    } catch(e) {
        res.status(500).json(e)
    }
}


module.exports=subjectCtrl

