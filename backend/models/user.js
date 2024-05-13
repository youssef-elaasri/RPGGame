const { DataTypes } = require('sequelize');
const db = require('./database');

const User = db.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    // pseudonym: {
    //     type: DataTypes.STRING,
    //     allowNull: false,
    //     unique: true,
    // },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false
});

module.exports = User;
