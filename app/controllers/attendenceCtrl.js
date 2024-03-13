const Attendence = require('../models/attendenceModel')
const {validationResult} = require('express-validator')
const eventCalender = require("../models/eventCalendarModel")
const _=require('lodash')
const Class = require('../models/ClassModel')

const daysInMonth = (year, month) => new Date(year, month, 0).getDate()

const attendenceCtrl={}


attendenceCtrl.addAttendence = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const body = _.pick(req.body, ['students', 'sectionname', 'attendanceDate', 'teacherId', 'classId']);
        const teacherId = req.body.teacherId; 
        const isTeacherAssociated = await Class.findOne({ _id: body.classId, teacherId: teacherId });
        if (!isTeacherAssociated) {
            return res.status(403).json({ error: "You are not authorized to take attendance for this class" });
        }

     
        
        const attendance = new Attendence({
            students: body.students.map(student => ({ studentId: student.studentId, status: student.status })),
            sectionname: body.sectionname,
            attendanceDate: body.attendanceDate,
            teacherId: body.teacherId,
            classId: body.classId,
        });
        attendance.userId = req.user.id;
        await attendance.save();
        res.status(201).json(attendance);
    } catch (e) {
       
        res.status(500).json({ error: 'Internal Server Error' });
    }
}; //valid



attendenceCtrl.getOneClassAttendance = async (req, res) => {
    const { classId } = req.params;
    const { attendanceDate } = req.query; // Get attendanceDate from query parameters

    try {
        let query = { classId }; // Initialize the query with classId

        if (attendanceDate) {
            query.attendanceDate = attendanceDate; // Add attendanceDate to the query if provided
        }

        const attendance = await Attendence.find(query).populate({
            path: 'students.studentId',
            select: 'firstname rollnumber attendanceDate'
        });

        res.json(attendance);
    } catch (error) {
       
        res.status(500).json({ error: "Internal Server Error" });
    }
}; //valid



attendenceCtrl.getClassAttendance = async (req, res) => {
    const classId = req.params.classId;
    
    try {
        const attendance = await Attendence.find({classId}).populate({
            path: 'students.studentId',
            model: 'Student'
        });
        res.json(attendance);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "internal server error" });
    }
};//valid

attendenceCtrl.deleteAttendence = async (req, res) => {
    const classId = req.params.classId; // Assuming you have classId available
    const studentId = req.params.studentId.trim();
    try {
        const result = await Attendence.findOneAndDelete({ classId: classId, 'students.studentId': studentId });
        console.log(studentId);
        res.status(200).json(result); // Changed status to 200 for success
    } catch (e) {
        console.log(e);
        res.status(500).json(e);
    }
}; //valid


attendenceCtrl.updateAttendence = async (req, res) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id;
     const body = _.pick(req.body, ['students', 'classId', 'attendenceDate']);


    // if (!body.students || !Array.isArray(body.students)) {
    //     return res.status(400).json({ error: 'Students data is missing or invalid' });
    // }

    const attendenceData = {
        ...body,
        students: body.students?.map(student => ({
            studentId: student.studentId,
            status: student.status || 'Present', 
        })),
    };

    try {
        const attendence = await Attendence.findByIdAndUpdate(
             { _id: id, userId: req.user.id },
            attendenceData,
            { new: true }
        ).populate("students");

        if (!attendence) {
            return res.status(404).json({ errors: 'Attendance not found' });
        }

        res.json(attendence);
    } catch (e) {
        console.error(e.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}; //valid

attendenceCtrl.calculateOneMonthAttendanceOfOneStdent = async (req, res) => {
    const studentId = req.params.studentId;

    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({ error: 'Month and year parameters are required.' });
        }

        

        const totaldays = daysInMonth(year,month+1, 0);
            let sum = 0;
       const attendances = await Attendence.find({ 'students.studentId': studentId });
    //    console.log(attendances)

   attendances.forEach(attendance => {
    const attendanceMonth = new Date(attendance.attendanceDate).getMonth() + 1;
    const attendanceYear = new Date(attendance.attendanceDate).getFullYear();


        attendance.students.forEach(student => {
            if (student.studentId == studentId) { // Convert both to string for comparison
                if (student.status.toLowerCase() === "absent") {
                    sum += 1;
                }
            }
        });
    
});

const presentDays = totaldays - sum;
const absentDays = sum;
const percentage = (presentDays / totaldays) * 100;

return res.json({ studentId, presentDays, absentDays, totaldays, percentage });

    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}; //valid


// attendenceCtrl.getAllAttendences=async(req,res)=>{
//     try{
//         const attendence = await Attendence.find()
//         if(!attendence){
//             return res.status(201).json({errors:'details not found'})
//          }
//          res.status(400).json(attendence)
//     }catch(e){
//         res.status(500).json(e)
//     }
// }


// attendenceCtrl.deleteAttendence=async(req,res)=>{
//     const studentId = req.params.studentId.trim();
//     try{
//         const result = await Attendence.findByIdAndDelete(studentId)
//         console.log(studentId)
//         res.status(201).json(result)
//     }catch(e){
//         res.status(500).json(e)
//     }
// }





// attendenceCtrl.deleteStudentAttendence = async (req, res) => {
//     const attendanceId = req.params.attendanceId; // Corrected parameter name
//     const studentId = req.params.studentId;
//     try {
//         const result = await Attendence.findOneAndUpdate(
//              attendanceId ,
//             { $pull: { students: { studentId: studentId } } },
//             { new: true } 
//         );

