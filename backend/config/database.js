require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'expense_tracker',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  production: {
    database: process.env.AZURE_DBNAME,
    username: process.env.AZURE_USERNAME,
    password: process.env.AZURE_DB_PASSWORD,
    host: process.env.AZURE_DB_HOST,
    dialect: 'mssql',
    port: 1433,
    logging: false,
    dialectOptions: {
      options: {
        encrypt: true,
        trustServerCertificate: false,
        enableArithAbort: true,
        connectTimeout: 60000,
        requestTimeout: 60000,
      },
    }
  }
}