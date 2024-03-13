const Class = require("../models/ClassModel");
const Teacher = require("../models/teacherModel");

const ClassValidation = {
    name: {
        notEmpty: {
            errorMessage: "Class name cannot be empty"
        },
        custom: {
            options: async (value, { req }) => {
                const className = req.body.name;
                const existingClass = await Class.findOne({
                    name: className
                });
                if (existingClass) {
                    throw new Error("Class is already present");
                } else {
                    return true;
                }
            }
        }
    },

    // teacherId  : {
    //     notEmpty: {
    //         errorMessage: "Teacher cannot be empty"
    //     },
    //     custom:{
    //         options: async (value) => {
    //             const teacher = await Class.findOne({teacherId : value})
    //             if(teacher){
    //                 throw new Error("teacher is already assigned to other class")
    //             } else{
    //                 return true
    //             }
    //         }
    //     }
    // },

    // students: {
    //     notEmpty: {
    //         errorMessage: "Student cannot be empty"
    //     },
    //     custom: {
    //         options: async (value) => {
    //             const result = await Class.findOne({
    //                 students: { $in: value } // Check if any class has at least one of the provided students
    //             });
    
    //             if (result) {
    //                 throw new Error("one student is already assigned to a class");
    //             } else {
    //                 return true;
    //             }
    //         }
    //     }
    // },
    
    
   

    fee : {
        notEmpty:{
            errorMessage : "fees cannot be empty"
        },
        isNumeric:{
            errorMessage: "fees should be number"
        },
        custom: {
            options: (value, { req }) => {
                const className = req.body.name; 

                if (className === "1" && parseFloat(value) !== 100) {
                    throw new Error("Fee should be 100 for Class 1");
                } else if (className === "2" && parseFloat(value) !== 150) {
                    throw new Error("Fee should be 150 for Class 2");
                }
                
                return true; 
            }
        }
    }
    }




module.exports = ClassValidation