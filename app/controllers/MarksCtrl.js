const Mark = require("../models/Marksmodel");
const _ = require("lodash");
const { validationResult } = require("express-validator");
const { oneClass } = require("./classCtrl");
const mongoose = require('mongoose')
const { ObjectId } = require('mongoose').Types

const markCtrl = {};


markCtrl.addmarks = async (req, res) => {
    // console.log("called")
    // console.log(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const body = _.pick(req.body, [
            "title",
            "class",
            "results",
            "marks"
        ]);
        // console.log(body)
        // console.log(req.body,"check")
        const marks = new Mark(body);
        for (const result of marks.results) {
            await Mark.populate(result, { path: 'subjects' });
        }

        await marks.save();
        res.json(marks);
    } catch (e) {
        console.log(e);
        res.status(500).json(e);
    }
};



markCtrl.updateMarks = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const newResults = req.body;
        const id = req.params.id;
        const sId = req.params.sId;

        const mark = await Mark.findById(id);

        if (!mark) {
            return res.status(404).json({ error: 'Marks not found' });
        }

        // Find the index of the student in the results array
        const studentIndex = mark.results.findIndex(item => item.studentId.toString() === sId);
        if (studentIndex === -1) {
            return res.status(404).json({ error: 'Student not found in marks' });
        }

        // Update the marks for existing subjects
        newResults.forEach(newResult => {
            const { _id: subjectId, marks } = newResult;
            const subjectIndex = mark.results[studentIndex].subjects.findIndex(subject => subject._id.toString() === subjectId);
            if (subjectIndex !== -1) {
                mark.results[studentIndex].subjects[subjectIndex].marks = marks;
            }
        });

        // Save the updated marks document
        await mark.save();

        // Send a success response
        res.status(200).json(mark);
    } catch (error) {
        console.error('Error updating marks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




  markCtrl.deletemarks = async (req, res) => {
    try {
        const marks = await Mark.findByIdAndDelete(req.params.id)
        res.status(201).json(marks)
    } catch (err) {
       console.log(err)
        res.status(500).json(err);
    }
}




markCtrl.getAllMarksCardStudent = async (req, res) => {
  try{
    const { studentId } = req.params;

    
    const marksCards = await Mark.find({ 'results.studentId': studentId })
      .populate('class') 
      .populate('results.subjects.subjectId'); 

    
    if (marksCards.length === 0) {
      return res.status(404).json({ message: 'No marks cards found for the specified student.' });
    }

    
    res.status(200).json(marksCards);
  } catch (error) {
    console.error('Error fetching marks cards:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};





markCtrl.markofStudent = async (req, res) => {
    try {
        const classid = req.params.classid;
        const studentid = req.params.studentid;

        const classMarks = await Mark.findOne({ class: classid }).populate({path : "results.subjects.subjectId"})

        if (!classMarks) {
            return res.status(404).json({ error: "No marks associated with that student" });
        }

        // Filter out only the marks of the specified student
        const studentMarks = classMarks.results.find(result => result.studentId.toString() === studentid);

        if (!studentMarks) {
            // Return an error if the student's marks are not found
            return res.status(404).json({ error: "Student's marks not found" });
        }

        // Return the _id of the marks card along with the student's marks
        res.status(200).json({ marksCardId: classMarks._id, studentMarks });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Internal server error" }); // Return error response
    }
};




module.exports = markCtrl;

