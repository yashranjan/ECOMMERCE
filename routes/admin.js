//Importing required packages
const express = require('express');
const { body } = require('express-validator');

//Importing admin controller
const adminController = require('../controllers/admin');

// Importing authentication middleware
const isAuth = require('../middleware/is-auth');

//Creating router object
const router = express.Router();

//Routes
router.get('/add-product', isAuth, adminController.getAddProduct);

router.get('/products', isAuth, adminController.getProducts);

router.post(
  '/add-product',
  [
    body('title', 'Title should be atleast 3 characters long')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('price', 'Enter valid price').isFloat(),
    body(
      'description',
      'Description should be minimum 8 characters and maximum 400 characters'
    )
      .isLength({ min: 8, max: 400 })
      .trim()
  ],
  isAuth,
  adminController.postAddProduct
);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post(
  '/edit-product',
  [
    body('title', 'Title should be atleast 3 characters long')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('price', 'Enter valid price').isFloat(),
    body(
      'description',
      'Description should be minimum 8 characters and maximum 400 characters'
    )
      .isLength({ min: 8, max: 400 })
      .trim()
  ],
  isAuth,
  adminController.postEditProduct
);

router.delete('/product/:productId', isAuth, adminController.deleteProduct);

//Exporting admin.js to firstapp.js
module.exports = router;