//         if (result) {
//             return res.status(200).json(result);
//         } else {
//             return res.status(404).json({ message: "Attendance record not found." });
//         }
//     } catch (e) {
//         console.log(e);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };


// attendenceCtrl.oneStudentAttendance = async (req, res) => {
//     const studentId = req.params.studentId
//     try{
//         const student = await Attendence.find({ 'students.studentId': studentId });
//         if(!student){
//            return res.status(401).json(student)
//         }
//          res.status(201).json(student)
//     } catch(e){
//         console.log(e)
//         res.status(500).json(e)
//     }
// }

// attendenceCtrl.attendace = async(req, res) => {
//     const studentId = req.params.studentId
//     try{
//     const student = await Attendence.find({ 'students.studentId': studentId });
//     } catch(e) {
//         res.status(500).json(e)
//     }
// }

// attendenceCtrl.calculateAttendance = async (req, res) => {
//     const studentId = req.params.studentId;
//     try {
//         let totaldays = daysInMonth(2020, 1);
//         let sum = 0;
//         const attendances = await Attendence.find({ 'students.studentId': studentId });

//         attendances.forEach(attendance => {
//             attendance.students.forEach(student => {
//                 if (student.status === "Present") {
//                     sum = sum + 1;
//                 }
//             });
//         });

//         const presentDays = totaldays - sum;
//         return res.json(presentDays);
//     } catch (e) {
//         console.log(e);
//         res.status(500).json(e);
//     }
// };



// attendenceCtrl.calculateOneMonthAttendanceOfOneStudent = async (req, res) => {
//     const studentId = req.params.studentId;

//     try {
//         const { month, year } = req.query;

//         if (!month || !year) {
//             return res.status(400).json({ error: 'Month and year parameters are required.' });
//         }

//         const today = new Date();
//         const totalDays = new Date(year, month, 0).getDate(); // Get the total number of days in the month
//         const presentDate = today.getDate();
//         let sum = 0;

//         const attendances = await Attendence.find({ 'students.studentId': studentId });

//         attendances.forEach(attendance => {
//             const attendanceDate = new Date(attendance.attendanceDate);
//             const attendanceMonth = attendanceDate.getMonth() + 1;
//             const attendanceYear = attendanceDate.getFullYear();
//             const attendanceDay = attendanceDate.getDate();

//             if (
//                 attendanceMonth === parseInt(month) &&
//                 attendanceYear === parseInt(year) &&
//                 attendanceDay <= presentDate // Check if attendance is within the current month up to present date
//             ) {
//                 attendance.students.forEach(student => {
//                     if (student.studentId.toString() === studentId && student.status.toLowerCase() === "absent") {
//                         sum++;
//                     }
//                 });
//             }
//         });

//         const presentDays = totalDays - sum;
//         const absentDays = sum;
//         const percentage = (presentDays / totalDays) * 100;

//         return res.json({ studentId, presentDays, absentDays, totalDays, percentage });
//     } catch (e) {
//         console.log(e);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };


// attendenceCtrl.calculateOneMonthAttendanceForOneClass = async (req, res) => {
//     try {
//         const { month, year, classId } = req.query;

//         if (!month || !year || !classId) {
//             return res.status(400).json({ error: 'Month, year, and classId parameters are required.' });
//         }

//         const totaldays = daysInMonth(parseInt(year), parseInt(month));
//         let presentDays = 0;

//         const attendances = await Attendence.find({ "classId": classId });

//         // Map to store student-wise attendance details
//         const studentDetailsMap = new Map();

//         attendances.forEach(attendance => {
//             attendance.students.forEach(student => {
//                 const attendanceMonth = attendance.attendanceDate.getMonth() + 1;
//                 const attendanceYear = attendance.attendanceDate.getFullYear();

//                 if (attendanceMonth === parseInt(month) && attendanceYear === parseInt(year)) {
//                     if (student.status && student.status.toLowerCase() === "present") {
//                         presentDays = presentDays + 1;
//                     }

//                     const studentId = student.studentId;
//                     const studentAttendanceDetails = {
//                         status: student.status
//                     };

//                     if (studentDetailsMap.has(studentId)) {
//                         studentDetailsMap.get(studentId).attendanceDetails.push(studentAttendanceDetails);
//                     } else {
//                         studentDetailsMap.set(studentId, {
//                             attendanceDetails: [studentAttendanceDetails],
//                             presentDays: 0,
//                             absentDays: 0
//                         });
//                     }

//                     if (student.status && student.status.toLowerCase() === "present") {
//                         studentDetailsMap.get(studentId).presentDays += 1;
//                     } else {
//                         studentDetailsMap.get(studentId).absentDays += 1;
//                     }
//                 }
//             });
//         });

//         const totalStudents = studentDetailsMap.size;
//         const percentageAttendance = (presentDays / (totaldays * totalStudents)) * 100;

//         // Format the response with student-wise attendance details
//         const formattedStudentDetails = Array.from(studentDetailsMap.entries()).map(([studentId, details]) => {
//             return {
//                 studentId,
//                 presentDays: details.presentDays,
//                 absentDays: details.absentDays,
//                 attendanceDetails: details.attendanceDetails
//             };
//         });

//         return res.json({ presentDays, totaldays, totalStudents, percentageAttendance, studentDetails: formattedStudentDetails });
//     } catch (e) {
//         console.log(e);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };


module.exports = attendenceCtrl;
