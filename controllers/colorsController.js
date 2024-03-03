import asyncHandler from "express-async-handler";
import Color from "../model/Color.js";

//Create color
//@route  POST /api/colors/
//@access Private/Admin
export const createColor = asyncHandler(async (req, res) => {
    const { name } = req.body;
    //color exists
    const colorFound = await Color.findOne({ name });
    if (colorFound) {
        throw new Error('Color exists');
    }
    //Create
    const color = await Color.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
    });

    res.json({
        status: 1,
        message: 'Color created',
        color
    })
})

//GET all colors
//@route  GET /api/colors
//@access Public
export const getAllColors = asyncHandler(async (req, res) => {
    const colors = await Color.find();
    res.json({
        status: 1,
        colors
    })
})

//GET single color
//@route  GET /api/colors/:id
//@access Public
export const getSingleColor = asyncHandler(async (req, res) => {
    const color = await Color.findById(req.params.id);
    res.json({
        status: 1,
        color
    })
})


//Update single color
//@route  PUT /api/colors/:id
//@access Private/Admin
export const updateColor = asyncHandler(async (req, res) => {
    const { name } = req.body;

    //update
    const color = await Color.findByIdAndUpdate(req.params.id, {
        name,
    }, {
        new: true
    });

    res.json({
        status: 1,
        message: 'Color updated',
        color
    });
});

//Delete color
//@route  DELETE /api/colors/:id
//@access Private/Admin
export const deleteColor = asyncHandler(async (req, res) => {
    await Color.findByIdAndDelete(req.params.id);
    res.json({
        status: 1,
        message: 'Color deleted',
    });
});