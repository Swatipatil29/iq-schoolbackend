const moment = require('moment');
const Attendence = require("../models/attendenceModel")

const attendenceValidationSchema = {
    attendanceDate: {
        notEmpty: {
            errorMessage: 'Date is required',
        },
        custom: {
            options: async (value) => {
                const dateFormat = 'YYYY-MM-DD';
                if (!moment(value, dateFormat, true).isValid()) {
                    throw new Error('Invalid date format. Use YYYY-MM-DD format.');
                }
                const currentDate = moment().startOf('day');
                const selectedDate = moment(value, dateFormat);
                if (selectedDate.isAfter(currentDate)) {
                    throw new Error('Date cannot be greater than today');
                }
                // Check if attendance for the same day already exists
                const existingAttendance = await Attendence.findOne({ attendanceDate: selectedDate });
                if (existingAttendance) {
                    throw new Error('Attendance already taken for this date');
                }
                return true;
            },
        },
    },
    teacherId: {
        notEmpty: {
            errorMessage: "Teacher cannot be empty"
        }
    },
    classId: {
        notEmpty: {
            errorMessage: 'Class is required'
        }
    }
};

module.exports = {
    attendenceSchema: attendenceValidationSchema
};
