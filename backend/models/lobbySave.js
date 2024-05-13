const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const User = require('./user');
const Map = require('./map');

const LobbySave = sequelize.define('LobbySave', {
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

// You might also want to define the inverse relation if necessary
User.hasOne(LobbySave, { foreignKey: 'userId', as: 'lobbySave' });
Map.hasOne(LobbySave, { foreignKey: 'mapId', as: 'lobbySave' });


module.exports = LobbySave;
