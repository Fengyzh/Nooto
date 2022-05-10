import React, { useContext } from 'react'
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { userContext } from './userContext';



export default function Login({isAuth}) {
    const {auth, setauth} = useContext(userContext)
    const [UserName, setUsername] = useState("")
    const [Password, setPassword] = useState("")
    const [state, setstate] = useState(false)

    const pass = useRef()
    let navigate = useNavigate();

    
  
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


    useEffect(() => {
        var form = document.getElementById("form");
    function handleForm(event) { event.preventDefault(); } 
    form.addEventListener('submit', handleForm);

       
    })
  


     const login_user = () => {
            axios.post('/login', {
                username: UserName,
                password: pass.current.value
             }).then((response) => setauth(response.data.auth))
             
            

            //.then(isAuth? navigate("/profile") : navigate("/login"))
    }

    const logout = () => {
        axios.get('/logout').then((response) => setauth(response.data.auth))
         //navigate('/profile')


        //.then(isAuth? navigate("/profile") : navigate("/login"))
}



    return (

        <div>
            {auth? <p>Logged in</p> : <p>Not logged in</p>}
            {auth? navigate("/profile") : ""}
            <form id="form" onSubmit={login_user}>

                <label for="username_field"> Username: </label>
                <input type="text" id="username_field" name ="username"/>

                <label for="password_field"> Password: </label>
                <input ref={pass} type="text" id="password_field" name ="password"/>

                <input type="submit" value="Login"/>

            </form>
            <button onClick={logout}>Logout</button>



        </div>
    )
}
