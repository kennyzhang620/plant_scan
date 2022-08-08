const { Pool } = require('pg');

var status = 0; // 0 - Success 1 - Failure
var mode = 1; // 0 DEFAULT - Heroku DB+SSL 1 LOCALHOST - psqlDB
var pool = {}

if (mode == 0) {
    console.log("Server in HEROKU mode. SSL connections are required.");

    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }

    });
}

else {
    console.log("Server in LOCALHOST mode. SSL connections are not used.");

    pool = new Pool({
        // Localhost only
         connectionString: process.env.DATABASE_URL || "postgres://postgres:123123123@localhost:5432/image_test"

    });
}

module.exports = pool