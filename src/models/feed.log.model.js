const { Sequelize, DataTypes } = require('sequelize');
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
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  feed_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  feed_provide_yn: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  feed_provide_date: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  feed_total_amount: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  feed_remain_amount: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  feed_score: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  field: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  sequelize,
  underscored : true,
  modelName : "FeedLog",
  tableName: 'feed_log',  // 테이블 이름
  timestamps: true,          // 자동으로 createdAt, updatedAt 필드를 관리
});

export default FeedLog;
