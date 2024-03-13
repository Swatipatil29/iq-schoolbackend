const Teacher = require('../models/teacherModel')
const User = require("../models/userModel")

const teacherValidationSchema={
    title: {
        notEmpty: {
            errorMessage: 'title is required'
        },
        isIn: {
            options: [["Ms", "Mrs"]],
            errorMessage: "title should be Ms or Mrs"
        }
    },
    
    email: {
      notEmpty: {
        errorMessage : ("email cannot be empty")
      }
    },

    firstName:{
        notEmpty:{
            errorMessage:'name is requried'
        },
        isLength:{
            options:{min:3,max:64},
            errorMessage:'name should be in between 6 to 64 charecters'
        }
    },
    lastName:{
        notEmpty:{
            errorMessage:'name is required'
        },
        isLength:{
            options:{min:3,max:64},
            errorMessage:'name should be in between 6 to 64 charecters'
        }
    },
    gender: {
        isIn: {
            options: [["Male", "Female"]],
            errorMessage: 'gender should be Male or Female'
        }
       
    },
    
    mobile:{
        notEmpty:{
            errorMessage:"number should be required"
        },
        isLength:{
            options:{min:10,max:10},
            errorMessage:'mobilenumber should be max 10 and min 10 charecters'
        }
    }, 
    
    // userId: {
    //     custom: {
    //         options: async (value, { req }) => {
    //             try {
    //                 const teacher = await Teacher.findOne({ userId: value });
    //                 if (teacher) {
    //                     throw new Error("teacher not found with the provided userId");
    //                 }


    //                 const user = await User.findOne({ _id: value });
    //                 console.log(user.email,"hii")
    //                 console.log(req.body.email, "hello")
    //                 if (user.email !== req.body.email) {
    //                     throw new Error("The provided email does not match the email associated with the userId");
    //                 }
    //                 return true;
    //             } catch (error) {
    //                 throw new Error(error.message);
    //             }
    //         }
    //     }
    // }

    userId: {
        custom: {
            options: async (value, { req }) => {
                try {
                    const teacher = await Teacher.findOne({ userId: value });
                    if (teacher) {
                        throw new Error("Teacher found with the provided userId");
                    }
    
                    const user = await User.findOne({ _id: value });
                    if (!user) {
                        throw new Error("User not found with the provided userId");
                    }
    
                    if (user.email !== req.body.email) {
                        throw new Error("The provided email does not match the email associated with the userId");
                    }
                    return true;
                } catch (error) {
                    throw new Error(error.message);
                }
            }
        }
    },
    

subjects: {
    notEmpty: {
      errorMessage: "subject cannot be empty"
    }
},

  classId: {
    optional: { nullable: true },
    custom: {
        options: async (value) => {
            const teacher = await Teacher.findOne({ classId: value });
            if (teacher) {
                throw new Error('Class is already assigned to another teacher');
            }
            return true;
        }
    }
}

  
}

const teacherUpdateValidation = {
    title: {
        notEmpty: {
            errorMessage: 'title is required'
        },
        isIn: {
            options: [["Ms", "Mrs"]],
            errorMessage: "title should be Ms or Mrs"
        }
    },
    
    email: {
      notEmpty: {
        errorMessage : ("email cannot be empty")
      }
    },

    firstName:{
        notEmpty:{
            errorMessage:'name is requried'
        },
        isLength:{
            options:{min:3,max:64},
            errorMessage:'name should be in between 6 to 64 charecters'
        }
    },
    lastName:{
        notEmpty:{
            errorMessage:'name is required'
        },
        isLength:{
            options:{min:3,max:64},
            errorMessage:'name should be in between 6 to 64 charecters'
        }
    },
    gender: {
        isIn: {
            options: [["Male", "Female"]],
            errorMessage: 'gender should be Male or Female'
        }
       
    },
    
    mobile:{
        notEmpty:{
            errorMessage:"number should be required"
        },
        isLength:{
            options:{min:10,max:10},
            errorMessage:'mobilenumber should be max 10 and min 10 charecters'
        }
    }, 
    
    


subjects: {
    notEmpty: {
      errorMessage: "subject cannot be empty"
    }
},

  classId: {
    optional: { nullable: true },
    custom: {
        options: async (value) => {
            const teacher = await Teacher.findOne({ classId: value });
            if (teacher) {
                throw new Error('Class is already assigned to another teacher');
            }
            return true;
        }
    }
}

  
}






module.exports={
    teacherSchema:teacherValidationSchema,
    teacherUpdateValidation: teacherUpdateValidation
}