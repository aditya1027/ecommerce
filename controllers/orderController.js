import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import Stripe from 'stripe'
import Order from '../model/Order.js';
import User from '../model/User.js';
import Product from '../model/Product.js';
import asyncHandler from 'express-async-handler';
import Coupon from '../model/Coupon.js';

//stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

export const createOrder = asyncHandler(async (req, res) => {
    //Get coupon
    const { coupon } = req.query;
    let discount = 0;
    if (coupon) {
        const couponFound = await Coupon.findOne({
            code: coupon.toUpperCase(),
        });

        if (couponFound && couponFound.isExpired) {
            throw new Error('Coupon has expired')
        }
        else if (!couponFound) {
            throw new Error('Coupon not found');
        }
        else
            discount = couponFound?.discount / 100
    }


    // 1.Get the payload(customer , orderItems , shippingAddress, totalPrice)
    const {
        orderItems,
        shippingAddress,
        totalPrice
    } = req.body;

    // 2.Find the user
    const user = await User.findById(req.userAuthId);
    if (!user.hasShippingAddress) {
        throw new Error('Please provide shipping address');
    }

    // 3.Check if order is not empty
    if (orderItems.length <= 0) {
        throw new Error('No Order Items');
    }

    // 4.Place/Create order --save into DB
    const order = await Order.create({
        user: user?._id,
        orderItems,
        shippingAddress,
        totalPrice: discount ? totalPrice - totalPrice * discount : totalPrice
    });

    //Push order into user
    user.orders.push(order?._id);
    await user.save();

    // 5.Update the product qty
    const products = await Product.find({
        _id: { $in: orderItems }
    });

    orderItems.map(async (order) => {
        const product = products.find(product => {
            return product?._id.toString() === order?._id.toString()
        });

        if (product) {
            product.totalSold += order.qty;
        }

        await product.save();
    });

    //Convert DS for stripe
    const convertedOrders = orderItems.map(item => {
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item?.name,
                    description: item?.description,
                },
                unit_amount: item?.price * 100
            },
            quantity: item?.qty,
        }
    })

    // 6.Make payment (stripe)
    const session = await stripe.checkout.sessions.create({
        line_items: convertedOrders,
        metadata: {
            orderId: JSON.stringify(order?._id)
        },
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/failure',
    });

    res.send({ url: session.url });

    // 7.Payment webhook

    // 8.Update the user order
    // res.json({
    //     success: 1,
    //     message: 'Order created',
    //     order,
    //     user,
    // })
})


// get all orders
// GET /api/v1/orders
// private admin
export const fetchAllOrders = asyncHandler(async (req, res) => {
    //final all orders
    const orders = await Order.find();
    res.json({
        success: 1,
        message: 'All orders',
        orders,
    })
})

// get single order
// GET /api/v1/orders/:id
// private admin
export const getSingleOrder = asyncHandler(async (req, res) => {
    //final all orders
    const id = req.params.id;
    const order = await Order.findById(id);

    res.json({
        success: 1,
        order,
    })
})

// Update order
// PUT /api/v1/orders/update/:id
// private admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
    //final all orders
    const id = req.params.id;
    const updatedOrder = await Order.findByIdAndUpdate(id, {
        status: req.body.status,
    }, { new: true });

    res.json({
        success: 1,
        message: 'Order updated',
        updatedOrder,
    })
})

//Get sale sum of orders
//GET /api/v1/orders/sales/sum
//private
export const getOrderStatistics = asyncHandler(async (req, res) => {
    //get statistics
    const orders = await Order.aggregate([{
        $group: {
            _id: null,
            minimumSale: {
                $min: '$totalPrice'
            },
            totalSales: {
                $sum: '$totalPrice'
            },
            maxmumSale: {
                $max: '$totalPrice'
            },
            avgSale: {
                $avg: '$totalPrice'
            }
        }
    }]);

    //get the date
    const date = new Date();
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const saleToday = await Order.aggregate([{
        $match: {
            createdAt: {
                $gte: today
            }
        }
    },
    {
        $group: {
            _id: null,
            totalSales: {
                $sum: 'totalPrice'
            }
        }
    }])



    res.json({
        status: 1,
        orders,
        saleToday
    })
})

