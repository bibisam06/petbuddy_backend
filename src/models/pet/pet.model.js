const dynamoose = require("dynamoose");
 
const PetSchema = new dynamoose.Schema({
  pet_id: {
    type: Integer,
    hashKey: true, 
    required: true
  },
  user_id: {
    type: Integer,
    required: true 
  },
  pet_name: {
    type: String,
    required: true
  },
  pet_division_3: {
    type: String 
  },
  pet_birth: {
    type: Date 
  },
  pet_gender: {
    type: Enumerator,
    required: true 
  },
  pet_size: {
    type: Enumerator 
  },
  neuter_yn: {
    type: Boolean 
  },
  pet_division_1_code: {
    type: String,
    required: true 
  },
  pet_division_2_code: {
    type: String,
    required: true 
  }
}, {
  timestamps: true 
});

const Pet = dynamoose.model("Pet", PetSchema);
module.exports = Pet;
