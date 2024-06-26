const router = require('express').Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const authSeller = require('../middleware/authSeller');

router.post('/register', userController.register);

router.post('/login', userController.login);

router.get('/logout', userController.logout);

router.get('/refresh_token', userController.refreshToken);

router.get('/infor', auth, userController.getUser);

router.patch('/emptyCart', auth, userController.emptyCart);

router.get('/', userController.getAllUsers);

router.delete('/:id', userController.deleteUser);

router.patch('/addcart', auth, userController.addToCart);

router.get('/history', auth, userController.history);
router.patch('/history', auth, authSeller, userController.updateHistory);

module.exports = router;
