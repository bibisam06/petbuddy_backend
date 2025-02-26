import { DataTypes } from 'sequelize';
import sequelize from '../db/pgConnect.js';

//Postgresql User Table 정의
const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_email: { //TODO : biz앱변경후, express-validator설정,,
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // 이메일 중복 방지
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sex: {
    type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'),
    allowNull: false
  },
  user_address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  remark: { //nullable
    type: DataTypes.TEXT,
    allowNull: true
  },
  birth: {
    type: DataTypes.DATEONLY, // YYYY-MM-DD 형식
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users', // 테이블 이름 설정
  timestamps: true, // createdAt, updatedAt 자동 추가
  underscored: true // 컬럼을 snake_case로 변환 (예: created_at)
});

export default User;
