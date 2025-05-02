import { DataTypes } from 'sequelize';
import sequelize from '../db/pgConnect.js';
import PetMajorCategory from '../models/pet.division1.model.js';

const PetSubCategory = sequelize.define('PetSubCategory', {
  pet_division_2_code: {
    type: DataTypes.STRING,
    primaryKey: true, 
    allowNull: false,
  },
  pet_division_2_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  division1_code: {
    type: DataTypes.STRING,
    allowNull: true,  
  }
}, {
  timestamps: true, 
  tableName: 'pet_division_2',
  modelName: 'pet_minor'
});

PetSubCategory.belongsTo(PetMajorCategory, {
  foreignKey: 'division1_code',
  targetKey: 'pet_division_1_code',
});

export default PetSubCategory;
