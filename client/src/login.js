import React, { useContext } from 'react'
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { userContext } from './userContext';
import { UserAuth } from './AuthContext';



export default function Login({isAuth}) {
    //const {auth, setauth} = useContext(userContext)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    let navigate = useNavigate();

    const { login, currentUser } = UserAuth()

    
  
    //const [title, setTitle] = useState({});
  
  
  /*
    async function getStuff() {
      /*
      await fetch('/auth').then(res => res.json())
      .then(titles => setauth(titles))
  
      axios.get('/auth').then(res => setauth(res.data.auth))
      
  
    }

    useEffect(() => {
        getStuff()
    
    }, [])
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



    return (

        <div>
            <form id="form" onSubmit={(handleSubmit)}>

                <label for="username_field"> Email: </label>
                <input onChange={(e)=>setEmail(e.target.value)} type="text" id="username_field" name ="username"/>

                <label for="password_field"> Password: </label>
                <input onChange={(e)=>setPassword(e.target.value)} type="text" id="password_field" name ="password"/>

                <input type="submit" value="Login"/>

            </form>
            <button>Logout</button>



        </div>
    )
}
