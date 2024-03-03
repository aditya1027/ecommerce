import express from 'express';
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../controllers/productController.js';
import { isAdmin, isLoggedIn } from '../middlewares/isLoggedIn.js';
import upload from '../config/fileUpload.js';

const productsRoutes = express.Router();

productsRoutes.get('/:id', getProduct);
productsRoutes.post('/', isLoggedIn, isAdmin, upload.array('files'), createProduct);
productsRoutes.get('/', getProducts);
productsRoutes.put('/:id', isLoggedIn, isAdmin, updateProduct);
productsRoutes.delete('/:id/delete', isLoggedIn, isAdmin, deleteProduct);


export default productsRoutes;