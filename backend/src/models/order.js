const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tenantId: DataTypes.INTEGER,
    shopifyOrderId: DataTypes.STRING,
    customerId: DataTypes.INTEGER,
    totalPrice: DataTypes.DECIMAL(12,2),
    currency: DataTypes.STRING,
    createdAtShopify: DataTypes.DATE
  }, { tableName: 'orders', timestamps: true });
};