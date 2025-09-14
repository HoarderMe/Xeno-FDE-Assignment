const axios = require('axios');
require('dotenv').config();

const USE_REAL = process.env.USE_SHOPIFY_REAL === 'true';

function createRealShopifyClient(shopDomain, accessToken) {
  const baseURL = `https://${shopDomain}/admin/api/2024-10`;
  const instance = axios.create({
    baseURL,
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    timeout: 20000
  });

  return {
    async fetchCustomers() {
      const r = await instance.get('/customers.json?limit=250');
      return r.data.customers || [];
    },
    async fetchOrders() {
      const r = await instance.get('/orders.json?status=any&limit=250');
      return r.data.orders || [];
    },
    async fetchProducts() {
      const r = await instance.get('/products.json?limit=250');
      return r.data.products || [];
    }
  };
}

function createSimulatedClient() {
  return {
    async fetchCustomers() {
      return [
        { id: 111, first_name: 'Alice', last_name: 'A', email: 'alice@example.com', created_at: new Date().toISOString() },
        { id: 222, first_name: 'Bob', last_name: 'B', email: 'bob@example.com', created_at: new Date().toISOString() }
      ];
    },
    async fetchOrders() {
      return [
        { id: 9001, total_price: '29.99', currency: 'USD', created_at: new Date().toISOString(), customer: { id: 111 } },
        { id: 9002, total_price: '59.99', currency: 'USD', created_at: new Date().toISOString(), customer: { id: 222 } }
      ];
    },
    async fetchProducts() {
      return [
        { id: 5001, title: 'T-Shirt', variants: [{ price: '19.99' }] },
        { id: 5002, title: 'Sneakers', variants: [{ price: '49.99' }] }
      ];
    }
  };
}

function createShopifyClient(shopDomain, accessToken) {
  if (USE_REAL && shopDomain && accessToken) {
    return createRealShopifyClient(shopDomain, accessToken);
  }
  return createSimulatedClient();
}

module.exports = { createShopifyClient };
