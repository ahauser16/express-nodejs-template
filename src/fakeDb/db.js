//template/src/fakeDb/db.js
require('dotenv').config(); // Add this line to ensure dotenv is loaded

const { Client } = require("pg");

// Assuming you have a separate config file or environment variables set for DB URIs
const DB_URI = process.env.NODE_ENV === "test" ? process.env.TEST_DB_URI : process.env.DB_URI;

const db = new Client({
    connectionString: DB_URI
  });

// Start the connection with the database and add basic error handling
db.connect(err => {
    if (err) {
      console.error("Connection error", err.stack);
    } else {
      console.log("Connected to database:", DB_URI);
    }
  });

//export the database. This will be used in the routes and the server and the tests.
module.exports = db;