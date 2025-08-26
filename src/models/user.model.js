import { DataTypes } from 'sequelize';
import sequelize from '../db/pgConnect.js';

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
  user_slug: {
  type: DataTypes.STRING,
  allowNull: true,
  },
  email: { 
    type: DataTypes.STRING,
    allowNull: true,
    unique: true 
  },
  user_password: {
    type : DataTypes.STRING,
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'),
    allowNull: true
  },
  interest: {
    type : DataTypes.ENUM('POO', 'ACTIVITY', 'SLEEP', 'DIGITALPET'),
    allowNull: true
  },
  sign_route:{ 
    type : DataTypes.ENUM('HOSPITAL', 'SNS', 'BLOG', 'SEARCH', 'FREIND', 'OTHER'),
    allowNull: true
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
    type: DataTypes.DATEONLY, 
    allowNull: true
  },
  user_steps: {
    type : DataTypes.INTEGER,
    allowNull : true,
    defaultValue : 0
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW, 
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true, 
  underscored: true
});

export default User;
