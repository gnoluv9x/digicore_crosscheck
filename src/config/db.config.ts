import dotenv from 'dotenv';
import { ConnectionOptions } from 'mysql2';

dotenv.config();

const connectionString: ConnectionOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306', 10),
};

export default connectionString;
