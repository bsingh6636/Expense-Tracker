const express = require('express');
const router = express.Router();
const { Expense } = require('../models');
const { validateExpense } = require('../middleware/validation');

// GET /api/expenses - Get all expenses
router.get('/', async (req, res) => {
  try {
    const { category, startDate, endDate, limit = 50, offset = 0 } = req.query;
    
    let whereClause = {};
    
    if (category) {
      whereClause.category = category;
    }
    
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) {
        whereClause.date.$gte = new Date(startDate);
      }
      if (endDate) {
        whereClause.date.$lte = new Date(endDate);
      }
    }
    
    const expenses = await Expense.findAll({
      where: whereClause,
      order: [['date', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// GET /api/expenses/:id - Get single expense
router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json(expense);
  } catch (error) {
    console.error('Error fetching expense:', error);
    res.status(500).json({ error: 'Failed to fetch expense' });
  }
});

// POST /api/expenses - Create new expense
router.post('/', validateExpense, async (req, res) => {
  try {
    const { amount, description, category, date, txn_type, payment_method, balance } = req.body;
    
    const expense = await Expense.create({
      amount: parseFloat(amount),
      description,
      category,
      txn_type,
      payment_method,
      balance: Number(balance),
      date: date ? new Date(date) : new Date()
    });
    
    res.status(201).json(expense);
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
});

// PUT /api/expenses/:id - Update expense
router.put('/:id', validateExpense, async (req, res) => {
  try {
    const { amount, description, category, date } = req.body;
    
    const expense = await Expense.findByPk(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    await expense.update({
      amount: parseFloat(amount),
      description,
      category,
      date: date ? new Date(date) : expense.date
    });
    
    res.json(expense);
  } catch (error) {
    console.error('Error updating expense:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// DELETE /api/expenses/:id - Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    await expense.destroy();
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// GET /api/expenses/summary/categories - Get category summary
router.get('/summary/categories', async (req, res) => {
  try {
    const summary = await Expense.getCategorySummary();
    res.json(summary);
  } catch (error) {
    console.error('Error fetching category summary:', error);
    res.status(500).json({ error: 'Failed to fetch category summary' });
  }
});

module.exports = router;