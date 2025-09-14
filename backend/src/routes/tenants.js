const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Tenant } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

router.post('/onboard', async (req, res) => {
  try {
    const { name, shopDomain, accessToken, email } = req.body;
    if (!shopDomain) return res.status(400).json({ error: 'shopDomain required' });

    const tenant = await Tenant.create({ name, shopDomain, accessToken, email });

    const token = jwt.sign({ tenantId: tenant.id, email: tenant.email }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ tenant, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'onboard failed', details: err.message });
  }
});

router.get('/', async (req, res) => {
  const tenants = await Tenant.findAll();
  res.json(tenants);
});

module.exports = router;
