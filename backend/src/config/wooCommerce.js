const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;

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
