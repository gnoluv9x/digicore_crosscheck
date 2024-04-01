import connectionOptions from '@/config/db.config';
import mysql from 'mysql2';

const mysqlConnection = mysql.createConnection(connectionOptions);

export default mysqlConnection;
