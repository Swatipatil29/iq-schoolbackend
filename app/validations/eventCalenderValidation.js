 const eventCalenderValidationSchema =({
    date: {
        notEmpty: {
            errorMessage: 'Date is required',
        },
        isDate: {
            errorMessage: 'Invalid date format. Use ISO8601 format.',
            format : "DD-MM-YYYY"
        },
    },
    eventType:{
        notEmpty:{
            errorMessage:'event type is required'
        }
    },
    description:{
        notEmpty:{
            errorMessage:'description type is required'
        }
    },
    classIds:{
        notEmpty:{
            errorMessage:'class is required'
        }
    }
 })


 module.exports = {
    eventCalenderSchema:eventCalenderValidationSchema
 }