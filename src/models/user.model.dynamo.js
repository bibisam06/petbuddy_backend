import dynamoose from 'dynamoose';

const UserSchema = new dynamoose.Schema({
  user_id: {
    type: Number,
    hashKey: true,  // PK
    required: true
  },
  user_name: {
    type: String,
    required: true
  },
  user_email: {
    type: String,
    required: true
  },
  phone_number: String,
  sex: {
    type: String,
    required: true
  },
  user_password: {
    type: String,
    required: true
  },
  user_address: {
    type: String,
    required: true
  },
  remark: { //가입사유 등.. 
    type: String,
    required : false //필수요소아님.. 
  },
  birth: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

//export
const Users = dynamoose.model("Users", UserSchema);
module.exports = Users;
