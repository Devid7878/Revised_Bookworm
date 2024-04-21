const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
	{
		product_id: {
			type: String,
			unique: true,
			trim: true,
			required: [true, 'Product Id is required and must be unique!'],
		},
		title: {
			type: String,
			required: [true, 'Title of a product is required!'],
			trim: true,
		},
		titleLowerCase: {
			type: String,
			lowercase: true,
		},
		price: {
			type: Number,
			required: [true, 'A product must have a price!'],
			trim: true,
		},
		description: {
			type: String,
			required: true,
		},
		images: {
			type: Object,
			required: [true, 'A product must have images!'],
		},
		category: {
			type: String,
			required: [true, 'A product must have a category'],
		},
		checked: {
			type: Boolean,
			default: false,
		},
		sold: {
			type: Number,
			default: 0,
		},
		pageCount: {
			type: Number,
			required: [true, 'Page count is a required field!'],
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		publishedDate: Date,
		authors: [String],
	},
	{
		timestamps: true,
	},
);

productSchema.pre('save', function (next) {
	this.titleLowerCase = this.title.toLowerCase();
	next();
});

module.exports = mongoose.model('Product', productSchema);
