const Users = require('../models/userModel');

const authSeller = async (req, res, next) => {
	try {
		console.log('user');
		// Get user information by id
		const user = await Users.findOne({
			_id: req.user.id,
		});

		if (user.role === 0 || user.role === 2) {
			return res.status(400).json({ msg: 'Seller resources access denied.' });
		}
		next();
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
};

module.exports = authSeller;
