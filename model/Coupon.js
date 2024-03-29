import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CouponSchema = new Schema({
    code: {
        type: String,
        requried: true,
    },
    startDate: {
        type: Date,
        requried: true,
    },
    endDate: {
        type: String,
        requried: true,
    },
    discount: {
        type: Number,
        required: true,
        default: 0,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

//Virtual
//coupon expired
CouponSchema.virtual('isExpired').get(function () {
    return this.endDate < Date.now();
});

CouponSchema.virtual('daysLeft').get(function () {
    const daysLeft = Math.ceil((this.endDate - Date.now()) / (1000 * 60 * 60 * 24)) + ' Days left';
    return daysLeft;
});


//Validations
CouponSchema.pre('validate', function (next) {
    if (this.endDate < this.startDate) {
        next(new Error('End date cannot be less than start date'))
    } else {
        next();
    }
});

CouponSchema.pre('validate', function (next) {
    if (this.discount <= 0 || this.discount > 100) {
        next(new Error('Discount only between 0 & 100'))
    } else {
        next();
    }
});

CouponSchema.pre('validate', function (next) {
    if (this.startDate < Date.now()) {
        next(new Error('Start date cannot be less than current date'))
    } else {
        next();
    }
});




const Coupon = mongoose.model('Coupon', CouponSchema);
export default Coupon;