const validateExpense = (req, res, next) => {
  const { amount, description, category } = req.body;
  const errors = [];

  // Validate amount
  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
    errors.push('Amount must be a positive number');
  }

  // Validate description
  if (!description || description.trim().length === 0) {
    errors.push('Description is required');
  } else if (description.length > 255) {
    errors.push('Description must be less than 255 characters');
  }

  // Validate category
  const validCategories = [
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
    'friend'
  ];
  
  if (!category || !validCategories.includes(category)) {
    errors.push('Category must be one of: ' + validCategories.join(', '));
  }

  // Validate date if provided
  if (req.body.date) {
    const date = new Date(req.body.date);
    if (isNaN(date.getTime())) {
      errors.push('Invalid date format');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

module.exports = {
  validateExpense
};