const fs = require('fs');
const path = require('path');

const dirs = [
  'src/config',
  'src/models',
  'src/controllers',
  'src/routes',
  'src/middleware',
  'src/services'
];

dirs.forEach(d => fs.mkdirSync(path.join(__dirname, d), { recursive: true }));

const files = {
  '.env': `PORT=5000
MONGODB_URI=mongodb+srv://<db_username>:<db_password>@cluster0.qrgrflp.mongodb.net/?appName=Cluster0&compressors=zlib
WC_URL=https://bushmanmeat.com
WC_CONSUMER_KEY=ck_0f4b30002e9752647fc3411c9d03955bbbb2eca2
WC_CONSUMER_SECRET=cs_ddaafec68737f3a7d2902097884be5428a9a9879
`,
  '.gitignore': `node_modules
.env
`,
  'src/app.js': `const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Bushman API is running' });
});

module.exports = app;
`,
  'src/server.js': `require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
// const initWooCommerce = require('./config/wooCommerce');
// const initFirebase = require('./config/firebase');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(\`Server is running on port \${PORT}\`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
`,
  'src/config/database.js': `const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(\`MongoDB Connected: \${conn.connection.host}\`);
    return conn;
  } catch (error) {
    console.error(\`Error: \${error.message}\`);
    process.exit(1);
  }
};

module.exports = connectDB;
`,
  'src/config/wooCommerce.js': `const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;

let api;

const initWooCommerce = () => {
  if (!api) {
    api = new WooCommerceRestApi({
      url: process.env.WC_URL,
      consumerKey: process.env.WC_CONSUMER_KEY,
      consumerSecret: process.env.WC_CONSUMER_SECRET,
      version: 'wc/v3'
    });
    console.log('WooCommerce API Initialized');
  }
  return api;
};

module.exports = initWooCommerce;
`,
  'src/config/firebase.js': `const admin = require('firebase-admin');

// Ensure you download the serviceAccountKey.json from Firebase Console
// and place it in the config folder or reference it via ENV
const initFirebase = () => {
  if (!admin.apps.length) {
    // For now, we will wait for the service account json to be provided.
    // admin.initializeApp({
    //   credential: admin.credential.cert(serviceAccount)
    // });
    console.log('Firebase Admin will be initialized once service account is provided.');
  }
  return admin;
};

module.exports = initFirebase;
`
};

Object.entries(files).forEach(([filepath, content]) => {
  fs.writeFileSync(path.join(__dirname, filepath), content);
});

console.log("Backend scaffolding complete.");
