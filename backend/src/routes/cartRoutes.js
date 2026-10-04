const express = require('express');
const router = express.Router();
const { getCart, addItemToCart } = require('../controllers/cartController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getCart);
router.post('/items', verifyToken, addItemToCart);

module.exports = router;
