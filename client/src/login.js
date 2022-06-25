import React, { useContext } from 'react'
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { userContext } from './userContext';
import { UserAuth } from './AuthContext';
import { Navigate } from 'react-router-dom'
import "./compoentStyles/Login.css"





export default function Login() {
    //const {auth, setauth} = useContext(userContext)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    let navigate = useNavigate();

    const { login, currentUser, state } = UserAuth()

    
  
    //const [title, setTitle] = useState({});
  
  
  /*
    async function getStuff() {
      /*
      await fetch('/auth').then(res => res.json())
      .then(titles => setauth(titles))
  
      axios.get('/auth').then(res => setauth(res.data.auth))
      
  
    }
    */







 const handleSubmit = async (e) => {
     e.preventDefault()
    try {
        await login(email, password)
        console.log("logged in")
        navigate("/")
    } catch (err) {
        console.log(err.message)
    }
 }

 const loginPage = (

    <div className='form-container'>
        <form className='reg-form' id="form" onSubmit={(handleSubmit)}>
            <h1 className="login-title">Login Account</h1>

            <label className='reg-label' for="username_field"> Email: </label>
            <input className='input-fields' onChange={(e)=>setEmail(e.target.value)} type="text" id="username_field" name ="username"/>

            <label className='reg-label' for="password_field"> Password: </label>
            <input className='input-fields' onChange={(e)=>setPassword(e.target.value)} type="password" id="password_field" name ="password"/>

            <input className='login-btn' type="submit" value="Login"/>

        </form>
        <div className='extra-links-container'>
            <a className='link-btn forget-pass-link' href='/forgetPassword'>Forget Password</a>
            <a className='link-btn reg-account-link' href='/reg'>Register an account</a>
        </div>


    </div>
)



 if (state.userDataPresent) {
    if (state.curuser != null) {

        return <Navigate to='/'/>
    } else {
        return loginPage
    }
}




 return <h1> Loading </h1>


  
}
