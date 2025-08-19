// models/UserToken.js
import { DataTypes } from 'sequelize';
import sequelize from '../db/pgConnect.js';

// fk constraints 
import User from '../models/user.model.js';
import Pet from '../models/pet.model.js';

const UserToken = sequelize.define('UserToken', {
token_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
},
user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
},
pet_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
},
user_token: {
    type: DataTypes.STRING,
    allowNull: true, //TODO : 개발용 
},
refresh_expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
}
}, {
tableName: 'user_tokens',
timestamps: true,
});




UserToken.belongsTo(User, {
    foreignKey: 'user_id',
    targetKey: 'user_id', 
    onDelete: 'CASCADE',
    onUpdate : 'CASCADE'
});

UserToken.belongsTo(Pet, {
    foreignKey : 'pet_id',
    targetKey : 'pet_id',
    onDelete : 'CASCADE',
    onUpdate : 'CASCADE'
});

export default UserToken;
