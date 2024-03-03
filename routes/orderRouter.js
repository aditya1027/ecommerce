import express from 'express';
import { createOrder, fetchAllOrders, getOrderStatistics, getSingleOrder, updateOrderStatus } from '../controllers/orderController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const orderRouter = express.Router();

orderRouter.post('/', isLoggedIn, createOrder)
orderRouter.get('/', isLoggedIn, fetchAllOrders)
orderRouter.put('/update/:id', isLoggedIn, updateOrderStatus)
orderRouter.get('/:id', isLoggedIn, getSingleOrder)
orderRouter.get('/sales/stats', isLoggedIn, getOrderStatistics)


export default orderRouter;
