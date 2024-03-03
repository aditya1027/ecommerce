import mongoose from 'mongoose';
const Schema = mongoose.Schema;

//Generate random numbers for order
const randomTxt = Math.random().toString(36).substring(7).toLocaleUpperCase();
const randomNumbers = Math.floor(1000 + Math.random() * 90000);

const OrderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderItems: [
        {
            type: Object,
            required: true
        }
    ],
    shippingAddress: {
        type: Object,
        required: true,
    },
    orderItems: {
        type: String,
        required: true,
        default: randomTxt + randomNumbers
    },
    //for stripe payment
    paymentStatus: {
        type: String,
        default: 'Not paid'
    },
    totalPrice: {
        type: Number,
        default: 0.0,
    },
    paymentMethod: {
        type: String,
        default: 'Not specified'
    },
    currency: {
        type: String,
        default: 'Not specified'
    },
    //for Admin
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'processing', 'shipped', 'delivered']
    },
    deliveredAt: {
        type: Date,
    },
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);
export default Order;