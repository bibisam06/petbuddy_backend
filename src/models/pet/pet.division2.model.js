const dynamoose = require("dynamoose");

const PetSubcategorySchema = new dynamoose.Schema({
  pet_division_2_code: {
    type: String,
    hashKey: true, // PK
    required: true
  },
  pet_division_2_remark: {
    type: String, // 추가 설명 (nullable)
    required : false
  },
  pet_division_2_name: {
    type: String,
    required: true
  }
}, {
  timestamps: true // createdAt, updatedAt 자동 추가
});

const PetSubcategory = dynamoose.model("PetSubcategory", PetSubcategorySchema);
module.exports = PetSubcategory;
