import React, { useState } from 'react';

function ExpenseForm({ onAddExpense }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState({});
  
  const categories = [
    { value: '', label: 'Select a category (optional)' },
    { value: 'housing', label: 'Housing' },
    { value: 'grocery', label: 'Grocery' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'clothes', label: 'Clothes' },
    { value: 'other', label: 'Other' }
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Please enter a title for this expense';
    if (!amount.trim()) newErrors.amount = 'Amount is required';
    else if (isNaN(amount) || parseFloat(amount) <= 0) newErrors.amount = 'Please enter a valid positive number';
    if (!date.trim()) newErrors.date = 'Please select a date';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setErrors({});
    onAddExpense({
      title: title.trim(),
      amount: amount.trim(),
      date: date,
      category: category || '-'
    });
    
    // clear form
    setTitle('');
    setAmount('');
    setDate('');
    setCategory('');
  };

  return (
    <div className="expense-form">
      <h2>Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">What did you buy? *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Coffee, Groceries, Gas"
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount *</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            className={errors.amount ? 'error' : ''}
          />
          {errors.amount && <span className="error-message">{errors.amount}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={errors.date ? 'error' : ''}
          />
          {errors.date && <span className="error-message">{errors.date}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-btn">Add Expense</button>
      </form>
    </div>
  );
}

export default ExpenseForm;