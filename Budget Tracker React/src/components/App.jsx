import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import useLocalStorage from '../hooks/useLocalStorage';

export default function App(){
 const [users,setUsers]=useLocalStorage('users',[]);
 const [current,setCurrent]=useLocalStorage('currentUser',null);

 const handleLogin=(email,password)=>{
   const u=users.find(x=>x.email===email && x.password===password);
   if(u) setCurrent(u); else alert('Invalid credentials');
 };
 const handleRegister=(user)=>{
   setUsers([...users,user]);
   setCurrent(user);
 };
 const logout=()=>setCurrent(null);

 return current?
   <Dashboard user={current} setUser={u=>{setCurrent(u);setUsers(users.map(x=>x.email===u.email?u:x));}} logout={logout}/>:
   <>
     <Login onLogin={handleLogin} />
     <Register onRegister={handleRegister}/>
   </>;
}
