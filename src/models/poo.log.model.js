// models/HealthAnalysis.js

import { DataTypes } from 'sequelize';
import sequelize from '../db/pgConnect.js';


const PooAnalysis = sequelize.define('PooAnalysis', {
  poop_log_id: {
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
  }, //fks
  poop_date: { 
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, 
    allowNull: false,
  },
  poop_score_total: { //1~100까지의 점수
    type: DataTypes.INTEGER,
    allowNull: true,
  },
   poop_score_grade: { 
    type: DataTypes.ENUM(1,2,3,4,5),
    allowNull: true,
  },
   poop_score_moisture: { 
    type: DataTypes.ENUM('A','B','C'),
    allowNull: true,
  },
   poop_score_color: { 
    type: DataTypes.ENUM('A','B','C'),
    allowNull: true,
  },
   poop_score_parasite: { 
    type: DataTypes.ENUM('A','B','C'),
    allowNull: true,
  }
}, {
  sequelize,
  modelName : 'PooAnalysis',
  tableName: 'poop_log',
  timestamps: true,
  underscore : true
});

export default PooAnalysis;
