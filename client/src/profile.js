import React, { useRef } from 'react'
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { deleteUser, updateProfile } from 'firebase/auth'
import { useNavigate } from 'react-router';
import { userContext } from './userContext';
import { UserAuth } from './AuthContext';
import "./profile.css"
import ProfileCard from './compoents/ProfileCompoents/ProfileCard';
import Message from './compoents/Message';


/*
    TODO:
     - Make the Nooto container it's own compoent

*/

export default function Profile() {

    let navigate = useNavigate();
    const {currentUser, logout} = UserAuth();
    const [note, setNote] = useState("");
    const [edit, setEdit] = useState(false)
    const [name, setName] = useState("")
    const [msg, setMsg] = useState("")

  


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

    const handleProfileEdit = () => {
        setEdit(!edit)
        /*
        let editPanel = document.getElementsByClassName("profile-edit")[0]

        
        if (!edit) {
            editPanel.style.transform = "translateX(0rem)"
        } else {
            editPanel.style.transform = "translateX(25rem)"
        }
        */
    }

    function updateProfileChanges() {
        if (currentUser) {
            
             axios.post('/user/name', {
                uid: currentUser.uid,
                newName: name
            })


            updateProfile(currentUser, {
                displayName:name
            })
            

            setMsg("Profile Updated")

            let msgPopup = setTimeout(()=>{
                setMsg("")
            }, 2000)
        }
    }


    async function handleDeleteUser() {
            if (currentUser) {
                await axios.delete(`/users/${currentUser.uid}`).then((res) => {
                deleteUser(currentUser)

            })
        }


    }


    useEffect(() => {
        if (currentUser) {
        axios.get(`/user/getnooto/${currentUser.uid}`
        ).then (res => {
            if (res && res.data) {
            console.log("success")
            console.log(res.data)
            setNote(res.data.Nooto)
            }
        })
    }
    }, [currentUser])

    


    return (
        

        <div className='profile-page'>
            
            {console.log("profile: ")}
            {console.log(currentUser)}

            {msg? <Message props={{msg ,pos:"top", margin:"1"}}/> : ""}
            
            <div className='profile-container'>
                {/*
            <h1>
                You are logged in
            </h1>
    */}
            <div className='header-section'>
                <h1 className='welcome-block'> Welcome {currentUser && currentUser.displayName ? currentUser.displayName : "New User"}</h1>
                
                <div className='profile-section'>
                    <div>
                        <h1 onClick={handleProfileEdit}>O</h1>
                    </div>

                    <button onClick={handleLogout}> Logout </button>
                </div>

            {edit?
                <div className='profile-edit'>
                    <div className='profile-edit-title'>
                        <h2> Edit Profile</h2>
                        <h2 className='profile-edit-close-btn' onClick={handleProfileEdit}>X</h2>
                        
                    </div>

                    <div className='profile-edit-label-container'>
                        <h3 className='profile-edit-labels'> Name: </h3>
                    </div>
                    <input id="profile-edit-name" className='profile-edit-name' type="text" placeholder={currentUser && currentUser.displayName? currentUser.displayName : ""} onChange={(e)=>setName(e.target.value)}/>
                    <button onClick={updateProfileChanges} className='profile-update-btn profile-btn'>Update Profile</button>
                    <button onClick={handleDeleteUser} className='profile-delete-btn profile-btn'> Delete Account</button>
                </div>
                : "" }


            </div>
            <div className='nooto-head-bar'>
            {/*<button onClick={handleRegTest}> Reg Test</button>
            <button onClick={handleRegCheck}> Reg Check</button>*/}
            <h1 className='head-bar-items head-bar-title'>Your Nooto</h1>
            <button className='head-bar-items head-bar-btn' onClick={handleNewNooto}> New Nooto </button>
            </div>

            <div className='nooto-container'>
                
            {note? 
                note.map((value)=>{
                    return (

                        <ProfileCard currentUser={currentUser} value = {value}/>

                    )
                })
                : "Currently No Nooto" }

            </div>

            </div>


        </div>
    )
}
