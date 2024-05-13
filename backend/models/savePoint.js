const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const User = require('./user');
const Map = require('./map');

const SavePoint = sequelize.define('SavePoint', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    player_x: DataTypes.INTEGER,
    player_y: DataTypes.INTEGER,
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    mapId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Maps',
            key: 'id'
        }
    }
}, {
    timestamps: false
});

User.hasOne(SavePoint, {
    foreignKey: 'userId',
    as: 'savePoint'
});

Map.hasOne(SavePoint, {
    foreignKey: 'mapId',
    as: 'savePoint'
});


SavePoint.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

SavePoint.belongsTo(Map, {
    foreignKey: 'mapId',
    as: 'map'
});


module.exports = SavePoint;