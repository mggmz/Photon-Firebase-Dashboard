import { useState } from 'react';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import clsx from 'clsx';

export default function Login(){
  const [form,setForm]=useState({email:'',pass:''});
  const [signUp,setSignUp]=useState(false);
  const [error,setError]=useState('');
  const handle=async e=>{
    e.preventDefault();
    try{
      if(signUp){
        await createUserWithEmailAndPassword(auth,form.email,form.pass);
      }else{
        await signInWithEmailAndPassword(auth,form.email,form.pass);
      }
    }catch(err){setError(err.message);}
  };
  return(
    <section className="flex flex-col items-center pt-24">
      <h1 className="text-4xl font-bold text-primary-700 mb-8">Photon Dashboard</h1>
      <form onSubmit={handle}
            className="bg-white shadow rounded-2xl p-8 w-80 flex flex-col gap-4">
        <input type="email" required placeholder="Email" className="border rounded p-2"
               value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
        <input type="password" required placeholder="Password" className="border rounded p-2"
               value={form.pass} onChange={e=>setForm({...form,pass:e.target.value})}/>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className={clsx(
                 "py-2 rounded text-white",
                 signUp?"bg-primary-500 hover:bg-primary-600"
                       :"bg-primary-700 hover:bg-primary-800")}>
          {signUp?"Sign Up":"Login"}
        </button>
        <button type="button" onClick={()=>setSignUp(!signUp)}
                className="text-xs text-primary-700 underline">
          {signUp?"I have an account → Login"
                 :"I need an account → Sign Up"}
        </button>
      </form>
    </section>
  );
}
