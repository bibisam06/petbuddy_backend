import { DataTypes } from 'sequelize';
import sequelize from '../db/pgConnect.js';

const FeedReport = sequelize.define('FeedReport', {
  feed_log_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,  // PK 설정
    allowNull: false,
    autoIncrement: true, // 자동 증가 옵션을 설정할 수 있습니다. (필요한 경우)
  },
  pet_id: {
    type: DataTypes.INTEGER,
    allowNull: true, //TODO : 나중에 다시 false로 변경할 필요 있음. 
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
