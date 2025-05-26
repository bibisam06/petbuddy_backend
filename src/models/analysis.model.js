const dynamoose = require("dynamoose");

const HealthAnalysisSchema = new dynamoose.Schema({
  analysis_id: {
    type: Number, 
    hashKey: true, 
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
  analysis_score: {
    type: String
  },
  analysis_description: {
    type: String
  },
  analysis_recommend: {
    type: String
  }
}, {
  timestamps: true
});

const HealthAnalysis = dynamoose.model("HealthAnalysis", HealthAnalysisSchema);
module.exports = HealthAnalysis;
