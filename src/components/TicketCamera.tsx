import React,{useEffect,useState} from 'react';
import {Html5QrcodeScanner} from 'html5-qrcode';
export function TicketCamera({onRead}:{onRead:(code:string)=>void}){
 const [error,setError]=useState('');
 useEffect(()=>{
  const scanner=new Html5QrcodeScanner('smart-exit-camera',{fps:10,qrbox:250,rememberLastUsedCamera:false},false);
  let alive=true;
  scanner.render(text=>{if(alive){onRead(text);void scanner.clear().catch(()=>{});}},()=>{});
  return ()=>{alive=false;void scanner.clear().catch(()=>{});};
 },[onRead]);
 return <div><div id="smart-exit-camera"/>{error&&<p role="alert">{error}</p>}</div>;
}
