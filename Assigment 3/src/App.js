import React, { useState } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import './styles/App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  
  const addExpense = (newExpense) => {
    const expenseWithId = { ...newExpense, id: Date.now() };
    setExpenses([...expenses, expenseWithId]);
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const totalAmount = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Expense Tracker</h1>
        <p>Keep track of your spending</p>
      </header>
      <main className="app-main">
        <div className="form-section">
          <ExpenseForm onAddExpense={addExpense} />
        </div>
        <div className="list-section">
          <div className="total-display">
            <h2>Total: ${totalAmount.toFixed(2)}</h2>
          </div>
          <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
        </div>
      </main>
    </div>
  );
}

export default App;