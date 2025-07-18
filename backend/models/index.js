const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';

const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig
);

// Import models
const Expense = require('./Expense')(sequelize, Sequelize.DataTypes);

// Define associations here if needed
// Example: User.hasMany(Expense);

const db = {
  sequelize,
  Sequelize,
  Expense
};

module.exports = db;