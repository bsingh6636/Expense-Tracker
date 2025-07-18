'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create the expenses table with all columns
    await queryInterface.createTable('expenses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      category: {
        type: Sequelize.ENUM(
          'food',
          'transport',
          'entertainment',
          'utilities',
          'healthcare',
          'shopping',
          'education',
          'travel',
          'cig',
          'other'
        ),
        allowNull: false,
        defaultValue: 'other'
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      txn_type: {
        type: Sequelize.ENUM('debit', 'credit'),
        allowNull: false,
        defaultValue: 'debit'
      },
      payer_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: 'brijesh'
      },
      payment_method: {
        type: Sequelize.ENUM(
          'cash',
          'credit_card',
          'debit_card',
          'online_transfer',
          'other'
        ),
        allowNull: false,
        defaultValue: 'other'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      location: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      current_balance: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes after table creation - wrapped in try-catch for safety
    try {
      await queryInterface.addIndex('expenses', ['date'], {
        name: 'idx_expenses_date'
      });

      await queryInterface.addIndex('expenses', ['category'], {
        name: 'idx_expenses_category'
      });

      await queryInterface.addIndex('expenses', ['txn_type'], {
        name: 'idx_expenses_txn_type'
      });

      await queryInterface.addIndex('expenses', ['payment_method'], {
        name: 'idx_expenses_payment_method'
      });

      await queryInterface.addIndex('expenses', ['payer_name'], {
        name: 'idx_expenses_payer_name'
      });

      console.log('✅ All indexes created successfully');
    } catch (error) {
      console.error('❌ Error creating indexes:', error.message);
      // Don't throw error, just log it - indexes are not critical for basic functionality
    }
  },

  async down(queryInterface, Sequelize) {
    // Drop indexes first (if they exist)
    const indexes = [
      'idx_expenses_date',
      'idx_expenses_category', 
      'idx_expenses_txn_type',
      'idx_expenses_payment_method',
      'idx_expenses_payer_name'
    ];

    for (const indexName of indexes) {
      try {
        await queryInterface.removeIndex('expenses', indexName);
      } catch (error) {
        // Index might not exist, ignore error
        console.log(`Index ${indexName} not found, skipping...`);
      }
    }

    // Drop the table
    await queryInterface.dropTable('expenses');
  }
};