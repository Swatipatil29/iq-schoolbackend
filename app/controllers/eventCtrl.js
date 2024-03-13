const EventCalender = require('../models/eventCalendarModel')
// const mongoose= require('mongoose')

const _=require('lodash')
const {validationResult} = require('express-validator');
const { eventCalenderSchema } = require('../validations/eventCalenderValidation');

const eventCtrl = {}

eventCtrl.addEvent = async (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const body = _.pick(req.body, ['eventType', 'date', 'description', 'classIds']);
    
   try {
      const eventCalender = new EventCalender(body);
      eventCalender.userId = req.user.id;
  
      await eventCalender.save();
  
      res.status(200).json(eventCalender);
    } catch (e) {
      res.status(500).json(e);
    }
  };

  eventCtrl.updateEvent = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const id = req.params.id
    const body = _.pick(req.body, ['eventType', 'date', 'description', 'classIds']);
        try {
        const events = await EventCalender.findByIdAndUpdate({_id:id,userId:req.user.id},
            body,
            {new:true})
        if(!events){
            return res.status(400).json({errors:'events not found'})
        }

        // await classes.populate("students")
        // await classes.populate("subjects")
        res.json(events)
    }
    catch(e){
        console.log(e)
        res.status(500).json(e)
    }
}

eventCtrl.deleteEvent = async (req, res) => {
  try {
      const deletedEvent = await EventCalender.findByIdAndDelete(req.params.id);
      return res.status(201).json(deletedEvent);
  } catch (e) {
    console.log(e)
      res.status(500).json(e);
  }
};


//   eventCtrl.getOneclassEventDetails = async(req, res) => {
//     const classId = req.params.classId
//      try{
//     const events = await EventCalender.findById(classId)
//     if(!events){
//         return res.status(401).json("fee structure of student not found")
//     }
//     res.json(events)
//   } catch(e) {
//     res.status(500).json(e)
//   }
// }

eventCtrl.getOneEvent = async(req, res) => {
  const id = req.params.id
  
  try{
    const event = await EventCalender.findById(id)
    if(!event){
      return res.status(401).json("event not found")
    }
    return res.status(201).json(event)
  } catch(e) {
    return res.status(500).json(e)
  }
}


eventCtrl.listAllEvents = async(req,res)=>{
  
  try{
    const event = await EventCalender.find()
    
    if(!event){
      return res.status(401).json("event not found")
    }
    return res.status(201).json(event)
  }
  catch(err){
    return res.status(500).json(err)
  }
}

  module.exports = eventCtrl



