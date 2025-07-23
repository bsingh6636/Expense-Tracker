
const db = require("../models");
const logger = require("../utils/logger");
const { paramsValidator } = require("../utils/paramsValidator");

const createExpense = async params =>{
    try {

    const { amount, description, category, date, txn_type, payment_method, balance } = params;;

    if(category  == 'friend' && !params.friendId) {
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
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({ error: 'Failed to create expense' });
  }
}

module.exports = {
  createExpense
}