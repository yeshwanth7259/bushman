const Order = require('../models/Order');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ordersToday = await Order.countDocuments({ createdAt: { $gte: today } });
    const newCustomers = await User.countDocuments({ createdAt: { $gte: today }, role: 'CUSTOMER' });
    
    const salesToday = await Order.aggregate([
      { $match: { createdAt: { $gte: today }, status: { $ne: 'CANCELLED' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name phone');

    res.json({
      success: true,
      stats: {
        ordersToday,
        salesToday: salesToday.length > 0 ? salesToday[0].total : 0,
        newCustomers
      },
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name phone');
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    
    // In production, we might want to also update WooCommerce order status here via api.put('orders/:id', {status})
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardStats, getAllOrders, updateOrderStatus };
