import { DataTypes } from 'sequelize';
import sequelize from '../db/pgConnect.js';
import User from '../models/user.model.js';
import Pet from '../models/pet.model.js';

const Activity = sequelize.define('Activity', {
  activity_log_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  pet_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
   // unique : 'activity_uniques'
  },
  user_id: { 
    type: DataTypes.INTEGER,
    allowNull: true
  },
  activity_date: {
    type : DataTypes.DATEONLY,
    allowNull: false,
    // unique : 'activity_uniques' //TODO : 개발할 때에는 unique 일단 제외 -> 테스트 필요하므로 
  },
  activity_hourly_steps: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, 
{
  sequelize,
  modelName: 'Activity',
  tableName: 'activity_log',
  timestamps: false, //불필요해서 false로 설정해둠  
  underscored: true
});


//fk constraints 
Activity.belongsTo(User,{
  foreignKey : 'user_id', as: 'user',
  onDelete : 'CASCADE'
});

Activity.belongsTo(Pet,{
  foreignKey : 'pet_id', as: 'pet',
  onDelete : 'CASCADE'
})


export default Activity;
