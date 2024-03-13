const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const eventCalenderSchema = new Schema({
  date: Date,
  eventType: String,
  description: String,
  classIds: [{
    type: Schema.Types.ObjectId,
         ref:"Class"
  }],
}, { timestamps: true });

const EventCalender = model('EventCalender', eventCalenderSchema);

module.exports = EventCalender;
