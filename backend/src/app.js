const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Bushman API is running' });
});

const initWooCommerce = require('./config/wooCommerce');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Database health check
app.get('/api/health/database', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  if (isConnected) {
    res.json({ success: true, database: 'connected' });
  } else {
    res.status(500).json({ success: false, database: 'disconnected' });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authRoutes); // getMe handles /api/users/me
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// WooCommerce Products
app.get('/api/products', async (req, res) => {
  try {
    const api = initWooCommerce();
    const response = await api.get('products', { per_page: 20 });
    res.json({ success: true, products: response.data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// WooCommerce Categories
app.get('/api/categories', async (req, res) => {
  try {
    const api = initWooCommerce();
    const response = await api.get('products/categories', { per_page: 20 });
    res.json({ success: true, categories: response.data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = app;
