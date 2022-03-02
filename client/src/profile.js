import React from 'react'
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { userContext } from './userContext';


export default function Profile({isAuth, name}) {
    const {auth, setauth} = useContext(userContext)

    let navigate = useNavigate();


    const logout = () => {
        axios.get('/logout').then((response) => setauth(response.data.auth))
        navigate("/login")

    }
  
    //const [title, setTitle] = useState({});
  
  
  /*
    function getStuff() {
      /*
      await fetch('/auth').then(res => res.json())
      .then(titles => setauth(titles))
  
      axios.get('/auth').then(res => setauth(res.data.auth))
      
  
    }

    useEffect(() => {
        getStuff()
    
    }, [auth])
    */


    return (
        <div>
            {console.log("profile: " + auth)}

            {isAuth?
            <div>
            <h1>
                You are logged in  {name}
            </h1>
            
            <button onClick={logout}> Logout </button>
          

            </div>



 : <p> Not logged in</p> }
        </div>
    )
}
