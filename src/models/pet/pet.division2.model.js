import { DataTypes } from 'sequelize';
import sequelize from '../db/pgConnect.js';

const PetSubcategory = sequelize.define('PetSubcategory', {
  pet_division_2_code: {
    type: DataTypes.STRING,
    primaryKey: true, 
    allowNull: false,
  },
  pet_division_2_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pet_division_2_remark: {
    type: DataTypes.STRING,
    allowNull: true,  
  }
}, {
  timestamps: true, 
  tableName: 'pet_division_2',
  modelName: 'pet_minor'
});

module.exports = PetSubcategory;
