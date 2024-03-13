const Student = require("../models/studentModel")
const User = require("../models/userModel")
const studentValidation = {
    firstname : {
        notEmpty : {
           errorMessage:  "first name cannot be empty"
        },
    
    isLength : {
        options : {min: 3, max:50},
        errorMessage : "name must be between 3 and 50"
    }
},

    lastname : {
        notEmpty : {
            errorMessage: "last name cannot be empty"
    },
    isLength : {
        options : {min: 3, max:50},
        errorMessage : "name must be between 3 and 50"
    },
},

    gender : {
        isIn:{
        options: [["Male", "Female"]],
        errorMessage: "gender should be male or female"
        }
        },
        
        rollnumber: {
            rollnumber: {
                notEmpty:{
                    errorMessage: "Roll number cannot be empty"
                },
                isNumeric:{
                    errorMessage : "Roll number should be a number"
                },
                custom:{
                    options: async (value, { req }) => {
                        const { classId } = req.body; 
                        const student = await Student.findOne({ rollnumber: value, classId: classId });
                        
                        if(student){
                            throw new Error('Roll number should be unique within the class');
                        } else {
                            return true;
                        }
                    }
                }
            }
        },

    parentsname : {
        notEmpty:{
            errorMessage: "parent name should not be empty"
        }
    },

    parentnumber : {
        notEmpty: {
            errorMessage: "parent phone cannot be empty"
        },
        isLength: {
            options: { min: 10, max:10},
            errorMessage: "mobile number should be of length 10"
        }
    },
    email : {
        notEmpty :{
            errorMessage: "Email cannot be empty"
        },
        isEmail : {
            errorMessage : "Email should be in proper formate"
        },
      

        },

     

        userId: {
            custom: {
                options: async (value, { req }) => {
                    try {
                        const student = await Student.findOne({ userId: value });
                        if (student) {
                            throw new Error("Student already with the provided userId");
                        }
    

                        const user = await User.findOne({ _id: value });
                        // console.log(user.email,"hii")
                        // console.log(req.body.email, "hello")
                        if (user.email !== req.body.email) {
                            throw new Error("The provided email does not match the email associated with the userId");
                        }
                        return true;
                    } catch (error) {
                        throw new Error(error.message);
                    }
                }
            }
        }
    }

    
        
const studentUpdateValidation = {
    firstname : {
        notEmpty : {
           errorMessage:  "first name cannot be empty"
        },
    
    isLength : {
        options : {min: 3, max:50},
        errorMessage : "name must be between 3 and 50"
    }
},

    lastname : {
        notEmpty : {
            errorMessage: "last name cannot be empty"
    },
    isLength : {
        options : {min: 3, max:50},
        errorMessage : "name must be between 3 and 50"
    },
},

    parentsname : {
        notEmpty:{
            errorMessage: "parent name should not be empty"
        }
    },
     isLength : {
        options : {min: 3, max:50},
        errorMessage : "name must be between 3 and 50"
    },

    parentnumber : {
        notEmpty: {
            errorMessage: "parent phone cannot be empty"
        },
        isLength: {
            options: { min: 10, max:10},
            errorMessage: "mobile number should be of length 10"
        }
    },
    email : {
        notEmpty :{
            errorMessage: "Email cannot be empty"
        },
        isEmail : {
            errorMessage : "Email should be in proper formate"
        },
        // custom:{
        //     options: async (value) => {
        //         const user = await User.findOne({ email : value})
        //         if(!user){
        //             return true
        //         }
        //         throw new Error('email is already registerd')
        //     }
        // }

        },

}

module.exports = {
    studentregisterValidation:studentValidation,
    studentupdateValidation: studentUpdateValidation
} 



