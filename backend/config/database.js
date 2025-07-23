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
  database: process.env.AWS_DBNAME,
  username: process.env.AWS_USERNAME,
  password: process.env.AWS_PASSWORD,
  host: process.env.AWS_HOST,
  dialect: process.env.AWS_DIALECT,
  port: process.env.AWS_PORT || 5432, // PostgreSQL default port
  logging: (sql, queryObject) => {
    console.log('=== SQL QUERY ===');
    console.log('Query:', sql);
    
    // Log parameters if available
    if (queryObject && queryObject.bind) {
      console.log('Parameters:', queryObject.bind);
    }
    
    // Try to show replacements
    if (queryObject && queryObject.replacements) {
      console.log('Replacements:', queryObject.replacements);
    }
    
    console.log('==================');
  },
  dialectOptions: {
    ssl: {
      require: false,
      rejectUnauthorized: false
    }
  }
}
}