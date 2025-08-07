'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load configuration and logger
const config = require('../config/database'); 
const logger = require('../utils/logger');

// Environment setup
const env = process.env.NODE_ENV || 'production';
dotenv.config({ path: path.resolve(__dirname, './../.env') });

// Database configuration for current environment
const dbConfig = config[env];
const basename = path.basename(__filename);

// Initialize empty database object
const db = {};

// Create Sequelize instance (connection pool is created here)
const sequelize = new Sequelize(dbConfig);

// Load all model files from current directory
fs.readdirSync(__dirname)
 .filter(file => {
   return (
     file.indexOf('.') !== 0 &&        // Skip hidden files
     file !== basename &&              // Skip this index file
     file.slice(-3) === '.js' &&       // Only .js files
     !file.endsWith('.test.js')        // Skip test files
   );
 })
 .forEach(file => {
   // Require each model file and initialize it
   const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
   db[model.name] = model;
 });

// Set up model associations (relationships between tables)
Object.values(db).forEach(model => {
 if (typeof model.associate === 'function') {
   model.associate(db);
 }
});

// Add Sequelize instance and constructor to db object
db.sequelize = sequelize;  // Instance for queries, transactions, etc.
db.Sequelize = Sequelize;  // Constructor for data types, operators, etc.

// Test database connection (non-blocking)
sequelize.authenticate()
 .then(() => {
   logger.info('✅ Database connection established successfully.');
 })
 .catch(error => {
   logger.error('❌ Database connection failed:', error.message);
 });

// Export the complete database object
module.exports = db;