import { useEffect,useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth,db } from '../firebase';
import {
  collection, onSnapshot, query, where, doc, updateDoc
} from 'firebase/firestore';
import DeviceCard from './DeviceCard';

export default function Dashboard({user}){
  const [devices,setDevices]=useState([]);
  const isAdmin=user?.stsTokenManager?.claims?.role==="admin";

  useEffect(()=>{
    const ref=collection(db,'devices');
    const q=isAdmin?ref:query(ref,where('ownerUid','==',user.uid));
    const unsub=onSnapshot(q,snap=>{
      setDevices(snap.docs.map(d=>({id:d.id,...d.data()})));
    });
    return unsub;
  },[user]);

  const claimDevice=async id=>{
    if(isAdmin) return;
    await updateDoc(doc(db,'devices',id),{ownerUid:user.uid});
  };

}
