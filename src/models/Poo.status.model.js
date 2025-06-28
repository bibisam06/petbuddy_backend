// models/HealthAnalysis.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // 너의 Sequelize 인스턴스 경로에 맞게 수정해줘

const PooAnalysis = sequelize.define('PooAnalysis', {
  analysis_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  pet_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  analysis_score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  analysis_description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  analysis_recommend: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'HealthAnalysis',
  timestamps: true,
});

module.exports = HealthAnalysis;
