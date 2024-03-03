import asyncHandler from "express-async-handler";
import Category from "../model/Category.js";

export const createCatergory = asyncHandler(async (req, res) => {
    //console.log('req.file?.path: ', req.file?.path);
    const { name } = req.body;
    //category exists
    const categoryFound = await Category.findOne({ name });
    if (categoryFound) {
        throw new Error('Category exists');
    }

    //Create
    const category = await Category.create({
        name: name ? name.toLowerCase() : '',
        user: req.userAuthId,
        //image: req.file && req.file?.path ? req.file.path : ''
    });

    res.json({
        status: 1,
        message: 'Category created',
        category
    })
})

export const getAllCatergories = asyncHandler(async (req, res) => {
    const categories = await Category.find();
    res.json({
        status: 1,
        categories
    })
})


export const getSingleCatergory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    res.json({
        status: 1,
        category
    })
})


//Update single category
//@route  PUT /api/categories/:id
//@access Private/Admin
export const updateCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const id = parseInt(req.params.id);
    //update
    const category = await Category.findByIdAndUpdate(id, {
        name,
    }, {
        new: true
    });

    res.json({
        status: 1,
        message: 'Category updated',
        category
    });
});

//Delete category
//@route  DELETE /api/categories/:id
//@access Private/Admin
export const deleteCategory = asyncHandler(async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.json({
        status: 1,
        message: 'Category deleted',
    });
});