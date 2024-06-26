const Product = require('../models/productModel');

// Filter, sorting and paginating

class APIfeatures {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}

	filtering() {
		const queryObj = { ...this.queryString }; // queryString = req.query
		const excludedFields = ['page', 'sort', 'limit'];
		excludedFields.forEach((el) => delete queryObj[el]);

		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(
			/\b(gte|gt|lt|lte|regex)\b/g,
			(match) => '$' + match,
		);

		this.query.find(JSON.parse(queryStr));

		return this;
	}

	sorting() {
		if (this.queryString.sort) {
			const sortBy = this.queryString.sort.split(',').join(' ');
			this.query = this.query.sort(sortBy);
		} else {
			this.query = this.query.sort('-createdAt');
		}

		return this;
	}

	paginating() {
		const page = this.queryString.page * 1 || 1;
		const limit = this.queryString.limit * 1;
		// const limit = this.queryString.limit * 1 || 9;

		const skip = (page - 1) * limit;
		this.query = this.query.skip(skip).limit(limit);

		return this;
	}
}

// Get ALl Products
exports.getProducts = async (req, res) => {
	try {
		const features = new APIfeatures(Product.find(), req.query)
			.filtering()
			.sorting()
			.paginating();
		const products = await features.query;

		res.json({
			status: 'success',
			result: products.length,
			products: products,
		});
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
};

exports.getEachSellerListedProducts = async (req, res) => {
	try {
		const products = await Product.find({ userId: req.user.id });
		res.status(200).json({
			products,
		});
	} catch (error) {
		return res.status(500).json({ msg: err.message });
	}
};

// Create a new Product by seller only
exports.createProduct = async (req, res) => {
	try {
		const {
			product_id,
			title,
			price,
			description,
			images,
			category,
			pageCount,
			authors,
		} = req.body;

		const productExists = await Product.findOne({ product_id });
		if (productExists)
			return res.status(400).json({ msg: 'This product already exists.' });

		const product = await Product.create({
			product_id,
			title,
			price,
			description,
			images,
			category,
			pageCount,
			authors,
			userId: req.user.id,
		});

		res.status(201).json({
			status: 'success',
			data: {
				product,
			},
		});
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
};

exports.getProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product)
			return res.status(404).json({
				status: 'Not Found',
				message: 'Product not found',
			});

		response.status(200).json({
			status: 'success',
			data: {
				product,
			},
		});
	} catch (err) {
		return res.status(500).json({ msg: err });
	}
};

// Delete an existing product
exports.deleteProduct = async (req, res) => {
	try {
		await Product.findByIdAndDelete(req.params.id);

		res.status(204).json({
			status: 'success',
			data: null,
		});
	} catch (err) {
		return res.status(500).json({ msg: err });
	}
};

// Update an existing product
exports.updateProduct = async (req, res) => {
	try {
		const updatedProduct = await Product.findByIdAndUpdate(
			req.params.id,
			req.body,
		);

		res.status(200).json({
			status: 'success',
			data: {
				product: updatedProduct,
			},
		});
	} catch (err) {
		return res.status(500).json({ msg: err });
	}
};
