import React,{useState} from 'react';
export default function Login({onLogin}){
 const [email,setEmail]=useState(''),[password,setPassword]=useState('');
 return <div className='auth-container'>
  <h2>Login</h2>
  <form className='auth-form' onSubmit={e=>{e.preventDefault();onLogin(email,password);}}>
   <input value={email} onChange={e=>setEmail(e.target.value)} placeholder='Email' required/>
   <input type='password' value={password} onChange={e=>setPassword(e.target.value)} placeholder='Password' required/>
   <button>Login</button>
  </form>
 </div>;
}