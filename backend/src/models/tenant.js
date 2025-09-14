const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Tenant', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    shopDomain: DataTypes.STRING,
    accessToken: DataTypes.TEXT,
    email: DataTypes.STRING
  }, { tableName: 'tenants', timestamps: true });
};