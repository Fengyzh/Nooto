import React from 'react'
import { useNavigate } from 'react-router-dom';


export default function Home() {
  let nav = useNavigate();

 const handleRedirect = ()=> {
    let input = document.getElementById("input-field").value;
    

  
    nav(`/doc/${input}`);


 }



  return (
    <div> 
      
      <h1> Nooto Home Page </h1>

      <h2>Enter the Nooto ID</h2>
      <input id="input-field" type="text" placeholder='Enter ID here'/>
      <button onClick={handleRedirect}> Go to this Nooto </button>
      <a href='/login'>Login Page </a>

      <p>6241f98cba8bd3aa074e0e49</p>
    </div>
  )
}
