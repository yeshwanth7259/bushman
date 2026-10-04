const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllOrders, updateOrderStatus } = require('../controllers/adminController');
const { verifyToken } = require('../middleware/authMiddleware');

// In production, we'd add an isAdmin middleware here to verify role === 'ADMIN'
// const isAdmin = (req, res, next) => { ... }
// router.use(verifyToken, isAdmin); 

// For development, just verifyToken
router.get('/dashboard', verifyToken, getDashboardStats);
router.get('/orders', verifyToken, getAllOrders);
router.put('/orders/:id/status', verifyToken, updateOrderStatus);

module.exports = router;
