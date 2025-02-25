const dynamoose = require("dynamoose");

const FeedReportSchema = new dynamoose.Schema({
  feed_log_id: {
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
  feed_name: {
    type: String
  },
  feed_provide_yn: {
    type: String
  },
  feed_provide_date: {
    type: String
  },
  feed_total_amount: {
    type: String
  },
  feed_remain_amount: {
    type: String
  },
  feed_score: {
    type: String
  },
  field: {
    type: String
  }
}, {
  timestamps: true 
});

const FeedReport = dynamoose.model("FeedReport", FeedReportSchema);
model.export = FeedReport;