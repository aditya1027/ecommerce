import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import Stripe from 'stripe';
import dbConnect from '../config/dbConnect.js';
import userRoutes from '../routes/usersRoutes.js';
import { globalErrorHandler, notFound } from '../middlewares/globalErrorHandler.js';
import productsRoutes from '../routes/productsRoutes.js';
import catergoriesRouter from '../routes/categoriesRoute.js';
import brandsRouter from '../routes/brandsRouter.js';
import colorsRouter from '../routes/colorsRoutes.js';
import reviewRouter from '../routes/reviewRouter.js';
import orderRouter from '../routes/orderRouter.js';
import Order from '../model/Order.js';
import couponsRouter from '../routes/couponsRoutes.js';

//Database connection
dbConnect();
const app = express();



//Stripe webhook
const stripe = new Stripe(process.env.STRIPE_KEY);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_8c56691e56bff054fdb19711b631dd9b295079fe91cb4d284f43c5df2c9eeeb8";

app.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        //Update the order
        const session = event.data.object;
        const { orderId } = session.metadata;
        const paymentStatus = session.payment_status;
        const paymentMethod = session.payment_method_types[0];
        const totalAmount = session.amount_total;
        const currency = session.currency;

        //Find the order
        const order = await Order.findByIdAndUpdate(JSON.parse(orderId), {
            totalPrice: totalAmount / 100,
            currency,
            paymentMethod,
            paymentStatus,
        }, {
            new: true
        });

        await order.save();

    } else {
        return
    }
    // switch (event.type) {
    //     case 'payment_intent.succeeded':
    //         const paymentIntentSucceeded = event.data.object;
    //         // Then define and call a function to handle the event payment_intent.succeeded
    //         break;
    //     // ... handle other event types
    //     default:
    //         console.log(`Unhandled event type ${event.type}`);
    // }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
});

//pass incoming data
app.use(express.json());

//routes
app.use('/api/v1/users/', userRoutes);
app.use('/api/v1/products/', productsRoutes);
app.use('/api/v1/categories/', catergoriesRouter);
app.use('/api/v1/brands/', brandsRouter);
app.use('/api/v1/colors/', colorsRouter);
app.use('/api/v1/reviews/', reviewRouter);
app.use('/api/v1/orders/', orderRouter);
app.use('/api/v1/coupons/', couponsRouter);

//err middlewares
app.use(notFound);
app.use(globalErrorHandler);

export default app;