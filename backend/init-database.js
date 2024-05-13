const User = require('./models/user.js');
const Map = require('./models/map.js');
const SavePoint = require('./models/savePoint.js');
const CompletedStages = require('./models/completedStage.js')
const bcrypt = require('bcrypt');
const db = require('./models/database.js');


async function resetDatabase() {
    try {
        await db.getQueryInterface().dropAllTables();
        console.log('All tables dropped successfully.');

        await db.sync();
        console.log('Tables recreated successfully.');

    } catch (error) {
        console.error('Failed to reset database:', error);
    }
}


(async () => {
    try {
        if ( !process.argv.includes('reset') ) {
            await db.sync({ force: false });
        } else {
            await resetDatabase();

            console.log('** Database Initialization **');

            // Populate the database
            const maps = await Map.bulkCreate([
                { map_name: 'CPP' },
                { map_name: 'lobby' },
                { map_name: 'E3' },
                { map_name: 'felma' },
                { map_name: 'papet' },
                { map_name: 'imag' },
                { map_name: 'GI' },
                { map_name: 'polytech' },
                { map_name: 'IAE' },
            ]);
            console.log('- Added all MAPS');

            const users = await Promise.all([
                { username: 'a', password: 'a', email: 'alice@example.com' },
                { username: 'b', password: 'b', email: 'bob@example.com' },
            ].map(async user => {
                const hash = await bcrypt.hash(user.password, 10);
                return User.create({
                    username: user.username,
                    password_hash: hash,
                    email: user.email
                });
            }));

            await Promise.all(users.map(user => {
                if (!user.id || !maps[0].id) {
                    console.error('Map data is invalid:', maps[0]);
                    return;  // Exit if no valid map data is found
                }
                return SavePoint.create({
                    userId: user.id,
                    mapId: maps[0].id,
                    player_x: 272,
                    player_y: 160
                });
            }));

            console.log('- Created default users and save points. Use user : "a" - "b" and password : "a" - "b" to connect.');

        }

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        console.log('** Connected to DataBase successfully **')
    }
})()

