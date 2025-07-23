'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create friends table first
    await queryInterface.createTable('friends', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Check if ENUM exists and handle accordingly
    try {
      await queryInterface.sequelize.query(`
        DO $$ 
        BEGIN
          -- Check if the enum type exists
          IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_expenses_category') THEN
            -- Check if 'friend' value already exists in enum
            IF NOT EXISTS (
              SELECT 1 FROM pg_enum 
              WHERE enumlabel = 'friend' 
              AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_expenses_category')
            ) THEN
              ALTER TYPE "enum_expenses_category" ADD VALUE 'friend';
            END IF;
          ELSE
            -- Create the enum type if it doesn't exist
            CREATE TYPE "enum_expenses_category" AS ENUM (
              'food', 'transport', 'entertainment', 'utilities', 
              'healthcare', 'shopping', 'education', 'travel', 
              'cig', 'other', 'friend','food'
            );
          END IF;
        END $$;
      `);
    } catch (error) {
      console.log('ENUM handling error:', error.message);
      // If there's still an issue, try the fallback approach
      try {
        await queryInterface.sequelize.query(`
          ALTER TYPE "enum_expenses_category" ADD VALUE 'friend';
        `);
      } catch (fallbackError) {
        console.log('Fallback ENUM error:', fallbackError.message);
      }
    }

    // Add friendId column with foreign key
    await queryInterface.addColumn('expenses', 'friendId', {
      type: Sequelize.INTEGER, // Fixed: was Sequelize.Integer (should be INTEGER)
      allowNull: true,
      references: {
        model: 'friends',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Add index for better performance
    await queryInterface.addIndex('expenses', ['friendId']);

    // Insert default friend
    await queryInterface.sequelize.query(`
      INSERT INTO friends (name, "createdAt", "updatedAt") 
      VALUES ('Nitin', NOW(), NOW());
    `);
  },

  async down(queryInterface, Sequelize) {
    // Remove index first
    try {
      await queryInterface.removeIndex('expenses', ['friendId']);
    } catch (error) {
      console.log('Index removal error:', error.message);
    }

    // Remove foreign key column
    await queryInterface.removeColumn('expenses', 'friendId');

    // Drop friends table
    await queryInterface.dropTable('friends');

    // Note: Removing enum values is complex in PostgreSQL
    // You might need to recreate the entire enum type without 'friend'
  }
};