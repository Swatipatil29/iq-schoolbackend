require('dotenv').config()
const express = require('express')
const mongoose  = require('mongoose')
const app = express()
const path = require("path")
const cors = require("cors")
const port = 3050
const multer = require("multer")


const configureDb = require("./configuration/config")
configureDb()

const fileStorageEngine = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, "./pictures/images")
    },
    filename : (req, file, cb) => {
     cb(null, Date.now() + "__" + file.originalname)
    }
})

const upload = multer({storage : fileStorageEngine})



app.use(cors())
app.use(express.json())
app.use(express.static("pictures"))


//ctrl
const classCtrl = require("./app/controllers/classCtrl")
const markCtrl = require("./app/controllers/MarksCtrl")
const studentCtrl = require("./app/controllers/studentctrl")
const userCtrl = require("./app/controllers/userCtrl")
const teacherCtrl = require ('./app/controllers/teacherCtrl')
const subjectCtrl = require('./app/controllers/subjectCtrl')
const feeCtrl = require('./app/controllers/feeCtrl')
const attendenceCtrl = require ('./app/controllers/attendenceCtrl')
const eventCtrl= require('./app/controllers/eventCtrl')
const User = require("./app/models/userModel")


//validation
const {studentregisterValidation, studentupdateValidation} = require("./app/validations/studentValidation")
const {teacherSchema, teacherUpdateValidation} = require('./app/validations/teachervalidation')
const ClassValidation = require("./app/validations/classValidation")
const {authenticateUser, authorization} = require("./app/middleware/auth")
const { userValidationSchema, userLoginValidationSchema, userUpdateSchema } = require("./app/validations/userValidation")
const { marksCardSchema } = require("./app/validations/markscardValidation")
const { checkSchema } = require("express-validator")
const { subjectSchema } = require('./app/validations/subjectValidation')
const { feeSchema } = require('./app/validations/feetransactionValidation')
const { attendenceSchema } = require('./app/validations/attendenceValidation')
const Marksvalidation = require('./app/validations/markscardValidation')
const { eventCalenderSchema } = require('./app/validations/eventCalenderValidation')
const paymentCtrl = require('./app/controllers/paymentCtrl')


// app.post("/api/upload", upload.single("file"), (req, res) => {
//     console.log(req.body)
//     console.log(req.file)
// })

app.post("/api/user", checkSchema(userValidationSchema), userCtrl.register)
app.post("/api/userlogin", checkSchema(userLoginValidationSchema), userCtrl.login) //user login
app.put("/api/userupdate/:userId", checkSchema(userUpdateSchema), userCtrl.updateProfile) // update user
app.delete("/api/deleteUser/:userId",authenticateUser, authorization(["Principle"]),userCtrl.deleteUser) 
app.get("/api/getUserList",  userCtrl.getUser)
app.put("/api/user/id/profilePic", authenticateUser, authorization(["Principle"]), upload.single("file"), userCtrl.updateProfile)

//forgot-password
app.get("/api/forgot-password",userCtrl.forgotPassword)
app.post("/api/reset-password",userCtrl.resetPassword)

//student
app.get("/api/liststudent", authenticateUser, authorization(["Principle", "Teacher", "Student"]), studentCtrl.listall) //getall students
app.post("/api/addStudent", authenticateUser, authorization(["Principle"]),checkSchema(studentregisterValidation), studentCtrl.addStudent)// addstudents
app.get("/api/liststudent/:id", authenticateUser, authorization(["Principle", "Teacher" , "Student"]), studentCtrl.listone)
 app.get("/api/liststudent/:id/student", authenticateUser, authorization(["Student"]), studentCtrl.listoneStudent) //one student app.put("/api/updatestudent/:id", authenticateUser, authorization(["Principle"]), checkSchema(studentupdateValidation) ,studentCtrl.updateStudent) // updatestudent
app.put("/api/student/studentId/profilePic", authenticateUser, authorization(["Student"]), upload.single("file"), studentCtrl.updateProfile)
app.delete("/api/deleteStudent/:id", authenticateUser, authorization(["Principle"]), studentCtrl.delete) //delete student
 
