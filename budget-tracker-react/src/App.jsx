import React, { useState, useEffect } from 'react';
import './App.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const App = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState('login');
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);

  const [formData, setFormData] = useState({
    email: '', password: '', name: ''
  });

  const [txData, setTxData] = useState({
    description: '', category: '', amount: '', date: '', type: 'expense', recurrence: 'one-time'
  });

  const income = transactions.filter(tx => tx.type === 'income').reduce((a, b) => a + parseFloat(b.amount || 0), 0);
  const expenses = transactions.filter(tx => tx.type === 'expense').reduce((a, b) => a + parseFloat(b.amount || 0), 0);

  const handleLogin = (e) => {
    e.preventDefault();
    setUser({
      name: formData.email.split('@')[0],
      email: formData.email,
      transactions: [],
      categories: [],
      savingsGoals: []
    });
    setForm('');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setUser({
      name: formData.name,
      email: formData.email,
      transactions: [],
      categories: [],
      savingsGoals: []
    });
    setForm('');
  };

  const handleTxSubmit = (e) => {
    e.preventDefault();
    setTransactions(prev => [...prev, txData]);
    setTxData({ description: '', category: '', amount: '', date: '', type: 'expense', recurrence: 'one-time' });
  };

  return (
    <div className="container">
      {!user && form === 'login' && (
        <div className="auth-container">
          <h2>Login</h2>
          <form onSubmit={handleLogin} className="auth-form">
            <input type="email" placeholder="Email" required onChange={e => setFormData({ ...formData, email: e.target.value })} />
            <input type="password" placeholder="Password" required onChange={e => setFormData({ ...formData, password: e.target.value })} />
            <button type="submit">Login</button>
          </form>
          <p>Don't have an account? <a href="#" onClick={() => setForm('register')}>Register</a></p>
        </div>
      )}

      {!user && form === 'register' && (
        <div className="auth-container">
          <h2>Register</h2>
          <form onSubmit={handleRegister} className="auth-form">
            <input type="text" placeholder="Full Name" required onChange={e => setFormData({ ...formData, name: e.target.value })} />
            <input type="email" placeholder="Email" required onChange={e => setFormData({ ...formData, email: e.target.value })} />
            <input type="password" placeholder="Password" required onChange={e => setFormData({ ...formData, password: e.target.value })} />
            <button type="submit">Register</button>
          </form>
          <p>Already have an account? <a href="#" onClick={() => setForm('login')}>Login</a></p>
        </div>
      )}

      {user && (
        <>
          <header className="app-header">
            <h1>Budget Tracker</h1>
            <div className="user-info">
              <span>{user.name}</span>
              <button onClick={() => { setUser(null); setForm('login'); }}>Logout</button>
            </div>
          </header>

          <div className="balance-container">
            <h2>Current Balance</h2>
            <h3 id="balance">KSh{(income - expenses).toFixed(2)}</h3>
          </div>

          <div className="summary">
            <div className="income">
              <h4>Income</h4>
              <p id="income-amount">KSh{income.toFixed(2)}</p>
            </div>
            <div className="expense">
              <h4>Expense</h4>
              <p id="expense-amount">KSh{expenses.toFixed(2)}</p>
            </div>
          </div>

          <div className="chart-section">
            <h3>Income vs Expenses Chart</h3>
            <Doughnut data={{
              labels: ['Income', 'Expenses'],
              datasets: [{
                data: [income, expenses],
                backgroundColor: ['#27ae60', '#e74c3c']
              }]
            }} />
          </div>

          <form onSubmit={handleTxSubmit} className="auth-form">
            <input placeholder="Description" required value={txData.description} onChange={e => setTxData({ ...txData, description: e.target.value })} />
            <input placeholder="Category" required value={txData.category} onChange={e => setTxData({ ...txData, category: e.target.value })} />
            <input type="number" placeholder="Amount" required value={txData.amount} onChange={e => setTxData({ ...txData, amount: e.target.value })} />
            <input type="date" required value={txData.date} onChange={e => setTxData({ ...txData, date: e.target.value })} />
            <select required value={txData.type} onChange={e => setTxData({ ...txData, type: e.target.value })}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <button type="submit">Add Transaction</button>
          </form>

          <div className="transactions">
            <h3>Transaction History</h3>
            <ul id="transaction-list">
              {transactions.map((tx, index) => (
                <li key={index} className={tx.type}>
                  <span>{tx.date}: {tx.description} ({tx.category})</span>
                  <span>KSh{parseFloat(tx.amount).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
