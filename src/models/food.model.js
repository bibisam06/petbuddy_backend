import { DataTypes } from 'sequelize';
import sequelize from '../db/pgConnect.js';


const Food = sequelize.define('Food', {
    food_id: {
        type : DataTypes.INTEGER,
        primaryKey : true,
        allowNull : false, 
        autoIncrement : true
    },
    food_code : {
        type : DataTypes.STRING,
        allowNull : False
    },
    food_brand : {
        type : DataTypes.STRING,
        allowNull : false 
    },
    food_name : {
        type : DataTypes.STRING,
        allowNull : false 
    },
    food_total_amount : {
        type : DataTypes.INTEGER,
        allowNull : false 
    },
    food_price : {
        type : DataTypes.INTEGER,
        allowNull : false 
    }
},{
    sequelize,
    underscored : true,
    modelName : "Food",
    tableName: 'food', 
    timestamps: true,          
});

export default Food; 