const router = require('express').Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');
const authSeller = require('../middleware/authSeller');

router
	.route('/payment')
	.get(auth, authSeller, paymentController.getPayments)
	.post(auth, paymentController.createPayment);

module.exports = router;
