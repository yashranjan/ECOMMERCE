//Importing required packages
const express = require('express');

//Importing products controller
const shopController = require('../controllers/shop');

// Importing authentication middleware
const isAuth = require('../middleware/is-auth');

//Creating router object
const router = express.Router();

//Routes
router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

// router.get('/checkout', isAuth, shopController.getCheckout);

router.get('/orders', isAuth, shopController.getOrders);

router.post('/create-order', isAuth, shopController.postOrder);

router.get('/orders/:orderId', isAuth, shopController.getInvoice);

//Exporting shop.js to firstapp.js
module.exports = router;