//Class
app.post("/api/addClass", authenticateUser, authorization(["Principle"]), checkSchema(ClassValidation), classCtrl.addClass), //add class
app.get("/api/getClasses", authenticateUser, authorization(["Principle", "Teacher"]),classCtrl.listallClasses)
app.put("/api/updateClass/:id", authenticateUser, authorization(["Principle"]), classCtrl.updateClass) //updateClass
app.delete("/api/deleteClass/:id", authenticateUser, authorization(["Principle"]), classCtrl.deleteClass) // delete Class
app.get("/api/getoneclass/:id", authenticateUser, authorization(["Principle", "Teacher"]), classCtrl.oneClass) // get all classes


// teacher
app.post("/api/addTeacher",authenticateUser,authorization(['Principle']),checkSchema(teacherSchema),teacherCtrl.createTeacher)  // addteacher
app.put("/api/updateTeacher/:id",authenticateUser,authorization(['Principle']),checkSchema(teacherUpdateValidation),teacherCtrl.updateTeacher) // updateteacher
app.get("/api/listallTeacher",authenticateUser,authorization(['Principle', "Teacher","Teacher"]),teacherCtrl.listallTeachers) //listallteacher
app.put("/api/teacher/teacherId/profilePic", authenticateUser, authorization(["Teacher"]), upload.single("file"), teacherCtrl.updateProfile)
app.delete("/api/deleteTeacher/:id",authenticateUser,authorization(['Principle']),checkSchema(teacherSchema),teacherCtrl.deleteTeacher)//deleteteacher
app.get("/api/oneTeacher/:id",authenticateUser,authorization(['Principle', "Teacher"]),teacherCtrl.oneTeacher) //listing one teacher


// subject
app.post("/api/addSubject",authenticateUser,authorization(['Principle',"Teacher"]),checkSchema(subjectSchema),subjectCtrl.addSubject) // subject added
app.put("/api/updateSubject/:id",authenticateUser,authorization(['Principle']),checkSchema(subjectSchema),subjectCtrl.updateSubject) // subjects updates
app.get("/api/listallSubjects",authenticateUser,authorization(['Principle', 'Teacher','Student']),subjectCtrl.listallSubjects) // list all subjects
app.delete("/api/deleteSubject/:id",authenticateUser,authorization(['Principle']),subjectCtrl.deleteSubject)  // delete subject
app.get("/api/getonesubject/:id",authenticateUser,authorization(['Principle']),subjectCtrl.oneSubject)


//feeTransaction
app.post("/api/addFeetransaction",authenticateUser,authorization(['Principle']),checkSchema(feeSchema),feeCtrl.addFee) //add fee
app.put("/api/updateFeetransaction/:id",authenticateUser,authorization(['Principle']),checkSchema(feeSchema),feeCtrl.updateFee) //add updatefee
app.get("/api/listallFeetransaction",authenticateUser,authorization(['Principle']),feeCtrl.listallFeedetails) // list all feee details
app.delete("/api/deleteFeetransaction/:id",authenticateUser,authorization(['Principle']),checkSchema(feeSchema),feeCtrl.deleteFeedetails) // delete fee details
app.get("/api/getoneStudent/:studentId", authenticateUser, authorization(["Principle"]), feeCtrl.getOneStudentFeeDetails)


//marks
app.post("/api/addMarks", authenticateUser, authorization(['Teacher']),checkSchema(marksCardSchema), markCtrl.addmarks) //add marks
app.put("/api/updateMarks/:id/:sId", authenticateUser, authorization(["Teacher"]), markCtrl.updateMarks) //update mark
app.delete("/api/deleteMarks/:id", authenticateUser, authorization(["Teacher"]),  markCtrl.deletemarks) // delete marks
app.get("/api/markofOneStudent/:classid/:studentid", authenticateUser, authorization(["Teacher","Student", "Principle"]), markCtrl.markofStudent) //onestudent marks
//app.get("/api/allMarks", authenticateUser, authorization(['Teacher']), markCtrl.allMarks)
app.get("/api/getAllMarksStudent/:studentId", authenticateUser, authorization(["Principle", "Teacher"]),markCtrl.getAllMarksCardStudent )



