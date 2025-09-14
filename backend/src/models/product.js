const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tenantId: DataTypes.INTEGER,
    shopifyProductId: DataTypes.STRING,
    title: DataTypes.STRING,
    price: DataTypes.DECIMAL(12,2)
  }, { tableName: 'products', timestamps: true });
};