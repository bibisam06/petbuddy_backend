const dynamoose = require("dynamoose");

const SleepSchema = new dynamoose.Schema({
  pet_id: {
    type: Number,
    hashKey: true, 
    required: true
  },
  sleep_date: {
    type: Date,
    required: true
  },
  user_id: {
    type: Number,
    required: true // FK 역할
  },
  sleep_start: {
    type: Date, 
  },
  sleep_end: {
    type: Date, 
    required : true
  },
  sleep_efficiency: {
    type: Number,
    validate: (val) => val >= 0 && val <= 100 // 0~100 사이 값 체크
  },
  sleep_grade: {
    type: String,
    enum :['normal', 'good', 'bad'],
    required: true // 수면 등급 (예: 양호, 보통, 나쁨 등)
  },
  sleep_pattern: {
    type: Boolean // 규칙 Y/불규칙 N
  }
}, {
  timestamps: true
});

const Sleep = dynamoose.model("Sleep", SleepSchema);
module.exports = Sleep;
