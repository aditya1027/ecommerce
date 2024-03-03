import express from 'express';
import { isAdmin, isLoggedIn } from '../middlewares/isLoggedIn.js';
import { createColor, deleteColor, getAllColors, getSingleColor, updateColor } from '../controllers/colorsController.js';

const colorsRouter = express.Router();

colorsRouter.post('/', isLoggedIn, isAdmin, createColor);
colorsRouter.get('/', getAllColors);
colorsRouter.get('/:id', getSingleColor);
colorsRouter.put('/:id', isLoggedIn, isAdmin, updateColor);
colorsRouter.delete('/:id', isLoggedIn, isAdmin, deleteColor);


export default colorsRouter;

