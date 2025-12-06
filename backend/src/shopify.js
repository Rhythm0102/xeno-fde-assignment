const { shopifyApi, Session } = require('@shopify/shopify-api');
require('@shopify/shopify-api/adapters/node');

const shopify = shopifyApi({
    apiKey: process.env.SHOPIFY_API_KEY || 'test_key',
    apiSecretKey: process.env.SHOPIFY_API_SECRET || 'test_secret',
    scopes: ['read_products', 'read_customers', 'read_orders'],
    hostName: 'localhost:4000',
    apiVersion: '2024-04',
    isEmbeddedApp: false,
});

const getSession = (shop, accessToken) => {
    return new Session({
        id: `offline_${shop}`,
        shop: shop,
        state: 'state',
        isOnline: false,
        accessToken: accessToken,
    });
};

module.exports = { shopify, getSession };
