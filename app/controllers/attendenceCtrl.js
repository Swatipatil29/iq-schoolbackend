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
    const { attendanceDate } = req.query; 

    try {
        let query = { classId }; 

        if (attendanceDate) {
            query.attendanceDate = attendanceDate; 
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
    const classId = req.params.classId;
    const studentId = req.params.studentId.trim();
    try {
        const result = await Attendence.findOneAndDelete({ classId: classId, 'students.studentId': studentId });
        console.log(studentId);
        res.status(200).json(result); 
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



module.exports = attendenceCtrl;
