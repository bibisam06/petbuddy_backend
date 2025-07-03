// models/HealthAnalysis.js

import { DataTypes } from 'sequelize';
import sequelize from '../db/pgConnect.js';


const PooAnalysis = sequelize.define('PooAnalysis', {
  poop_log_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement : true
  },
  pet_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }, 
  poop_date: { 
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, //초깃값 설정 
    allowNull: false,
  },
  poop_score_total: { //1~100까지의 점수
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  poop_grade_total: { 
  type: sequelize.literal('poop_grade'),
  allowNull: true,
  },
  poop_score_moisture: { //1~100까지의 점수
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  poop_grade_moisture: { 
    type: sequelize.literal('poop_status'),
    allowNull: true,
  },
  poop_score_color: { //1~100까지의 점수
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  poop_grade_color: { 
    type: sequelize.literal('poop_status'),
    allowNull: true,
  },
  poop_score_parasite: { //1~100까지의 점수
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  poop_grade_parasite: { 
    type: sequelize.literal('poop_status'),
    allowNull: true,
  },
  poop_url : {
    type : DataTypes.TEXT,
    allowNull : true
  }
}, {
  sequelize,
  modelName : 'PooAnalysis',
  tableName: 'poop_log',
  timestamps: false,
  underscore : true
});

export default PooAnalysis;
