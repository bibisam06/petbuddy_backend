const dynamoose = require("dynamoose");

const ActivitySchema = new dynamoose.Schema({
  activity_id: {
    type: Number, 
    hashKey: true, // PK
    required: true
  },
  pet_id: {
    type: Number, 
    required: true // FK (참조)
  },
  user_id: {
    type: Number, 
    required: true // FK (참조)
  },
  activity_date: {
    type: Date, 
    required: true
  },
  activity_steps: {
    type: Number, 
    required: true
  },
  activity_km: {
    type: Number, 
    required: true
  },
  activity_time: {
    type: Number, // In minutes
    required: true
  },
  activity_start: {
    type: Date, // Use Date for DateTime
    required: true
  },
  activity_end: {
    type: Date, // Use Date for DateTime
    required: true
  }
}, {
  timestamps: true
});

const Activity = dynamoose.model("Activity", ActivitySchema);
module.exports = Activity;
