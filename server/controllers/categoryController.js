const Category = require('../models/categoryModel');
const Products = require('../models/productModel');

// Function to get all categories
async function getCategories(req, res) {
	try {
		const categories = await Category.find();
		res.json(categories);
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
}

// Function to create a new category
async function createCategory(req, res) {
	try {
		const { name } = req.body;
		const category = await Category.findOne({ name });
		if (category)
			return res.status(400).json({ msg: 'This category already exists.' });

		const newCategory = await Category({ name });
		await newCategory.save();
		res.json({
			category: newCategory,
			msg: 'Created a category.',
		});
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
}

// Function to delete a category
async function deleteCategory(req, res) {
	try {
		const products = await Products.findOne({ category: req.params.id });
		if (products)
			return res
				.status(400)
				.json({ msg: 'Please delete all products with a relationship.' });

		await Category.findByIdAndDelete(req.params.id);
		res.json({ msg: 'Deleted a category.' });
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
}

// Function to update a category
async function updateCategory(req, res) {
	try {
		const { name } = req.body;
		await Category.findOneAndUpdate({ _id: req.params.id }, { name });

		const updatedCategory = await Category.findById(req.params.id);

		res.json({ category: updatedCategory, msg: 'Updated a category.' });
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
}

module.exports = {
	getCategories,
	createCategory,
	deleteCategory,
	updateCategory,
};
