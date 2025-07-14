import React from 'react';
export default function Notifications({ messages }) {
  return <div id='notification-container'>
    {messages.map((msg, i) => (
      <div key={i} className='notification'>{msg}</div>
    ))}
  </div>;
}
