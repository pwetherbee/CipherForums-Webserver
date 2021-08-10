require("dotenv").config();
let mySQL = require("mysql");
const env = process.env;
let password = String(env.DB_PASSWORD);
class SQLHelper {
  createConnection() {
    let connection = mySQL.createConnection({
      //TODO: Create an env file to store password to database
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: password,
      database: process.env.DB_NAME,
      multipleStatements: true,
    });
    return connection;
  }
}

module.exports = new SQLHelper();
