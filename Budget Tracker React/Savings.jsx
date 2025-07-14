import React, { useState } from 'react';

export default function Savings({ savings, setSavings }) {
  const [goalName, setGoalName] = useState('');
  const [target, setTarget] = useState('');

  const addGoal = () => {
    if (!goalName || isNaN(target) || +target <= 0) return alert("Enter valid goal and amount");
    setSavings([...savings, { name: goalName, target: +target, saved: 0 }]);
    setGoalName('');
    setTarget('');
  };

  const addToGoal = (i) => {
    const amt = parseFloat(prompt(`Add amount to ${savings[i].name}:`));
    if (isNaN(amt) || amt <= 0) return;
    const updated = [...savings];
    updated[i].saved += amt;
    if (updated[i].saved >= updated[i].target) alert(`🎉 Goal "${updated[i].name}" reached!`);
    setSavings(updated);
  };

  return <div className='savings-section'>
    <h3>Savings Goals</h3>
    <div>
      {savings.map((g, i) => <div key={i} className='savings-goal'>
        <h4>{g.name}</h4>
        <p>Target: KSh{g.target.toFixed(2)}</p>
        <p>Saved: KSh{g.saved.toFixed(2)}</p>
        <button onClick={() => addToGoal(i)}>Add to Savings</button>
      </div>)}
    </div>
    <input value={goalName} onChange={e => setGoalName(e.target.value)} placeholder='Goal Name' />
    <input value={target} onChange={e => setTarget(e.target.value)} placeholder='Target (KSh)' />
    <button onClick={addGoal}>Add Goal</button>
  </div>;
}
