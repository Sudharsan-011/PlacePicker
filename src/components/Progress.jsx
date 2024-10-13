import React from 'react'
import { useEffect, useState } from "react";
const timer=3000;
const Progress= () => {

  const [remainingT,setRemainingT]=useState(timer);
const interval=setInterval(()=>{
  setRemainingT((val)=>{val-10});
return()=>{
  clearInterval(interval);
}
},10);
  return (
    <progress value={remainingT} max={timer}/>

  )
}

export default Progress;