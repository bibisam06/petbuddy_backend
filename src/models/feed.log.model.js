import { DataTypes } from 'sequelize';
import sequelize from '../db/pgConnect.js';
import User from '../models/user.model.js';
import Pet from '../models/pet.model.js';
import Food from '../models/food.model.js';

const FeedReport = sequelize.define('FeedReport', {
  feed_log_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    field: 'food_log_id'
  },
  pet_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  food_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  food_remain_amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  food_score: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  food_remain_days: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  food_close_yn: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  food_add_yn: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  food_add_amount: DataTypes.INTEGER,
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'FeedReport',
  tableName: 'food_log',
  underscored: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Fk 관계 설정
FeedReport.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
FeedReport.belongsTo(Pet, { foreignKey: 'pet_id', as: 'pet' });
FeedReport.belongsTo(Food, { foreignKey: 'food_id', as: 'food' });

export default FeedReport;