// attendence
app.post("/api/addAttendence",authenticateUser,authorization(['Teacher']),checkSchema(attendenceSchema), attendenceCtrl.addAttendence) //  add atendence valid
app.put("/api/updateAttendence/:id",authenticateUser,authorization(['Teacher']),attendenceCtrl.updateAttendence) // update attendence valid
app.delete("/api/deleteAttendence/:classId/:studentId",authenticateUser,authorization(['Teacher']),checkSchema(attendenceSchema),attendenceCtrl.deleteAttendence)  // delete attendence valid
app.get("/api/getStudentAttendance/:studentId", authenticateUser, authorization(["Teacher",'Student']), attendenceCtrl.calculateOneMonthAttendanceOfOneStdent); //calculation of attendance of one student valid
app.get("/api/getStudentAttendance/:studentId", authenticateUser, authorization(["Teacher",'Student']), attendenceCtrl.calculateOneMonthAttendanceOfOneStdent); //calculation of attendance of one student valid
app.get("/api/oneclassattendance/:classId", authenticateUser, authorization(["Principle", "Teacher"]), attendenceCtrl.getOneClassAttendance); //valid
app.get("/api/classAttendance/:classId", authenticateUser, authorization(["Principle", "Teacher"]), attendenceCtrl.getClassAttendance); //valid
// app.get("/api/getAllAttendences", authenticateUser, authorization(['Teacher']), attendenceCtrl.getAllAttendences); // list all attendences
// app.delete("/api/deletestudentAttendence/:attendanceId/:studentId",authenticateUser,authorization(['Teacher']),checkSchema(attendenceSchema),attendenceCtrl.deleteStudentAttendence)
// app.get("/api/getoneAttendences/:studentId", authenticateUser, authorization(['Teacher','Student']), attendenceCtrl.oneStudentAttendance) //attendance of student
// app.get("/api/StudentAttendanceforoneclass", authenticateUser, authorization(["Principle","Teacher"]), attendenceCtrl.calculateOneMonthAttendanceForOneClass)


//eventCalender
app.post("/api/addEvent",authenticateUser,authorization(['Principle']),checkSchema(eventCalenderSchema),eventCtrl.addEvent) //add event
app.put("/api/updateEvent/:id", authenticateUser, authorization(["Principle"]),checkSchema(eventCalenderSchema), eventCtrl.updateEvent) //update event
app.delete("/api/deleteEvent/:id", authenticateUser, authorization(["Principle"]), eventCtrl.deleteEvent) //delete event
//app.get("/api/getOneClassEvent/:classId", authenticateUser, authorization(["Principle"]), eventCtrl.getOneclassEventDetails) 
app.get("/api/getOneEvent/:id", authenticateUser, authorization(["Principle"]), eventCtrl.getOneEvent)
app.get("/api/listAllEvents",authenticateUser,authorization(['Principle','Teacher','Student']),checkSchema(eventCalenderSchema),eventCtrl.listAllEvents)
app.listen(port, () => {
    console.log('server is running on port', port)
})

//paymentRoutes
app.get("/api/payment-details/:studentid/:classid",paymentCtrl.details)
app.post("/api/payment-checkout",paymentCtrl.checkout)
app.put("/api/payment-update",paymentCtrl.updatePayment)
app.delete("/api/payment-delete/:id",paymentCtrl.deletePayment)
app.get("/api/getAllFeeDetails", paymentCtrl.getAllStudentFeeDetails)
app.get("/api/paymentDetailOfOneStudent/:studentId", paymentCtrl.getOneStudentPayment)

//calculating total fee route
app.get("/api/totalfee",authenticateUser,authorization(["Principle"]),paymentCtrl.totalFee)



