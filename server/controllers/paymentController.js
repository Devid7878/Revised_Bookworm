const Payments = require('../models/paymentModel');
const Users = require('../models/userModel');
const Products = require('../models/productModel');
const productModel = require('../models/productModel');

async function createPayment(req, res) {
	try {
		const user = await Users.findById(req.user.id).select('name email');
		if (!user) return res.status(400).json({ msg: 'User does not exist.' });

		const { cart, address } = req.body;
		const { _id, name, email } = user;

		// Validate the products in the cart
		for (const item of cart) {
			const product = await Products.findById(item._id);
			if (!product || product.userId.toString() !== item.userId.toString()) {
				return res.status(400).json({ msg: 'Invalid product in cart.' });
			}
			// update the sold count in products model whenever a payment is created
			sold(req.user.id, item._id, item.quantity, product.sold);
		}

		// Calculate total amount to be paid
		const totalAmount = calculateTotal(cart);

		// Create payment entry
		const newPayment = new Payments({
			userId: _id,
			name,
			email,
			cart,
			address,
			totalAmount,
			paymentID: Date.now(),
		});

		// Save payment to database
		await newPayment.save();

		// Distribute payments to sellers
		await distributePayments(cart);

		res.status(201).json({ payment: newPayment, msg: 'Payment success.' });
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
}

// Function to calculate total amount based on cart items
function calculateTotal(cart) {
	let total = 0;
	for (const item of cart) {
		total += item.price * item.quantity;
	}
	return total;
}

// Function to distribute payments to sold
async function distributePayments(cart) {
	// Group cart items by sellerId
	const groupedBySeller = groupCartBySeller(cart);

	// Iterate over each seller and calculate their share of payment
	for (const userId in groupedBySeller) {
		const sellerProducts = groupedBySeller[userId];
		// In first iteration first seller then the second seller and so on
		const seller = await Users.findById(userId);
		if (seller) {
			const totalAmountForSeller = calculateTotal(sellerProducts);
			// Distribute payment to seller (e.g., record payment due amount)
		}
	}
}

// Function to group cart items by sellerId
function groupCartBySeller(cart) {
	const grouped = {};
	for (const item of cart) {
		if (!grouped[item.userId]) {
			grouped[item.userId] = [];
		}
		grouped[item.userId].push(item);
	}
	return grouped;
}

// Function to get payments for a specific seller (based on userId)
async function getPayments(req, res) {
	try {
		const productsListedByThatSeller = await Products.find({
			userId: req.user.id,
		});
		const productIds = productsListedByThatSeller.map((product) =>
			product._id.toString(),
		);
		const payments = await Payments.find({
			$and: [
				{ 'cart._id': { $in: productIds } }, // At least one product belongs to the seller
				{ 'cart.userId': { $ne: { $nin: productIds } } }, // No product belongs to other sellers
			],
		});
		// Extract only the products from the cart in each order
		const orders = payments.map((payment) => ({
			cart: payment.cart.filter((item) =>
				productIds.includes(item._id.toString()),
			),
			status: payment.status,
			_id: payment._id,
			userId: payment.userId,
			name: payment.name,
			email: payment.email,
			address: payment.address,
			createdAt: payment.createdAt,
			updatedAt: payment.updatedAt,
		}));

		res.status(200).json(orders);
	} catch (err) {
		res.status(500).json({ msg: err.message });
	}
}

// Function to update product sold quantity
const sold = async (sellerId, productId, quantity, oldSold) => {
	try {
		// Find the product to update
		const product = await Products.findOne({
			_id: productId,
		});
		// If the product is found, update the sold quantity
		if (product) {
			await Products.findByIdAndUpdate(productId, { sold: quantity + oldSold });
		} else {
			throw new Error('Product not found or does not belong to the seller.');
		}
	} catch (err) {
		throw new Error(`Failed to update sold quantity: ${err.message}`);
	}
};

module.exports = {
	getPayments,
	createPayment,
};
