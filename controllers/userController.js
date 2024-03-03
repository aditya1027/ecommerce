import User from "../model/User.js";
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import { generateToken, getTokenFromHeader, verifyToken } from "../utils/authTokenHelper.js";

export const registerUserController = asyncHandler(async (req, res) => {
    const { fullname, email, password } = req.body;
    //Check user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        //throw error
        throw new Error('User already exists');
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create & register
    const user = await User.create({
        fullname,
        email,
        password: hashedPassword
    });

    res.status(201).json({
        status: 'success',
        message: 'User Registered successfully!!',
        data: user,
    })

})


export const loginUserController = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && await bcrypt.compare(password, user.password)) {
        res.json({
            user,
            status: 1,
            token: generateToken(user._id)
        });
    } else {
        throw new Error('Invalid credentials')
    }

});

// GET/api/v1/users/profile
export const getUserProfileController = asyncHandler(async (req, res) => {
    const user = await User.findById(req.userAuthId).populate('orders');
    if (user) {
        res.json({
            status: 1,
            user,
        });
    } else {
        throw new Error('Error occurred')
    }

});

// Update shpping address
// PUT /api/v1/users/update/shipping
export const updateShippingAddressController = asyncHandler(async (req, res) => {
    const { firstname, lastname,
        address, city, postalCode, province, phone } = req.body;

    const user = await User.findByIdAndDelete(req.userAuthId, {
        shippingAddress: {
            firstname,
            lastname,
            address,
            city,
            postalCode, province, phone
        },
        hasShippingAddress: true,
    }, { new: true });

    res.json({
        status: 1,
        message: 'User shipping address updated successfully',
        user,
    })
});