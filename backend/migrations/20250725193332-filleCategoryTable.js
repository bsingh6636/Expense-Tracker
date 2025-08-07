'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      INSERT INTO categories (name , "createdAt" , "updatedAt")
      VALUES
      ('food', NOW(), NOW()),
      ('transport', NOW(), NOW()),
      ('entertainment', NOW(), NOW()),
      ('utilities', NOW(), NOW()),
      ('healthcare', NOW(), NOW()),
      ('shopping', NOW(), NOW()),
      ('education', NOW(), NOW()),
      ('travel', NOW(), NOW()),
      ('cig', NOW(), NOW()),
      ('other', NOW(), NOW()),
      ('subscription', NOW(), NOW()),
      ('friend', NOW(), NOW()),
      ('salary', NOW(), NOW())
      ;`)

    await queryInterface.sequelize.query(`
        UPDATE expenses 
        SET "categoryId" = categories.id
        FROM categories
        WHERE expenses.category::text = categories.name `)
  },


  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DELETE FROM categories 
      WHERE name IN (
        'food', 'transport', 'entertainment', 'utilities', 
        'healthcare', 'shopping', 'education', 'travel', 
        'cig', 'other', 'subscription', 'friend', 'salary'
      );
    `);

    await queryInterface.sequelize.query(`
      UPDATE expenses SET "categoryId" = NULL;
    `);
  }
}
