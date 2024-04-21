const router = require('express').Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const authSeller = require('../middleware/authSeller');

router
	.route('/products')
	.get(productController.getProducts)
	.post(auth, authSeller, productController.createProduct);

router
	.route('/seller-listed-products')
	.get(auth, authSeller, productController.getEachSellerListedProducts);

router
	.route('/products/:id')
	.get(productController.getProduct)
	.delete(productController.deleteProduct)
	.put(productController.updateProduct);

module.exports = router;
