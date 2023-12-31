import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const {Pool} = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});
console.log(pool)

const query = (text, params) => pool.query(text, params);

export {query};