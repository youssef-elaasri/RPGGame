const { DataTypes } = require('sequelize');
const db = require('./database');
const User = require("./user");

const CompletedStage = db.define('CompletedStage', {
    flag: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false
    }
}, {
    timestamps: false
});

CompletedStage.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        constraints: {
            name: 'fk_completedstages_user'
        }
    }
});

module.exports = CompletedStage;