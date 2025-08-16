// models/UserToken.js
import { DataTypes } from 'sequelize';
import sequelize from '../db/pgConnect.js';

import User from '../models/user.model.js';

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
user_token: {
    type: DataTypes.STRING,
    allowNull: false,
},
refresh_expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
}
}, {
tableName: 'user_tokens',
timestamps: true,
});

// Associations (users 테이블과 FK 연결)

UserToken.belongsTo(User, {
    foreignKey: 'user_id',
    targetKey: 'user_id', // users 테이블 PK
    onDelete: 'CASCADE',
});

export default UserToken;
