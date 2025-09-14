const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Tenant } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

router.post('/login', async (req, res) => {
  try {
    const { tenantId, email } = req.body;
    if (!tenantId || !email) return res.status(400).json({ error: 'tenantId & email required' });

    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) return res.status(404).json({ error: 'tenant not found' });

    if (tenant.email && tenant.email !== email) return res.status(401).json({ error: 'invalid email' });

    const token = jwt.sign({ tenantId: tenant.id, email }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, tenant });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'login failed', details: err.message });
  }
});

module.exports = router;