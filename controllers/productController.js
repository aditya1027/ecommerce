import asyncHandler from 'express-async-handler';
import Product from '../model/Product.js';
import Category from '../model/Category.js';
import Brand from '../model/Brand.js';

export const createProduct = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        category,
        sizes,
        colors,
        price,
        brand,
        totalQty,
    } = req.body;

    //Product exists
    const productExists = await Product.findOne({ name });
    if (productExists) {
        throw new Error('Product Already exists');
    }

    //find the catergory
    const categoryFound = await Category.findOne({
        name: category
    });
    if (!categoryFound) {
        throw new Error(
            "Category not found, please create category first or check category name"
        )
    }

    //find the brand
    const brandFound = await Brand.findOne({
        name: brand.toLowerCase()
    });
    if (!brandFound) {
        throw new Error(
            "Brand not found, please create brand first or check category name"
        )
    }

    const product = await Product.create({
        name,
        description,
        category,
        sizes,
        colors,
        user: req.userAuthId,
        price,
        brand,
        totalQty,
    });

    //Push the product into category
    categoryFound.products.push(product._id);
    //re-save
    await categoryFound.save();

    //Push the product into brand
    brandFound.products.push(product._id);
    //re-save
    await brandFound.save();

    res.json({
        status: 1,
        message: 'Product created successfully',
        product,
    })
});


//Get all products
export const getProducts = asyncHandler(async (req, res) => {
    //Query
    let productQuery = Product.find()

    //Search by name
    if (req.query.name) {
        productQuery = productQuery.find({
            name: { $regex: req.query.name, $options: 'i' }
        })
    }

    //Filter by brand
    if (req.query.brand) {
        productQuery = productQuery.find({
            brand: { $regex: req.query.brand, $options: 'i' }
        })
    }

    //Filter by category
    if (req.query.category) {
        productQuery = productQuery.find({
            category: { $regex: req.query.category, $options: 'i' }
        })
    }

    //Filter by colors
    if (req.query.colors) {
        productQuery = productQuery.find({
            colors: { $regex: req.query.colors, $options: 'i' }
        })
    }

    //Filter by sizes
    if (req.query.sizes) {
        productQuery = productQuery.find({
            sizes: { $regex: req.query.sizes, $options: 'i' }
        })
    }

    //Filter by price
    if (req.query.price) {
        const priceRange = req.query.price.split('-');
        productQuery = productQuery.find({
            price: { $gte: priceRange[0], $lte: priceRange[1] }
        })
    }

    //Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Product.countDocuments();

    productQuery = productQuery.skip(startIndex).limit(endIndex);

    //pagination results
    const pagination = {}

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        }
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        }
    }

    //Await the query
    const products = await productQuery.populate('reviews');

    res.json({
        status: 1,
        total,
        results: products.length,
        pagination,
        products,
    })
});


//Get single product
export const getProduct = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const product = await Product.findById(id).populate('reviews');
    if (!product) {
        throw new Error('Product Not found');
    }
    res.json({
        status: 1,
        message: 'Product found',
        product
    });
});


//Update single product
export const updateProduct = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        category,
        sizes,
        colors,
        user,
        price,
        brand,
        totalQty,
    } = req.body;

    //update
    const product = await Product.findByIdAndUpdate(req.params.id, {
        name,
        description,
        category,
        sizes,
        colors,
        user,
        price,
        brand,
        totalQty,
    }, {
        new: true
    });

    res.json({
        status: 1,
        message: 'Product updated',
        product
    });
});

//Delete product
export const deleteProduct = asyncHandler(async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({
        status: 1,
        message: 'Product delteted',
    });
});


