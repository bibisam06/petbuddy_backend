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
  pet_slug: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pet_birth: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  pet_gender: {
    type: DataTypes.ENUM('MALE', 'FEMALE'),
    allowNull: true,
  },
  pet_size: {
    type: DataTypes.ENUM('SMALL', 'MEDIUM', 'LARGE'),
    allowNull: true,
  },
  neuter_yn: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  division2_code: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  feed_time : {
    type : DataTypes.JSONB, 
    allowNull : true
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
  onDelete : 'CASCADE'
});

Pet.belongsTo(User, {
  as : 'owner', 
  foreignKey : 'user_id',
  targetKey : 'user_id',
  onDelete : 'CASCADE'
});


export default Pet;
