import asyncHandler from "express-async-handler";
import Coupon from "../model/Coupon.js";


//create new coupons
// POST /api/v1/coupons
// private/admin
export const createCoupon = asyncHandler(async (req, res) => {
    //check if coupon exists
    const {
        code,
        startDate,
        endDate,
        discount
    } = req.body;

    const couponExists = await Coupon.findOne({
        code
    })
    if (couponExists) {
        throw new Error('Coupon already exists');
    }

    if (NaN(discount)) {
        throw new Error('Discount value must be a number');
    }

    const coupon = await Coupon.create({
        code: code.toUpperCase(),
        startDate,
        endDate,
        discount,
        user: req.userAuthId
    });

    res.status(201).json({
        status: 1,
        message: 'Coupon created',
        coupon
    })

})


//GET/api/v1/coupons
export const getAllCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find();
    res.status(200).json({
        status: 1,
        coupons
    });
})

//Get single coupon
// GET /api/v1/coupons/:id
export const getCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);
    res.json({
        status: 1,
        coupon
    })
})


//Update single coupon
// PUT /api/v1/coupons/:id
export const updateCoupon = asyncHandler(async (req, res) => {
    const {
        code,
        startDate,
        endDate,
        discount
    } = req.body;

    const coupon = await Coupon.findByIdAndUpdate(req.params.id, {
        code,
        startDate,
        endDate,
        discount
    }, { new: true });

    res.json({
        status: 1,
        coupon,
        message: 'Coupon update'
    });
})

//DElete single coupon
// delete /api/v1/coupons/:id
export const deleteCoupon = asyncHandler(async (req, res) => {
    const {
        code,
        startDate,
        endDate,
        discount
    } = req.body;

    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    res.json({
        status: 1,
        coupon,
        message: 'Coupon deleted'
    });
})