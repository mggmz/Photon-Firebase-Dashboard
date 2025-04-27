import { useEffect, useState } from 'react';
import { onAuthStateChanged }  from 'firebase/auth';
import { auth } from './firebase';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export default function App(){
  const [user,setUser]=useState(null);
  useEffect(()=>onAuthStateChanged(auth,setUser),[]);
  return user?<Dashboard user={user}/>:<Login/>;
}
