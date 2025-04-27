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

  return(
    <main className="max-w-6xl mx-auto p-6">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Hola, {user.email}</h2>
        <button onClick={()=>signOut(auth)} className="underline">Sign out</button>
      </header>
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {devices.length
          ? devices.map(d=>
              <DeviceCard key={d.id}
                          dev={d}
                          isAdmin={isAdmin}
                          claim={claimDevice}/>)
          : <p>No devices visible</p>}
      </section>
    </main>
  );
}
