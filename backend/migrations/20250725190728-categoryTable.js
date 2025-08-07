'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS categories 
      (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        icon VARCHAR(100),
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
        )`)

      await queryInterface.sequelize.query(`
        ALTER TABLE expenses
          ADD COLUMN "categoryId" INTEGER REFERENCES categories(id)
          ON UPDATE CASCADE
          ON DELETE SET NULL
      `)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP TABLE categories `);
    await queryInterface.sequelize.query('ALTER TABLE expense DROP column categoryId ')
  }
};
