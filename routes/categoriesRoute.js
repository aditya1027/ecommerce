import express from 'express';
import { createCatergory, getAllCatergories, getSingleCatergory, updateCategory, deleteCategory } from '../controllers/categoriesController.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import categoryFileUpload from '../config/categoryUpload.js';
const catergoriesRouter = express.Router();


catergoriesRouter.post('/', isLoggedIn, /* categoryFileUpload.single('file'), */ createCatergory);
catergoriesRouter.get('/', getAllCatergories);
catergoriesRouter.get('/:id', getSingleCatergory);
catergoriesRouter.put('/:id', isLoggedIn, updateCategory);
catergoriesRouter.delete('/:id', isLoggedIn, deleteCategory);


export default catergoriesRouter;

