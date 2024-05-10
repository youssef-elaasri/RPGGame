const { DataTypes } = require('sequelize');
const db = require('./database');

const Map = db.define('Map', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    map_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
    },
}, {
    timestamps: false,
    updatedAt: false
});

module.exports = Map;
