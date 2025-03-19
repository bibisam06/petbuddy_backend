const { DataTypes } = require('sequelize');
import sequelize from '../db/pgConnect.js';

const Pet = sequelize.define('Pet', {
  pet_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true, 
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pet_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pet_birth: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  pet_gender: {
    type: DataTypes.ENUM('MALE', 'FEMALE'),
    allowNull: false,
  },
  pet_size: {
    type: DataTypes.ENUM('LARGE', 'MEDIUM', 'SMALL'),
    allowNull: true, // dev -> production 시 수정 예정
  },
  neuter_yn: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  pet_division_1_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pet_division_2_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  timestamps: true, 
  tableName: 'pet', 
  modelName: 'Pet',
  underscored: true
});

export default Pet;
