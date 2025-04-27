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