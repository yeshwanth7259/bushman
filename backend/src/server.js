require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const initWooCommerce = require('./config/wooCommerce');
const initFirebase = require('./config/firebase');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    initWooCommerce();
    initFirebase();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
