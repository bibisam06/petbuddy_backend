const dynamoose = require("dynamoose");
// TODO : 나중에 pet과 dog중 하나로 결정할 예정.. 
const PetSchema = new dynamoose.Schema({
  pet_id: {
    type: Integer,
    hashKey: true, // PK
    required: true
  },
  user_id: {
    type: Integer,
    required: true // FK 역할
  },
  pet_name: {
    type: String,
    required: true
  },
  pet_division_3: {
    type: String // 필요 여부 검토 가능
  },
  pet_birth: {
    type: Date // 생년월일 (YYYY-MM-DD)
  },
  pet_gender: {
    type: Enumerator,
    required: true // 성별
  },
  pet_size: {
    type: Enumerator // 크기 정보 (소형, 중형, 대형 등)
  },
  neuter_yn: {
    type: Boolean // 중성화 여부 (Y/N)
  },
  pet_division_1_code: {
    type: String,
    required: true // 1차 분류 코드
  },
  pet_division_2_code: {
    type: String,
    required: true // 2차 분류 코드
  }
}, {
  timestamps: true // createdAt, updatedAt 자동 생성
});

const Pet = dynamoose.model("Pet", PetSchema);
module.exports = Pet;
