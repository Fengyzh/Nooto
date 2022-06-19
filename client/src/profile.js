import React from 'react'
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { userContext } from './userContext';
import { UserAuth } from './AuthContext';
import "./profile.css"


/*
    TODO:
     - Make the Nooto container it's own compoent

*/

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
            navigate("/home")
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

    const handleNewNooto = () => {
        if (currentUser) {
        axios.post('/nooto/newNooto', {
            UID: currentUser.uid
        }).then(res=>{
            console.log(res.data)
            navigate(`/doc/${res.data}`)
        })
    }

    }



    useEffect(() => {
        if (currentUser) {
        axios.get(`/user/getnooto/${currentUser.uid}`
        ).then (res => {
            console.log("success")
            console.log(res.data)
            setNote(res.data.Nooto)
        })
    }
    }, [currentUser])
    


    return (
        

        <div>
            
            {console.log("profile: ")}
            {console.log(currentUser)}

            
            <div>
                {/*
            <h1>
                You are logged in
            </h1>
    */}
            
            <h1 className='welcome-block'> Welcome {currentUser? currentUser.displayName : "User"}</h1>
            
            <button onClick={handleLogout}> Logout </button>
            <button onClick={handleRegTest}> Reg Test</button>
            <button onClick={handleRegCheck}> Reg Check</button>
            <button onClick={handleNewNooto}> New Nooto </button>


            <div className='nooto-container'>
            {note? 
                note.map((value)=>{
                    return (
                    <div className='profile-Nooto-container'> 
                        
                        
                        <a className='profile-Nooto-block' href={`/doc/${value._id}`}>
                            <div>
                                <h3>{value.title}</h3>
                            </div>
                            
                            </a> 
                    
                    
                    </div>
                    )
                })
                : "" }

            </div>

            </div>


        </div>
    )
}
