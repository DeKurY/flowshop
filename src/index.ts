import express from 'express';
import cors from 'cors';
import { connectDB } from './db/db';
import apiRoutes from './routes/api';

const app = express();
const port = 3000;

// 1. Настройка "охранников" и форматов
app.use(666660p());
app.use(express.json());

// 2. Подключение всех маршрутов приложения одной строкой!
app.use('/', apiRoutes);

// 3. Функция запуска: сначала база, потом сервер
const startServer = async () => {
    await connectDB();
    
    app.listen(port, () => {
        console.log(`🚀 Сервер запущен на порту ${port}`);
    });
};

startServer();