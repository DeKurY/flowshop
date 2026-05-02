import { Request, Response } from 'express';
import { client } from '../db/db';

// 1. Получение списка заказов
export const getOrders = async (req: Request, res: Response) => {
    try {
        const result = await client.query(`
            SELECT orders.id AS "Номер заказа", users.name AS "Покупатель", 
                   orders.total_price AS "Сумма", orders.payment_status AS "Статус оплаты"
            FROM orders
            JOIN users ON orders.user_id = users.id
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении списка заказов' });
    }
};

// 2. Создание заказа
export const createOrder = async (req: Request, res: Response) => {
    try {
        const { user_id, total_price, items } = req.body;
        const orderResult = await client.query(
            "INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING *",
            [user_id, total_price]
        );
        const newOrder = orderResult.rows[0];

        for (const item of items) {
            await client.query(
                "INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4)",
                [newOrder.id, item.product_id, item.quantity, item.price_at_purchase]
            );
        }
        res.json({ message: 'Заказ успешно оформлен!', order: newOrder });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при создании заказа' });
    }
};

// 3. Обновление статуса
export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;
        const result = await client.query(
            'UPDATE orders SET payment_status = $1 WHERE id = $2 RETURNING *',
            [status, orderId]
        );
        
        if (result.rows.length === 0) {
             res.status(404).json({ error: 'Заказ не найден' });
             return;
        }
        res.json({ message: 'Статус успешно обновлен!', order: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при обновлении статуса' });
    }
};