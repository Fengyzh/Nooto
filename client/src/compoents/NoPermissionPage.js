import React from 'react'
import { useNavigate } from 'react-router-dom';
import '../compoentStyles/NotFoundPage.css'


export default function NoPermissionPage() {
    let navigate = useNavigate();


  return (
    <div className='not-found-container'>
        <h1 className='not-found-title'> You have no permission to access this Nooto</h1>
        <button className='not-found-btn' onClick={()=>navigate("/")}> Return to Home Page</button>

    </div>
  )
}
