import { DataTypes } from 'sequelize';
import sequelize from '../db/pgConnect.js';

const FeedReport = sequelize.define('FeedReport', {
  feed_log_id: {
    type: DataTypes.INTEGER,
    primaryKey: true, 
    allowNull: false,
    autoIncrement: true, 
  },
  pet_id: {
    type: DataTypes.INTEGER,
    allowNull: false, 
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  food_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  food_provide_yn: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  food_provide_date: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  food_total_amount: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  food_remain_amount: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  food_score: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  sequelize,
  underscored : true,
  modelName : "FeedReport",
  tableName: 'food_log',  
  timestamps: true,        
});

// FeedReport.belongsTo(Food, {
//   as : 'food', 
//   foreignKey : 'food_id',
//   targetKey : 'food_id'
// });

export default FeedReport;
