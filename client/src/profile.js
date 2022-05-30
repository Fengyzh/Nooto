import React from 'react'
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { userContext } from './userContext';
import { UserAuth } from './AuthContext';


export default function Profile() {

    let navigate = useNavigate();
    const {currentUser, logout} = UserAuth();
    const [note, setNote] = useState("");
/*
    const logout = () => {
        axios.get('/logout').then((response) => setauth(response.data.auth))
        navigate("/login")

    }
  */
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

    const handleLogout = async () =>{
        try {
            await logout()
            console.log("logged out")
            navigate("/")
        } catch (e) {
            console.log(e.message)
        }
    }


    const handleRegTest = () => {
        console.log(currentUser.email)
        console.log(currentUser.uid)
        console.log(currentUser)

        axios.post('/userTest', {
            UID: currentUser.uid,
            Email: currentUser.email
          })
          .then(function (response) {
            console.log(response);
          })
    }

    const handleRegCheck = () => {
        axios.get(`/userTest/${"628d9abc72050685e5766fd6"}`
        ).then (res => {
            console.log("success")
            console.log(res.data.Nooto[0].values[0].title)
            //setNote(res.data.Nooto[0].values[0].title)
        })


    }


    useEffect(() => {
        axios.get(`/user/getnooto/${"628d9abc72050685e5766fd6"}`
        ).then (res => {
            console.log("success")
            console.log(res.data)
            setNote(res.data.Nooto)
        })
    }, [])
    


    return (
        

        <div>
            
            {console.log("profile: ")}
            {console.log(currentUser)}

            
            <div>
            <h1>
                You are logged in
            </h1>
            <h2>{currentUser && currentUser.email}</h2>
            
            <button onClick={handleLogout}> Logout </button>
            <button onClick={handleRegTest}> Reg Test</button>
            <button onClick={handleRegCheck}> Reg Check</button>


            <div className='nooto-container'>
            {note? 
                note.map((value)=>{
                    return <div> {value.title} </div>
                })
                : "" }

            </div>

            </div>


        </div>
    )
}
