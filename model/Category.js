import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: {
        type: String,
        default: 'https://www.shutterstock.com/image-vector/ui-image-placeholder-wireframes-apps-websites-1037719204',
        required: true
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        }
    ]
}, { timestamps: true });

const Category = mongoose.model('Category', CategorySchema);

export default Category;