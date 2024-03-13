const Subject=require('../models/subjectModel')


const subjectValidationSchema={
    subject: {
        notEmpty: {
            errorMessage: 'Subject is required'
        }
    },
    custom: {
        options: async (value) => {
                const subject = await Subject.findOne({ subject: value });
                if (subject) {
                    throw new Error("Subject already present");
                } else {
                    return true;
                }
            } 
        }
    }



module.exports={
    subjectSchema:subjectValidationSchema
}