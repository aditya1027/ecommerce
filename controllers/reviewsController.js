import asyncHandler from "express-async-handler";
import Review from "../model/Review.js";
import Product from "../model/Product.js";

//Create review
//@route  POST /api/reviews/
//@access Private/Admin
export const createReview = asyncHandler(async (req, res) => {
    const { product, message, rating } = req.body;
    // 1.Find the product for review
    const { productId } = req.params;

    const productFound = await Product.findById(productId).populate('reviews');

    if (!productFound) {
        throw new Error('Product not found')
    }

    //Check if user already reviewed this product
    const hasReviewed = productFound?.reviews.find(review => {
        review?.user.toString() === req?.userAuthId.toString()
    });

    if (hasReviewed) {
        throw new Error('You have already reviewed this product')
    }

    //Create review
    const review = await Review.create({
        message,
        rating,
        product: productFound?._id,
        user: req.userAuthId
    });

    //Push review into product found
    productFound.reviews.push(review?._id);
    await productFound.save();

    res.status(201).json({
        status: 1,
        message: 'Review created successfully'
    })
})


//GET all brands
//@route  GET /api/brands
//@access Public

