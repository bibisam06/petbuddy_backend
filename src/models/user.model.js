import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // DB 설정 파일을 import (경로는 프로젝트에 맞게 조정)

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
  user_email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // 이메일 중복 방지
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sex: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  remark: { //Notnull
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
