import mysql from 'mysql2';
import connectionString from '../config/db.config';

const mysqlConnection = mysql.createConnection(connectionString);

export default mysqlConnection;
