const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'elaasriy',
    password : 'root./',
    database : 'INP_Legends',
});


connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Successfully connected to the database.');
});

module.exports = connection;
