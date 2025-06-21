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
        allowNull : true
    },
    food_brand : {
        type : DataTypes.STRING,
        allowNull : true
    },
    food_name : {
        type : DataTypes.STRING,
        allowNull : true
    },
    food_amount_total : {
        type : DataTypes.INTEGER,
        allowNull : true
    },
    food_amount_small: {
        type : DataTypes.INTEGER,
        allowNull : true
    },
    food_amount_medium : {
        type : DataTypes.INTEGER,
        allowNull : true
    },
    food_amount_large : {
        type : DataTypes.INTEGER,
        allowNull : true
    }
},{
    sequelize,
    underscored : true,
    modelName : "Food",
    tableName: 'food', 
    timestamps: false, //정보 저장용 테이블이라 false 로 해두었음..          
});

export default Food; 