import { DataTypes } from 'sequelize';
import sequelize from '../db/pgConnect.js';

const PetMajorCategory = sequelize.define('PetMajorClassification', {
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
  timestamps: false, //정보테이블이므로 createdAt, updatedAt 정보 없음 
  tableName: 'pet_division_1',
  modelName: 'PetMajorCategory'
});

export default PetMajorCategory;
