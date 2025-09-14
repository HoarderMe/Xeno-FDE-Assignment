const express = require('express');
const router = express.Router();
const { syncFull, metrics } = require('../controllers/syncController');

router.post('/sync-full', syncFull);

router.get('/metrics/:tenantId', metrics);

module.exports = router;
