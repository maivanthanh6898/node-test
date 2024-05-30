const {DataTypes} = require('sequelize');
const sequelize = require('../config/dbConfig');
const {v4: uuidv4} = require('uuid');

const UserInformation = sequelize.define('UserInformation', {
    avatar: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: uuidv4,
        allowNull: false,
    },
    level: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    exp: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    point: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    levelBadge: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true, // Disable automatic creation of createdAt and updatedAt fields
    tableName: 'user_information', // Optional: explicitly set table name
});

module.exports = UserInformation;
