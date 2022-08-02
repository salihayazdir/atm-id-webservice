import { config } from 'dotenv';
import pg from 'pg';

config();
const {Pool} = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.LOCAL_DATABASE_URL ,
  ...(process.env.DATABASE_URL && 
    { ssl: { sslmode: 'require', rejectUnauthorized: false } })
});

export {pool}