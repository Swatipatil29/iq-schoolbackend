const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const marksCardValidationSchema = {
    title: {
        notEmpty: {
            errorMessage: 'Title is required',
        }
    },
    class: {
        notEmpty: {
            errorMessage: 'Class is required',
        }
    },
    results: {
        notEmpty: {
            errorMessage: ' results cannot be empty',
        }
    },
    results: {
       notEmpty:{
        errorMessage : "result cannot be empty"
       },
        studentId: {
            notEmpty:{
                errorMessage : "result cannot be empty"
        }
        },
        subjectId: {
            notEmpty:{
                errorMessage : "subjectIdcannot be empty"
        },
        marks: {
            notEmpty:{
                errorMessage : "marks cannot be empty"
            },
            isNumeric: {
                options: {
                    min: 0,
                    max: 100
                },
                errorMessage: "Marks must be a number between 0 and 100"
            }
        }

        }
    }
    
}


module.exports = {
    marksCardSchema: marksCardValidationSchema
};

