const express = require('express');
const router = express.Router();
const { Expense } = require('../models');
const { validateExpense } = require('../middleware/validation');
const { createExpense, getExpenses } = require('../controllers/expense');

// GET /api/expenses - Get all expenses
router.get('/',  (req, res) => {
   getExpenses(req , res)
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


router.post('/', async (req, res) => {
   const data = await createExpense(req.body);
   res.json(data);
});

// PUT /api/expenses/:id - Update expense
router.put('/:id', validateExpense, async (req, res) => {
  try {
    const { amount, description, category, date, txn_type, payment_method, balance  } = req.body;
    
    const expense = await Expense.findByPk(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
   const updated = await expense.update({
      amount: parseFloat(amount),
      description,
      category,
      date: date ? new Date(date) : expense.date,
      txn_type, payment_method, 
      current_balance : balance
    });
    
    res.json(updated);
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
// router.get('/summary/categories', async (req, res) => {
//   try {
//     const summary = await Expense.getCategorySummary();
//     res.json(summary);
//   } catch (error) {
//     console.error('Error fetching category summary:', error);
//     res.status(500).json({ error: 'Failed to fetch category summary' });
//   }
// });

module.exports = router;