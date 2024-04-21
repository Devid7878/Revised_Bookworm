const router = require('express').Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const authSeller = require('../middleware/authSeller');

router
	.route('/category')
	.get(categoryController.getCategories)
	.post(auth, authSeller, categoryController.createCategory);

router
	.route('/category/:id')
	.delete(auth, authAdmin, categoryController.deleteCategory)
	.put(auth, authSeller, categoryController.updateCategory);

module.exports = router;
