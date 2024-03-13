const User = require("../models/userModel")

const userValidationSchema = {
    email : {
        notEmpty :{
            errorMessage: "Email cannot be empty"
        },
        isEmail : {
            errorMessage : "Email should be in proper formate"
        },
        custom:{
            options: async (value) => {
                const user = await User.findOne({ email : value})
                if(!user){
                    return true
                }
                throw new Error('email is already registerd')
            }
        }

        },

    password: {
        notEmpty: {
            errorMessage: "password cannot be empty"
        },
        isLength: {
            options : { min : 8, max: 128 },
            errorMessage: "password must be between 8 and 128"
        }
    },
    role: {
        notEmpty:{
            errorMessage: "role cannot be empty"
        },
        isIn : {
           options : [["Principle", "Teacher", "Student"]],
           errorMessage: ('role must be teacher or student or principle')
        }
    },
    // profilepic : {
    //     notEmpty :{
    //         errorMessage: "profilepic cannot be empty"
    //     }
    // }
}


const userLoginValidationSchema={
    email:{
        notEmpty:{
            errorMessage:'email should be valid'
        },
        isEmail:{
            errorMessage:'invalid email format'
        }
    },
    password:{
        notEmpty:{
            errorMessage:'password is required'
        },
        isLength:{
            options:{min:8,max:128},
            errorMessage:'password should be 8 to 128 charecters'
        }
    }
}

const userUpdateSchema = {
    email:{
        notEmpty:{
            errorMessage : "Email cannot be empty"
        },
        isEmail: {
            errorMessage: "Email should in proper formate"
        }
    },

    oldpassword : {
        notEmpty:{
            errorMessage:"old password cannot be empty"
        },
    },

    newpassword : {
        notEmpty:{
            errorMessage: "new password cannot be empty"
        } 
    },
    profilepic : {
        notEmpty :{
            errorMessage: "profilepic cannot be empty"
        }
    }
}


module.exports = {
  userValidationSchema : userValidationSchema,
  userLoginValidationSchema: userLoginValidationSchema,
  userUpdateSchema : userUpdateSchema
}