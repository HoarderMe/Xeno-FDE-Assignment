const { Tenant, Customer, Order, Product, sequelize } = require('../models');
const { createShopifyClient } = require('./shopifyClient');
const { QueryTypes } = require('sequelize');

async function syncFull(req, res) {
  try {
    const tenantId = req.body.tenantId || req.query.tenantId;
    if (!tenantId) return res.status(400).json({ error: 'tenantId required' });

    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) return res.status(404).json({ error: 'tenant not found' });

    const client = createShopifyClient(tenant.shopDomain, tenant.accessToken);

    const customers = await client.fetchCustomers();
    for (const c of customers) {
      await Customer.upsert({
        tenantId: tenant.id,
        shopifyCustomerId: String(c.id),
        firstName: c.first_name || c.firstName,
        lastName: c.last_name || c.lastName,
        email: c.email,
        createdAtShopify: c.created_at || null
      }, { where: { tenantId: tenant.id, shopifyCustomerId: String(c.id) }});
    }

    const products = await client.fetchProducts();
    for (const p of products) {
      const price = (p.variants && p.variants[0]) ? p.variants[0].price : null;
      await Product.upsert({
        tenantId: tenant.id,
        shopifyProductId: String(p.id),
        title: p.title,
        price
      }, { where: { tenantId: tenant.id, shopifyProductId: String(p.id) }});
    }

    const orders = await client.fetchOrders();
    for (const o of orders) {
      let customerRecord = null;
      if (o.customer && o.customer.id) {
        customerRecord = await Customer.findOne({ where: { tenantId: tenant.id, shopifyCustomerId: String(o.customer.id) }});
      }
      await Order.upsert({
        tenantId: tenant.id,
        shopifyOrderId: String(o.id),
        customerId: customerRecord ? customerRecord.id : null,
        totalPrice: o.total_price || o.total || 0,
        currency: o.currency || 'USD',
        createdAtShopify: o.created_at || null
      }, { where: { tenantId: tenant.id, shopifyOrderId: String(o.id) }});
    }

    return res.json({ ok: true, counts: { customers: customers.length, products: products.length, orders: orders.length }});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'sync failed', details: err.message });
  }
}

async function metrics(req, res) {
  try {
    const tenantId = req.params.tenantId;
    if (!tenantId) return res.status(400).json({ error: 'tenantId required' });

    const totalCustomers = await Customer.count({ where: { tenantId }});
    const totalOrders = await Order.count({ where: { tenantId }});
    const totalRevenueRow = await sequelize.query(
      'SELECT IFNULL(SUM(totalPrice),0) as revenue FROM orders WHERE tenantId = :t',
      { replacements: { t: tenantId }, type: QueryTypes.SELECT }
    );
    const totalRevenue = totalRevenueRow && totalRevenueRow[0] ? Number(totalRevenueRow[0].revenue) : 0;

    const ordersByDate = await sequelize.query(
      `SELECT DATE(createdAtShopify) as date, COUNT(*) as count, IFNULL(SUM(totalPrice),0) as revenue
       FROM orders WHERE tenantId = :t GROUP BY DATE(createdAtShopify) ORDER BY date ASC`,
      { replacements: { t: tenantId }, type: QueryTypes.SELECT }
    );

    const topCustomers = await sequelize.query(
      `SELECT c.id, c.firstName, c.lastName, c.email, IFNULL(SUM(o.totalPrice),0) as total_spend
       FROM customers c LEFT JOIN orders o ON o.customerId = c.id
       WHERE c.tenantId = :t GROUP BY c.id ORDER BY total_spend DESC LIMIT 5`,
      { replacements: { t: tenantId }, type: QueryTypes.SELECT }
    );

    return res.json({ totalCustomers, totalOrders, totalRevenue, ordersByDate, topCustomers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'metrics failed', details: err.message });
  }
}

module.exports = { syncFull, metrics };