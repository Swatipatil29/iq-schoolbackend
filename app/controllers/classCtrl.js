const _ = require("lodash");
const Class = require("../models/ClassModel")
const Teacher = require("../models/teacherModel")
const Subject = require("../models/studentModel")
const { validationResult } = require("express-validator");
const { subjects } = require("../validations/classValidation");


const classCtrl = {};


// classCtrl.addClass = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const body = _.pick(req.body, [
//         "name",
//         "teacherId",
//         "students",
//         "subjects",
//         "fee"
//     ]);

//     try {
//         const classes = new Class(body);

//         await classes.populate("students");
//         await classes.populate("subjects");

//         classes.subjects.forEach(async (subjectId) => {
//             await Subject.findByIdAndUpdate(subjectId, { $push: { classes: classes._id } });
//         });

        

//         // await Teacher.findByIdAndUpdate(body.teacherId, { $push: { classes: classes._id } });

//         await classes.save();
//         console.log(classes )
//         res.json(classes);
//     } catch (e) {
//         console.log(e);
//         res.status(500).json(e);
//     } 
// };

classCtrl.addClass = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const body = _.pick(req.body, [
        "name",
        "teacherId",
        "students",
        "subjects",
        "fee"
    ]);

    try {
        const classes = new Class(body);

        await classes.populate("students")
        await classes.populate({
            path : "subjects",
            select : "subject"
        })
        
        await classes.populate({
            path: "teacherId", 
            select: "firstName" 
        })

        await classes.save();
        // console.log("Saved class:", classes);
        res.json(classes);
    } catch (e) {
        console.log(e);
        res.status(500).json(e);
    } 
};


  classCtrl.updateClass= async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const id = req.params.id
    const body = _.pick(req.body,[
        "name",
        "teacherId" ,
        "students",
        "subjects",
        "fee"
    ])
    try{
        const classes = await Class.findByIdAndUpdate({_id:id,userId:req.user.id},
            body,
            {new:true})
        if(!classes){
            return res.status(400).json({errors:'class not found'})
        }
        await Teacher.findOneAndUpdate(
            { classes: classes._id },
            { $pull: { classes: classes._id } }
        );

        await Teacher.findByIdAndUpdate(
            body.teacherId,
            { $push: { classes: classes._id } }
        );

    
        await classes.populate("students")
        await classes.populate("subjects")
        res.json(classes)
    }
    catch(e){
        console.log(e)
        res.status(500).json(e)
    }
}

classCtrl.deleteClass = async (req, res) => {
    
    try {
        const deletedClass = await Class.findByIdAndDelete(req.params.id);

    
        await Teacher.updateMany(
            { classes: deletedClass._id },
            { $pull: { classes: deletedClass._id } }
        );

        return res.status(201).json(deletedClass);
    } catch (e) {
        res.status(500).json(e);
    }
};

// classCtrl.listallClasses = async (req,res)=>{
//     try{
//         console.log(Class, "class")
//         const classes = await Class.find()
//            .populate("students")  
//             .populate("subjects")
      
//         if(!classes){
//             return res.status(404).json({errors:'class not found'})
//         }
//              res.status(200).json(classes)
//     }catch(e){
//         res.status(500).json(e)
//         console.log(e)
//     }
// }

classCtrl.listallClasses  = async (req, res) => {
    try{ 
                const classes = await Class.find()
                   .populate("students")  
                    .populate("subjects")
              
                if(!classes){
                    return res.status(404).json({errors:'class not found'})
                }
                
                     res.status(200).json(classes)
            }catch(e){
                res.status(500).json(e)
                console.log(e)
            }
}

classCtrl.oneClass = async(req,res) => {
    try{
        const classes = await Class.findById(req.params.id)
        .populate({
            path: "students",
            select: "firstname rollnumber"
        }).populate({
            path: "subjects",
            select: "subject"
        })
        if(!classes){
          return  res.status(401).json("class not found")
        }
        res.json(classes)
    } catch(e) {
        console.log(e)
        res.status(500).json(e)
    }
}

module.exports = classCtrl;
