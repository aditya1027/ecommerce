import express from 'express';
import { isAdmin, isLoggedIn } from '../middlewares/isLoggedIn.js';
import { createBrand, deleteBrand, getAllBrands, getSingleBrand, updateBrand } from '../controllers/brandController.js';

const brandsRouter = express.Router();

brandsRouter.post('/', isLoggedIn, isAdmin, createBrand);
brandsRouter.get('/', getAllBrands);
brandsRouter.get('/:id', getSingleBrand);
brandsRouter.put('/:id', isLoggedIn, isAdmin, updateBrand);
brandsRouter.delete('/:id', isLoggedIn, isAdmin, deleteBrand);


export default brandsRouter;

