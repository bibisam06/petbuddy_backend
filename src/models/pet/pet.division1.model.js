const dynamoose = require("dynamoose");

const PetMajorcategorySchema = new dynamoose.Schema({
  pet_division_1_code: {
    type: String,
    hashKey: true, // PK
    required: true,
    lowerclass : false
  },
  pet_division_1_name: {
    type: String,
    required: true,
    lowerclass : false
  },
  pet_division_1_remark: {
    type: String, // 추가 설명 (nullable)
    required : false
  }
}, {
  timestamps: true // createdAt, updatedAt 자동 추가
});

const PetMajorClassification = dynamoose.model("PetMajorClassification", PetMajorClassificationSchema);
module.exports = PetMajorClassification;
