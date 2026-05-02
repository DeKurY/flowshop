import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

export const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
});

export async function connectDB() {
    try {
        await client.connect();
        console.log('Успешно подключено к PostgreSQL!');
    } catch (error) {
        console.error('Ошибка подключения к БД:', error);
    }
}