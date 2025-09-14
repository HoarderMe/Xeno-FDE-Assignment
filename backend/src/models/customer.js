const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Customer', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tenantId: DataTypes.INTEGER,
    shopifyCustomerId: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    createdAtShopify: DataTypes.DATE
  }, { tableName: 'customers', timestamps: true });
};