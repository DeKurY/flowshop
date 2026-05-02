import { Router, Request, Response } from 'express';
import { getOrders, createOrder, updateOrderStatus } from '../controllers/orderController';
import { client } from '../db/db';

const router = Router();

// --- МАРШРУТЫ ЗАКАЗОВ (используют наш новый контроллер) ---
router.get('/orders', getOrders);
router.post('/orders', createOrder);
router.patch('/orders/:id/status', updateOrderStatus);

// --- МАРШРУТЫ ТОВАРОВ (оставил здесь для совместимости с твоим фронтендом) ---
router.get('/products', async (req: Request, res: Response) => {
    const result = await client.query('SELECT * FROM products');
    res.json(result.rows);
});

export default router;