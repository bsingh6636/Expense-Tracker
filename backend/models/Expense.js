const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    static associate(models) {
      Expense.belongsTo(models.Friend, {
        foreignKey: 'friendId',
        as: 'friend'
      });
      Expense.belongsTo(models.category,{
        foreignKey: 'categoryId',
        as: 'Category' 
      });
    }
  }
  
  Expense.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01,
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255]
      }
    },
    categoryId : {
      type : DataTypes.INTEGER,
      allowNull : false,
      references : {
        name : 'categories',
        key : 'id',
      },
      onUpdate : 'CASCADE',
      onDelete: 'SET NULL'

    },
    category: {
      type: DataTypes.ENUM(
        'food',
        'transport',
        'entertainment',
        'utilities',
        'healthcare',
        'shopping',
        'education',
        'travel',
        'cig',
        'other',
        'subscription',
        'friend'
      ),
      allowNull: false,
      defaultValue: 'other'
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    txn_type: {
      type: DataTypes.ENUM('debit', 'credit'),
      allowNull: false,
      defaultValue: 'debit'
    },
    payer_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        len: [1, 255]
      },
      defaultValue: 'brijesh'
    },
    payment_method: {
      type: DataTypes.ENUM(
        'cash',
        'credit_card',
        'debit_card',
        'online_transfer',
        'other',
        'upi'
      ),
      allowNull: false,
      defaultValue: 'upi'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        len: [1, 255]
      }
    },
    current_balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    },
    friendId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'friends',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Expense',
    tableName: 'expenses',
    timestamps: true,
    indexes: [
      {
        fields: ['date']
      },
      {
        fields: ['category']
      },
      {
        fields: ['txn_type']
      },
      {
        fields: ['payment_method']
      },
      {
        fields: ['payer_name']
      },
      {
        fields: ['friendId']
      }
    ]
  });

  // Instance methods
  Expense.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    values.amount = parseFloat(values.amount);
    if (values.current_balance) {
      values.current_balance = parseFloat(values.current_balance);
    }
    return values;
  };

  // Additional instance methods
  Expense.prototype.getFormattedAmount = function () {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(this.amount);
  };

  Expense.prototype.getFormattedBalance = function () {
    if (this.current_balance) {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
      }).format(this.current_balance);
    }
    return '₹0.00';
  };

  Expense.prototype.isCredit = function () {
    return this.txn_type === 'credit';
  };

  Expense.prototype.isDebit = function () {
    return this.txn_type === 'debit';
  };

  // Class methods
  Expense.getCategorySummary = async function () {
    const summary = await this.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      group: ['category'],
      order: [[sequelize.fn('SUM', sequelize.col('amount')), 'DESC']]
    });

    return summary.map(item => ({
      category: item.category,
      count: parseInt(item.dataValues.count),
      total: parseFloat(item.dataValues.total)
    }));
  };

  // Transaction type summary
  Expense.getTransactionSummary = async function () {
    const summary = await this.findAll({
      attributes: [
        'txn_type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      group: ['txn_type']
    });

    return summary.map(item => ({
      txn_type: item.txn_type,
      count: parseInt(item.dataValues.count),
      total: parseFloat(item.dataValues.total)
    }));
  };

  // Payment method summary
  Expense.getPaymentMethodSummary = async function () {
    const summary = await this.findAll({
      attributes: [
        'payment_method',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
      ],
      group: ['payment_method'],
      order: [[sequelize.fn('SUM', sequelize.col('amount')), 'DESC']]
    });

    return summary.map(item => ({
      payment_method: item.payment_method,
      count: parseInt(item.dataValues.count),
      total: parseFloat(item.dataValues.total)
    }));
  };

  // Get net balance (credits - debits)
  Expense.getNetBalance = async function () {
    const [credits, debits] = await Promise.all([
      this.findOne({
        attributes: [[sequelize.fn('SUM', sequelize.col('amount')), 'total']],
        where: { txn_type: 'credit' },
        raw: true
      }),
      this.findOne({
        attributes: [[sequelize.fn('SUM', sequelize.col('amount')), 'total']],
        where: { txn_type: 'debit' },
        raw: true
      })
    ]);

    const creditTotal = parseFloat(credits?.total || 0);
    const debitTotal = parseFloat(debits?.total || 0);

    return {
      credits: creditTotal,
      debits: debitTotal,
      net_balance: creditTotal - debitTotal
    };
  };

  return Expense;
};