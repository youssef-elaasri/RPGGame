const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const User = require('./user');
const Map = require('./map');

const LobbySave = sequelize.define('LobbySave', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
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
    timestamps: false,
});

// LobbySave belongs to User
LobbySave.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// LobbySave belongs to Map
LobbySave.belongsTo(Map, { foreignKey: 'mapId', as: 'map' });

User.hasOne(LobbySave, { foreignKey: 'userId', as: 'lobbySave' });
Map.hasMany(LobbySave, { foreignKey: 'mapId', as: 'lobbySaves' });


module.exports = LobbySave;
