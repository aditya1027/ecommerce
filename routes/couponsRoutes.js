import express from 'express';
import { isAdmin, isLoggedIn } from '../middlewares/isLoggedIn.js';
import { createCoupon, deleteCoupon, getAllCoupons, getCoupon, updateCoupon } from '../controllers/couponController.js';

const couponsRouter = express.Router();

couponsRouter.post('/', isLoggedIn, isAdmin, createCoupon);
couponsRouter.get('/', isLoggedIn, getAllCoupons);
couponsRouter.get('/:id', isLoggedIn, getCoupon);
couponsRouter.put('/update/:id', isLoggedIn, isAdmin, updateCoupon);
couponsRouter.delete('/delete/:id', isLoggedIn, isAdmin, deleteCoupon);


export default couponsRouter;

