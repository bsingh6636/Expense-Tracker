
const db = require("../models");
const logger = require("../utils/logger");
const { paramsValidator } = require("../utils/paramsValidator");
const { ensureArray } = require("../utils/utils");

const { Op } = db.Sequelize;

const createExpense = async params => {
  try {

    const { amount, description, category, date, txn_type, payment_method, balance } = params;;

    if (category == 'friend' && !params.friendId) {
      return { error: 'Friend ID is required for friend category' };
    }

    const expense = await db.Expense.create({
      amount: parseFloat(amount),
      description,
      category,
      txn_type,
      payment_method,
      current_balance: balance,
      friendId: params.friendId,
      date: date ? new Date(date) : new Date()
    });

    logger.info(`Expense created with ID: ${expense.id}`);

    return expense;

  } catch (error) {
    console.error('Error creating expense:', error);

    if (error.name === 'SequelizeValidationError') {
      return {
        error: 'Validation error',
        details: error.errors.map(e => e.message)
      };
    }

    return { error: 'Failed to create expense' };
  }
}

const getExpenses = async (req, res) => {
  try {
    let { 'category[]': category, 'friends[]': friends, limit = 50, offset = 0,  } = req?.query;


    let whereClause = {};
    if (category) {
      category = ensureArray(category);
      whereClause.categoryId = { [Op.in]: category }
    }

    if(friends){
      friends = ensureArray(friends);
      whereClause.friendId = { [Op.in] : friends }
    }

    const expenses = await db.Expense.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
}



module.exports = {
  createExpense,
  getExpenses,
}