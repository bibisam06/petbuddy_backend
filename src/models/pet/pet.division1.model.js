import { DataTypes } from 'sequelize';
import sequelize from '../db/pgConnect.js';

const PetMajorClassification = sequelize.define('PetMajorClassification', {
  pet_division_1_code: {
    type: DataTypes.STRING,
    primaryKey: true, 
    allowNull: false,
  },
  pet_division_1_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pet_division_1_remark: {
    type: DataTypes.STRING,
    allowNull: true, 
  }
}, {
  timestamps: true, 
  tableName: 'pet_division_1',
  modelName: 'pet_major'
});

module.exports = PetMajorCategory;
