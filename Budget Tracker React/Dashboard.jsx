import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import Savings from './Savings';
import Notifications from './Notifications';
ChartJS.register(ArcElement, Legend, Tooltip);

export default function Dashboard({ user, setUser, logout }) {
  const [tx, setTx] = useState({ description: '', category: '', amount: '', date: '', type: 'expense' });
  const [filter, setFilter] = useState({ category: '', type: '', dateStart: '', dateEnd: '' });
  const [notifs, setNotifs] = useState([]);
  const [goalState, setGoals] = useState(user.savings);

  const income = user.transactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
  const expense = user.transactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);

  const notify = msg => setNotifs(p => [...p, msg]);

  const addTx = e => {
    e.preventDefault();
    const newT = { ...tx, amount: parseFloat(tx.amount) };
    const updated = { ...user, transactions: [...user.transactions, newT] };
    setUser(updated);
    notify(`Added ${newT.type} of KSh${newT.amount}`);
    setTx({ description: '', category: '', amount: '', date: '', type: 'expense' });
  };

  const addCategory = () => {
    const name = prompt("Enter new category:");
    if (!name || user.categories.includes(name)) return;
    const updated = { ...user, categories: [...user.categories, name] };
    setUser(updated);
    notify(`Category "${name}" added`);
  };

  const filtered = user.transactions.filter(t => {
    const matchCat = !filter.category || t.category === filter.category;
    const matchType = !filter.type || t.type === filter.type;
    const matchStart = !filter.dateStart || t.date >= filter.dateStart;
    const matchEnd = !filter.dateEnd || t.date <= filter.dateEnd;
    return matchCat && matchType && matchStart && matchEnd;
  });

  return <div className='container'>
    <header className='app-header'><h1>Budget Tracker</h1><div className='user-info'><span>{user.name}</span><button onClick={logout}>Logout</button></div></header>
    <div className='balance-container'><h2>Balance</h2><h3>KSh{(income - expense).toFixed(2)}</h3></div>
    <div className='summary'>
      <div className='income'><h4>Income</h4><p>KSh{income.toFixed(2)}</p></div>
      <div className='expense'><h4>Expense</h4><p>KSh{expense.toFixed(2)}</p></div>
    </div>
    <div className='chart-section'><Doughnut data={{ labels: ['Income', 'Expense'], datasets: [{ data: [income, expense], backgroundColor: ['#27ae60', '#e74c3c'] }] }} /></div>

    <button onClick={addCategory}>Add Category</button>
    <form onSubmit={addTx}>
      <input value={tx.description} onChange={e => setTx({ ...tx, description: e.target.value })} placeholder='Description' required />
      <select value={tx.category} onChange={e => setTx({ ...tx, category: e.target.value })} required>
        <option value=''>Select Category</option>
        {user.categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
      </select>
      <input type='number' value={tx.amount} onChange={e => setTx({ ...tx, amount: e.target.value })} placeholder='Amount' required />
      <input type='date' value={tx.date} onChange={e => setTx({ ...tx, date: e.target.value })} required />
      <select value={tx.type} onChange={e => setTx({ ...tx, type: e.target.value })}>
        <option value='expense'>Expense</option><option value='income'>Income</option>
      </select>
      <button>Add Transaction</button>
    </form>

    <div className='transaction-filters'>
      <select value={filter.category} onChange={e => setFilter({ ...filter, category: e.target.value })}>
        <option value=''>All Categories</option>
        {user.categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
      </select>
      <select value={filter.type} onChange={e => setFilter({ ...filter, type: e.target.value })}>
        <option value=''>All Types</option>
        <option value='income'>Income</option><option value='expense'>Expense</option>
      </select>
      <input type='date' value={filter.dateStart} onChange={e => setFilter({ ...filter, dateStart: e.target.value })} />
      <input type='date' value={filter.dateEnd} onChange={e => setFilter({ ...filter, dateEnd: e.target.value })} />
    </div>

    <ul id='transaction-list'>
      {filtered.map((t, i) => <li key={i} className={t.type}><span>{t.date}: {t.description} ({t.category})</span><span>KSh{t.amount.toFixed(2)}</span></li>)}
    </ul>

    <Savings savings={goalState} setSavings={setGoals} />
    <Notifications messages={notifs} />
  </div>;
}
