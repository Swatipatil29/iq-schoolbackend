 const Feetransaction= require('../models/feetransactionModel')

 const feeValidationSchema = {
    paidamount: {
        notEmpty: {
            errorMessage: "Amount should be required",
        },
        isNumeric: {
            errorMessage: "Amount must be numeric",
        },
        isInt: {
            options: { min: 1000, max: 1000000 },
            errorMessage: "Amount must be between 1000 to 1000000",
        },
    },
    remarks: {
        notEmpty: {
            errorMessage: 'Remarks is required',
        },
        isLength: {
            options: { min: 3, max: 50 },
            errorMessage: "Remarks must be between 3 and 50 characters",
        },
    },
    modeOfPayment: {
        isIn: {
            options: [["online", "offline"]],
            errorMessage: "Payment should be online or offline",
        },
    },
    paymentDate: {
        isISO8601: {
            errorMessage: "Invalid date format. Use ISO8601 format.",
        },
    },
};


module.exports={
    feeSchema:feeValidationSchema
}