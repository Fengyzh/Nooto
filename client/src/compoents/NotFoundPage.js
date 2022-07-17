import React from 'react'
import { useNavigate } from 'react-router-dom';
import '../compoentStyles/NotFoundPage.css'


export default function NotFoundPage() {
    let navigate = useNavigate();


  return (
    <div className='not-found-container'>
        <h1 className='not-found-title'> Nooto does not exist</h1>
        <button className='not-found-btn' onClick={()=>navigate("/")}> Return to Home Page</button>

    </div>
  )
}
