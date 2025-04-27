import { useEffect,useState } from 'react';
import { db } from '../firebase';
import {
  collection, query, orderBy, limit, onSnapshot
} from 'firebase/firestore';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';
ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend);

export default function DeviceCard({dev,isAdmin,claim}){
  const [readings,setReadings]=useState([]);

  useEffect(()=>{
    const q=query(
      collection(db,'devices',dev.id,'readings'),
      orderBy('timestamp','desc'),
      limit(20)
    );
    const unsub=onSnapshot(q,snap=>{
      setReadings(
        snap.docs.map(d=>({...d.data(),id:d.id})).reverse()
      );
    });
    return unsub;
  },[dev.id]);

  const labels=readings.map(r=>
    new Date(r.timestamp.seconds*1000).toLocaleTimeString());
  const data={
    labels,
    datasets:[
      {
        label:'Temp °C',
        data:readings.map(r=>r.temperature),
        borderWidth:2
      },
      {
        label:'Hum %',
        data:readings.map(r=>r.humidity),
        borderWidth:2
      }
    ]
  };

  const toggleRelay=async state=>{
    await fetch(`https://api.particle.io/v1/devices/${dev.id}/relay`,{
      method:'POST',
      headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body:`access_token=${import.meta.env.VITE_PARTICLE_TOKEN}&args=${state}`
    });
  };

  return(
    <article className="bg-white shadow rounded-2xl p-6 flex flex-col">
      <h3 className="text-lg font-bold text-primary-800 mb-2">
        {dev.name||dev.id}
      </h3>
      <Line data={data} className="mb-4"/>
      <div className="flex gap-2">
        <button onClick={()=>toggleRelay('on')}
                className="flex-1 py-2 rounded bg-primary-600 text-white">
          ON
        </button>
        <button onClick={()=>toggleRelay('off')}
                className="flex-1 py-2 rounded border border-primary-600 text-primary-600">
          OFF
        </button>
      </div>
      {!isAdmin &&
        <button onClick={()=>claim(dev.id)}
                className="mt-2 text-xs underline text-primary-700">
          Claim device
        </button>}
    </article>
  );
}
