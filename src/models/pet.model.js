import { DataTypes } from 'sequelize';
import sequelize from '../db/pgConnect.js';
import PetSubCategory from '../models/pet.division2.model.js';
import User from '../models/user.model.js';


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
    type: DataTypes.STRING,
    allowNull: false,
  },
  pet_size: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  neuter_yn: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  division2_code: {
    type: DataTypes.STRING,
    allowNull: true, //TODO : 개발 다 하고 나서 allowNull 변경 필요 + user_id
  },
}, {
  sequelize,
  timestamps: true, 
  tableName: 'pet', 
  modelName: 'Pet',
  underscored: true
});


Pet.belongsTo(PetSubCategory, {
  foreignKey: 'division2_code',
  targetKey: 'pet_division_2_code',
});

Pet.belongsTo(User, {
  as : 'owner', 
  foreignKey : 'user_id',
  targetKey : 'user_id'
});


export default Pet;
