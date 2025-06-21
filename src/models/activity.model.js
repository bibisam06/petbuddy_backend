const dynamoose = require("dynamoose");
// -- 아직 수정안됨
const ActivitySchema = new dynamoose.Schema({
  activity_id: {
    type: Number, 
    hashKey: true, // PK
    required: true
  },
  pet_id: {
    type: Number, 
    required: true 
  },
  user_id: {
    type: Number, 
    required: true
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
    type: Number, 
    required: true
  },
  activity_start: {
    type: Date, 
    required: true
  },
  activity_end: {
    type: Date, 
    required: true
  }
}, {
  timestamps: true
});

const Activity = dynamoose.model("Activity", ActivitySchema);
module.exports = Activity;
