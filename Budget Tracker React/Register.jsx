import React,{useState} from 'react';
export default function Register({onRegister}){
 const [name,setName]=useState(''),[email,setEmail]=useState(''),[password,setPassword]=useState('');
 return <div className='auth-container'>
  <h2>Register</h2>
  <form className='auth-form' onSubmit={e=>{e.preventDefault();onRegister({name,email,password,transactions:[],categories:[],savings:[]});}}>
   <input value={name} onChange={e=>setName(e.target.value)} placeholder='Full Name' required/>
   <input value={email} onChange={e=>setEmail(e.target.value)} placeholder='Email' required/>
   <input type='password' value={password} onChange={e=>setPassword(e.target.value)} placeholder='Password' required/>
   <button>Register</button>
  </form>
 </div>;
}