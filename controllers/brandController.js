import asyncHandler from "express-async-handler";
import Brand from "../model/Brand.js";

//Create brand
//@route  POST /api/brands/
//@access Private/Admin
export const createBrand = asyncHandler(async (req, res) => {
    const { name } = req.body;
    //brand exists
    const brandFound = await Brand.findOne({ name });
    if (brandFound) {
        throw new Error('Brand exists');
    }
    //Create
    const brand = await Brand.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
    });

    res.json({
        status: 1,
        message: 'Brand created',
        brand
    })
})

//GET all brands
//@route  GET /api/brands
//@access Public
export const getAllBrands = asyncHandler(async (req, res) => {
    const brands = await Brand.find();
    res.json({
        status: 1,
        brands
    })
})

//GET single brand
//@route  GET /api/brands/:id
//@access Public
export const getSingleBrand = asyncHandler(async (req, res) => {
    const brand = await Brand.findById(req.params.id);
    res.json({
        status: 1,
        brand
    })
})


//Update single brand
//@route  PUT /api/brands/:id
//@access Private/Admin
export const updateBrand = asyncHandler(async (req, res) => {
    const { name } = req.body;

    //update
    const brand = await Brand.findByIdAndUpdate(req.params.id, {
        name,
    }, {
        new: true
    });

    res.json({
        status: 1,
        message: 'Brand updated',
        brand
    });
});

//Delete brand
//@route  DELETE /api/brands/:id
//@access Private/Admin
export const deleteBrand = asyncHandler(async (req, res) => {
    await Brand.findByIdAndDelete(req.params.id);
    res.json({
        status: 1,
        message: 'Brand deleted',
    });
});