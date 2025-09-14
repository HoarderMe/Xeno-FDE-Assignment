const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { Tenant, Customer, Order } = require('../models');

router.post('/orders/create', bodyParser.json(), async (req, res) => {
  try {
    const payload = req.body;
    const shop = req.headers['x-shopify-shop-domain'] || payload.shop_domain;
    if (!shop) return res.status(400).send('no shop header');

    const tenant = await Tenant.findOne({ where: { shopDomain: shop }});
    if (!tenant) return res.status(404).send('tenant not found');

    if (payload.customer && payload.customer.id) {
      await Customer.upsert({
        tenantId: tenant.id,
        shopifyCustomerId: String(payload.customer.id),
        firstName: payload.customer.first_name,
        lastName: payload.customer.last_name,
        email: payload.customer.email,
        createdAtShopify: payload.customer.created_at
      });
    }

    await Order.upsert({
      tenantId: tenant.id,
      shopifyOrderId: String(payload.id),
      customerId: null,
      totalPrice: payload.total_price,
      currency: payload.currency,
      createdAtShopify: payload.created_at
    });

    return res.status(200).send('ok');
  } catch (err) {
    console.error('webhook error', err);
    return res.status(500).send('err');
  }
});

module.exports = router;