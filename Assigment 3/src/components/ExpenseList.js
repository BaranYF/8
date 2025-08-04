import React from 'react';

function ExpenseList({ expenses, onDeleteExpense }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };
  
  const formatCategory = (category) => {
    return category === '-' ? '-' : category.charAt(0).toUpperCase() + category.slice(1);
  };
  
  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This can't be undone!`)) {
      onDeleteExpense(id);
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="expense-list empty">
        <div className="empty-state">
          <h3>No expenses yet</h3>
          <p>Add your first expense using the form above</p>
        </div>
      </div>
    );
  }

  return (
    <div className="expense-list">
      <h3>Expenses</h3>
      <div className="table-container">
        <table className="expenses-table">
          <thead>
            <tr>
              <th>What You Bought</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td className="expense-title">{expense.title}</td>
                <td className="expense-amount">${parseFloat(expense.amount).toFixed(2)}</td>
                <td className="expense-date">{formatDate(expense.date)}</td>
                <td className="expense-category">{formatCategory(expense.category)}</td>
                <td className="expense-actions">
                  <button onClick={() => handleDelete(expense.id, expense.title)} className="delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpenseList;