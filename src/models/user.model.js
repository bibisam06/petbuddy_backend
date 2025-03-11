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
    allowNull: true
  },
  email: { 
    type: DataTypes.STRING,
    allowNull: true,
    unique: true // 이메일 중복 방지
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sex: {
    type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'),
    allowNull: true
  },
  interest: {
    type : DataTypes.ENUM('POO', 'ACTIVITY', 'SLEEP', 'DIGITALPET'),
    allowNull: true
  },
  sign_route:{

  },
  sign_route_detail:{

  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  remark: { //비고 - 항상 nullable로 
    type: DataTypes.TEXT,
    allowNull: true
  },
  birth: {
    type: DataTypes.DATEONLY, // YYYY-MM-DD 형식
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW, //timestamp
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users', // 테이블 이름 설정
  timestamps: true, // createdAt, updatedAt 자동 추가
  underscored: true // 컬럼을 snake_case로 변환 (예: created_at)
});

export default User;
