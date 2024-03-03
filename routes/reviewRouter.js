import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { createReview } from '../controllers/reviewsController.js';

const reviewRouter = express.Router();

reviewRouter.post('/:productId', isLoggedIn, createReview);
// reviewRouter.get('/', getAllBrands);
// reviewRouter.get('/:id', getSingleBrand);
// reviewRouter.put('/:id', isLoggedIn, updateBrand);
// reviewRouter.delete('/:id', isLoggedIn, deleteBrand);


export default reviewRouter;

