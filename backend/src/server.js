require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const tenantsRouter = require('./routes/tenants');
const authRouter = require('./routes/auth');
const syncRouter = require('./routes/sync');
const webhooksRouter = require('./routes/webhooks');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/tenants', tenantsRouter);
app.use('/api/auth', authRouter);
app.use('/api/sync', syncRouter);
app.use('/api/webhooks', webhooksRouter);

const PORT = process.env.PORT || 4000;

(async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('DB connected')

    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  } catch (err) {
    console.error('Failed to start', err);
  }
})();