const sequelize = require('../config/database');

const TenantModel = require('./tenant');
const CustomerModel = require('./customer');
const OrderModel = require('./order');
const ProductModel = require('./product');

const Tenant = TenantModel(sequelize);
const Customer = CustomerModel(sequelize);
const Order = OrderModel(sequelize);
const Product = ProductModel(sequelize);

// associations
Tenant.hasMany(Customer, { foreignKey: 'tenantId' });
Customer.belongsTo(Tenant, { foreignKey: 'tenantId' });

Tenant.hasMany(Order, { foreignKey: 'tenantId' });
Order.belongsTo(Tenant, { foreignKey: 'tenantId' });
Order.belongsTo(Customer, { foreignKey: 'customerId' });

Tenant.hasMany(Product, { foreignKey: 'tenantId' });
Product.belongsTo(Tenant, { foreignKey: 'tenantId' });

module.exports = { sequelize, Tenant, Customer, Order, Product };