require('dotenv').config();
const mysql = require('mysql');
const fs = require('fs');
const bcrypt = require('bcrypt');
const util = require('util');

const sqlCommands = fs.readFileSync('sql/db_init.sql', 'utf8').split(';');

const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: 'INP_Legends',
});

const query = util.promisify(connection.query).bind(connection);

const initializeDatabase = async () => {
    try {
        await connection.connect();

        // Check for 'reset' command argument
        if (process.argv.includes('reset')) {
            console.log('** Database Initialization **')
            // Execute each SQL command sequentially
            for (const command of sqlCommands) {
                if (command.trim()) {
                    await query(command);
                }
            }
            console.log('- Created Tables')
            // Populate the database
            const users = [
                { username: 'a', password: 'a', email: 'alice@example.com' },
                { username: 'b', password: 'b', email: 'bob@example.com' },
            ];

            for (const user of users) {
                const hash = await bcrypt.hash(user.password, 10);
                const sql = 'INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)';
                const result = await query(sql, [user.username, hash, user.email]);

                // Create default save point
                await query('INSERT INTO saved_games (user_id, map_id, player_x, player_y) VALUES (?, (SELECT map_id FROM maps WHERE map_name = ? LIMIT 1), ?, ?)', [result.insertId, "testroom", 272, 160]);
            }
            console.log('- Created default users and save points. Use user : "a" and pswd : "a" to connect.')
        }
    } catch (err) {
        console.error('Error during database initialization: ' + err.stack);
    } finally {
        console.log('** Connected to Database successfully **');
    }
};

initializeDatabase();

module.exports = connection;
